"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { preloadSound } from "./audio-bank";
import { preloadResources } from "./resource-preloader";
import PrintLoading from "./print-loading";
import PagePrint from "./print-page";

const AssetsReady = createContext(false);
export const useAssetsReady = () => useContext(AssetsReady);

// Keep decoded images, including CSS backgrounds, resident for this visit.
const preparedImages = new Map<string, HTMLImageElement>();

function preloadImage(source: string) {
  if (preparedImages.has(source)) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    let settled = false;
    const timer = window.setTimeout(() => finish(new Error(source)), 30000);
    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      image.onload = image.onerror = null;
      if (error) reject(error);
      else {
        preparedImages.set(source, image);
        resolve();
      }
    };
    image.decoding = "async";
    image.onload = () => image.decode().then(() => finish(), () => finish(new Error(source)));
    image.onerror = () => finish(new Error(source));
    image.src = source;
  });
}

function preloadAsset(source: string) {
  return /\.(?:mp3|m4a|aac|wav|ogg)$/i.test(source) ? preloadSound(source) : preloadImage(source);
}

type LoadState = "loading" | "preparing" | "printing" | "exiting" | "ready" | "error";

export default function AssetGate({ assets, children, label = "신문 인쇄 준비 중", printOnPage = false }: {
  assets: readonly string[];
  children: ReactNode;
  label?: string;
  printOnPage?: boolean;
}) {
  const [attempt, setAttempt] = useState(0);
  const [status, setStatus] = useState<LoadState>("loading");
  const [complete, setComplete] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const sceneRef = useRef<HTMLDivElement>(null);
  const total = new Set(assets).size;

  useEffect(() => {
    const controller = new AbortController();
    document.documentElement.dataset.assets = "loading";
    if (printOnPage) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setStatus("loading");
    setComplete(0);
    preloadResources(assets, preloadAsset, setComplete, controller.signal)
      .then((missing) => {
        setFailed(missing);
        setStatus(missing.length ? "error" : "preparing");
      }).catch(() => {});
    return () => controller.abort();
  }, [assets, attempt, printOnPage]);

  useEffect(() => {
    document.documentElement.dataset.assets = status;
    if (printOnPage && status === "ready" && window.location.hash) {
      // Honor incoming section links only after the same cover has finished printing.
      const frame = requestAnimationFrame(() => {
        if (document.documentElement.classList.contains("delivery-locked")) return;
        let id: string;
        try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
        if (id === "details") window.dispatchEvent(new Event("wedding:show-details"));
        else document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }
    if (status !== "preparing") return;
    let active = true;
    let firstFrame = 0;
    let secondFrame = 0;
    // Only eager images belong to the opening print sequence. Lazy images
    // load after scrolling; waiting for their decode here deadlocks the gate.
    Promise.all([
      document.fonts.ready,
      ...[...(sceneRef.current?.querySelectorAll<HTMLImageElement>('img:not([loading="lazy"])') ?? [])].map((image) => image.decode()),
    ]).then(() => {
      if (!active) return;
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          if (!active) return;
          if (printOnPage) window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          setStatus("printing");
        });
      });
    }).catch(() => {
      if (active) {
        setFailed(["layout"]);
        setStatus("error");
      }
    });
    return () => {
      active = false;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [status, printOnPage]);

  const finishPrinting = useCallback(() => {
    setStatus((current) => current === "printing" ? "exiting" : current);
  }, []);
  const finishExit = useCallback(() => {
    setStatus((current) => current === "exiting" ? "ready" : current);
  }, []);

  useEffect(() => {
    if (status !== "exiting") return;
    // Backup for disabled CSS animations; the normal handoff uses animationend.
    const timer = window.setTimeout(finishExit, 280);
    return () => window.clearTimeout(timer);
  }, [status, finishExit]);

  const hasScene = printOnPage || status === "preparing" || status === "printing" || status === "exiting" || status === "ready";

  return (
    <AssetsReady.Provider value={status === "ready"}>
      {hasScene && (
        <div ref={sceneRef} className={`asset-scene${status !== "ready" ? printOnPage ? " is-page-printing" : " is-preparing" : ""}`} inert={status !== "ready"}>
          {children}
        </div>
      )}
      {status !== "ready" && (
        <div className={`asset-loader${printOnPage ? " is-on-page" : ""}${status === "error" ? " is-error" : ""}${status === "exiting" ? " is-exiting" : ""}`} role="region" aria-label={label} onAnimationEnd={(event) => {
          if (event.target === event.currentTarget && event.animationName === "print-loader-out") finishExit();
        }}>
          {status === "error" ? <div className="asset-loader-inner">
              <span className="asset-loader-edition">THE WEDDING NEWS</span>
              <h1>잠시 연결이 끊겼어요.</h1>
              <p>{failed.includes("layout") ? "지면을 정리하지 못했어요. 다시 준비한 뒤 신문을 열어드릴게요." : `남은 파일 ${failed.length}개를 준비한 뒤 신문을 열어드릴게요.`}</p>
              <button type="button" onClick={() => setAttempt((current) => current + 1)}>다시 불러오기</button>
            </div> : printOnPage
              ? <PagePrint sceneRef={sceneRef} complete={complete} total={total} resourcesReady={status === "printing" || status === "exiting"} onPrinted={finishPrinting} />
              : <PrintLoading complete={complete} total={total} preparing={status === "preparing"} resourcesReady={status === "printing" || status === "exiting"} onPrinted={finishPrinting} photo={preparedImages.get("/couple-main.webp")} />}
        </div>
      )}
    </AssetsReady.Provider>
  );
}
