"use client";

import { useEffect, useState, type ReactNode } from "react";
import { preloadSound } from "./audio-bank";

type AssetLoadState = {
  status: "loading" | "ready" | "error";
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
  const [state, setState] = useState<AssetLoadState>({ status: "loading", failed: [] });

  useEffect(() => {
    let active = true;

    document.documentElement.dataset.assets = "loading";
    setState({ status: "loading", failed: [] });

    Promise.allSettled(assets.map(preloadAsset)).then((results) => {
      if (!active) return;

      const failed = results.flatMap((result, index) => result.status === "rejected" ? [assets[index]] : []);
      if (failed.length > 0) {
        document.documentElement.dataset.assets = "error";
        setState({ status: "error", failed });
        return;
      }

      document.documentElement.dataset.assets = "ready";
      setState({ status: "ready", failed: [] });
    });

    return () => {
      active = false;
    };
  }, [assets, attempt]);

  if (state.status === "ready") return children;
  if (state.status === "loading") return <main className="asset-loader" aria-label={label} />;

  return (
    <main className="asset-loader is-error" aria-live="polite">
      <div className="asset-loader-inner">
        <h1>필수 파일을 불러오지 못했습니다</h1>
        <p>{state.failed.length}개 파일을 다시 준비해야 합니다.</p>
        <button type="button" onClick={() => setAttempt((current) => current + 1)}>다시 불러오기</button>
      </div>
    </main>
  );
}
