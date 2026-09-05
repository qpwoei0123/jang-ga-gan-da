"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { preloadSound } from "./audio-bank";
import { preloadResources } from "./resource-preloader";

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

type LoadState = "loading" | "preparing" | "ready" | "error";

export default function AssetGate({ assets, children, label = "신문 인쇄 준비 중" }: {
  assets: readonly string[];
  children: ReactNode;
  label?: string;
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
    setStatus("loading");
    setComplete(0);
    preloadResources(assets, preloadAsset, setComplete, controller.signal)
      .then((missing) => {
        setFailed(missing);
        setStatus(missing.length ? "error" : "preparing");
      }).catch(() => {});
    return () => controller.abort();
  }, [assets, attempt]);

  useEffect(() => {
    document.documentElement.dataset.assets = status;
    if (status !== "preparing") return;
    let active = true;
    let firstFrame = 0;
    let secondFrame = 0;
    // Finish the real photo layout behind the loader before starting the intro.
    Promise.all([
      document.fonts.ready,
      ...[...(sceneRef.current?.querySelectorAll("img") ?? [])].map((image) => image.decode()),
    ]).then(() => {
      if (!active) return;
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => { if (active) setStatus("ready"); });
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
  }, [status]);

  return (
    <AssetsReady.Provider value={status === "ready"}>
      {(status === "preparing" || status === "ready") && (
        <div ref={sceneRef} className={`asset-scene${status === "preparing" ? " is-preparing" : ""}`} inert={status !== "ready"}>
          {children}
        </div>
      )}
      {status !== "ready" && (
        <main className={`asset-loader${status === "error" ? " is-error" : ""}`} aria-label={label}>
          <div className="asset-loader-inner">
            <span className="asset-loader-edition">THE WEDDING NEWS</span>
            {status === "error" ? <>
              <h1>잠시 연결이 끊겼어요.</h1>
              <p>남은 파일 {failed.length}개를 준비한 뒤 신문을 열어드릴게요.</p>
              <button type="button" onClick={() => setAttempt((current) => current + 1)}>다시 불러오기</button>
            </> : <>
              <span className="asset-loader-status">{status === "preparing" ? "마지막으로 지면을 정리하고 있어요." : "로딩중..."}</span>
              <progress max={total + 1} value={complete + (status === "preparing" ? .5 : 0)} />
              <span className="asset-loader-count">{complete} / {total}</span>
            </>}
          </div>
        </main>
      )}
    </AssetsReady.Provider>
  );
}
