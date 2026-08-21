"use client";

import { useEffect, useState, type ReactNode } from "react";
import { preloadSound } from "./audio-bank";

type AssetLoadState = {
  status: "loading" | "ready" | "error";
  loaded: number;
  failed: string[];
};

function preloadImage(source: string) {
  return new Promise<void>((resolve, reject) => {
    const image = new Image();
    let settled = false;

    const finish = (error?: Error) => {
      if (settled) return;
      settled = true;
      if (error) reject(error);
      else resolve();
    };

    image.decoding = "async";
    image.fetchPriority = "high";
    image.onload = () => {
      image.decode().catch(() => undefined).then(() => finish());
    };
    image.onerror = () => finish(new Error(source));
    image.src = source;

    if (image.complete && image.naturalWidth > 0) {
      image.decode().catch(() => undefined).then(() => finish());
    }
  });
}

function preloadAsset(source: string) {
  return /\.(?:mp3|m4a|aac|wav|ogg)$/i.test(source) ? preloadSound(source) : preloadImage(source);
}

export default function AssetGate({
  assets,
  children,
  label = "신문 인쇄 준비 중",
}: {
  assets: readonly string[];
  children: ReactNode;
  label?: string;
}) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<AssetLoadState>({ status: "loading", loaded: 0, failed: [] });

  useEffect(() => {
    let active = true;
    let loaded = 0;

    document.documentElement.dataset.assets = "loading";
    setState({ status: "loading", loaded: 0, failed: [] });

    Promise.allSettled(assets.map(async (source) => {
      await preloadAsset(source);
      loaded += 1;
      if (active) setState((current) => ({ ...current, loaded }));
      return source;
    })).then((results) => {
      if (!active) return;

      const failed = results.flatMap((result, index) => result.status === "rejected" ? [assets[index]] : []);
      if (failed.length > 0) {
        document.documentElement.dataset.assets = "error";
        setState({ status: "error", loaded, failed });
        return;
      }

      document.documentElement.dataset.assets = "ready";
      setState({ status: "ready", loaded: assets.length, failed: [] });
    });

    return () => {
      active = false;
    };
  }, [assets, attempt]);

  if (state.status === "ready") return children;

  const progress = assets.length === 0 ? 100 : Math.round((state.loaded / assets.length) * 100);

  return (
    <main className="asset-loader" aria-live="polite">
      <div className="asset-loader-inner">
        <span className="asset-loader-kicker">THE COUPLE TIMES · PRESS ROOM</span>
        <h1>{state.status === "error" ? "인쇄가 잠시 멈췄습니다" : label}</h1>
        <p>
          {state.status === "error"
            ? `필수 파일 ${state.failed.length}개를 불러오지 못했습니다.`
            : `사진, 종이 질감, 효과음을 먼저 준비하고 있습니다. ${state.loaded}/${assets.length}`}
        </p>
        <div className="asset-loader-track" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
        {state.status === "error" ? (
          <button type="button" onClick={() => setAttempt((current) => current + 1)}>다시 불러오기</button>
        ) : (
          <small>{progress}% · 준비가 끝나면 자동으로 신문이 열립니다.</small>
        )}
      </div>
    </main>
  );
}
