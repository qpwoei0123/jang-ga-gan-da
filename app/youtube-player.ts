export type YouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
  getIframe(): HTMLIFrameElement;
  getPlayerState(): number;
};
type YouTubeAPI = { Player: new (element: HTMLElement, options: {
  host: string;
  videoId: string;
  width: number;
  height: number;
  playerVars: Record<string, string | number>;
  events: {
    onReady(event: { target: YouTubePlayer }): void;
    onStateChange(event: { data: number }): void;
    onAutoplayBlocked(): void;
    onError(): void;
  };
}) => YouTubePlayer };
type YouTubeWindow = Window & { YT?: YouTubeAPI; onYouTubeIframeAPIReady?: () => void };
let apiPromise: Promise<YouTubeAPI> | undefined;

export function loadYouTubeAPI() {
  const host = window as YouTubeWindow;
  if (host.YT?.Player) return Promise.resolve(host.YT);
  if (!apiPromise) apiPromise = new Promise<YouTubeAPI>((resolve, reject) => {
    const script = document.createElement("script");
    const previous = host.onYouTubeIframeAPIReady;
    const timer = window.setTimeout(() => fail(), 25000);
    const cleanup = () => { clearTimeout(timer); script.onerror = null; host.onYouTubeIframeAPIReady = previous; };
    const fail = () => { cleanup(); script.remove(); apiPromise = undefined; reject(new Error("YouTube API unavailable")); };
    host.onYouTubeIframeAPIReady = () => {
      cleanup();
      if (host.YT?.Player) resolve(host.YT);
      else reject(new Error("YouTube player unavailable"));
      previous?.();
    };
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = fail;
    document.head.append(script);
  });
  return apiPromise;
}
