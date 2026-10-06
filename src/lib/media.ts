export type MediaSource =
  | { type: "youtube"; videoId: string; start: number }
  | { type: "file"; src: string; poster?: string; start?: number };

export const productFilm: MediaSource = { type: "youtube", videoId: "Q3zwkxqh1t0", start: 14 };

export function youtubeEmbedUrl(videoId: string, start: number, origin: string) {
  if (!/^[\w-]{11}$/.test(videoId)) throw new Error("Invalid YouTube video ID");
  const params = new URLSearchParams({
    autoplay: "1", mute: "1", loop: "1", playlist: videoId,
    playsinline: "1", controls: "0", disablekb: "1", fs: "0", rel: "0",
    enablejsapi: "1", start: String(Math.max(0, Math.floor(start))), origin,
  });
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}

// Uniform scaling preserves proportions and avoids per-frame layout work.
export function initialMediaScale(viewportWidth: number, frameWidth: number) {
  if (frameWidth <= 0) return 1;
  const desiredWidth = viewportWidth * (viewportWidth < 768 ? 0.82 : 0.64);
  return Math.min(0.92, desiredWidth / frameWidth);
}
