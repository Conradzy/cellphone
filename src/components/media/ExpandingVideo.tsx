"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { youtubeEmbedUrl, type MediaSource } from "@/lib/media";
import { loadYouTubeAPI, type YouTubePlayer } from "@/lib/youtube";

export function ExpandingVideo({ source }: { source: MediaSource }) {
  const container = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [near, setNear] = useState(false);
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const paused = (userPaused ?? reducedMotion) || !inView || hidden;
  const onPlaying = useCallback(() => setPlaying(true), []);
  const onError = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const preload = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNear(true); preload.disconnect(); }
    }, { rootMargin: "400px" });
    const visibility = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    preload.observe(element);
    visibility.observe(element);
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      preload.disconnect();
      visibility.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="film" ref={container} data-playing={playing && !failed}>
      <div className="film-poster" aria-hidden="true"><div className="poster-device"><div className="poster-lens" /><div className="poster-lens" /><div className="poster-lens" /><span className="poster-flash" /></div></div>
      <div className="film-player" aria-hidden="true">
        {near && !failed && (source.type === "youtube"
          ? <YouTubeMedia source={source} paused={paused} onPlaying={onPlaying} onError={onError} />
          : <FileMedia source={source} paused={paused} onPlaying={onPlaying} onError={onError} />)}
      </div>
      <div className="film-shade" />
      <div className="film-topline"><span className="eyebrow">A closer look</span><span className="film-format">THE PRODUCT FILM <span aria-hidden="true">↗</span></span></div>
      <div className="film-caption"><p className="eyebrow">Precision. In every dimension.</p><h3>Nothing extra.<br />Everything ahead.</h3></div>
      <div className="film-controls">
        {failed ? <a className="film-control" href={source.type === "youtube" ? `https://www.youtube.com/watch?v=${source.videoId}&t=${source.start}s` : source.src} target="_blank" rel="noreferrer">Open film <span aria-hidden="true">↗</span></a>
          : <button className="film-control" type="button" onClick={() => setUserPaused(!(userPaused ?? reducedMotion))} aria-label={(userPaused ?? reducedMotion) ? "Play film" : "Pause film"}><span aria-hidden="true">{(userPaused ?? reducedMotion) ? "▷" : "Ⅱ"}</span><span>{(userPaused ?? reducedMotion) ? "Play film" : "Pause film"}</span></button>}
        <span className="film-sound">{failed ? "Film unavailable here" : "Sound off"}</span>
      </div>
    </div>
  );
}

function YouTubeMedia({ source, paused, onPlaying, onError }: {
  source: Extract<MediaSource, { type: "youtube" }>;
  paused: boolean;
  onPlaying: () => void;
  onError: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YouTubePlayer | null>(null);
  const ready = useRef(false);
  const pauseRef = useRef(paused);

  useEffect(() => {
    pauseRef.current = paused;
    if (!ready.current || !player.current) return;
    if (paused) player.current.pauseVideo();
    else { player.current.mute(); player.current.playVideo(); }
  }, [paused]);

  useEffect(() => {
    let cancelled = false;
    const element = host.current;
    loadYouTubeAPI().then((api) => {
      if (cancelled || !element) return;
      const iframe = document.createElement("iframe");
      const url = new URL(youtubeEmbedUrl(source.videoId, source.start, window.location.origin));
      if (pauseRef.current) url.searchParams.set("autoplay", "0");
      iframe.src = url.toString();
      iframe.title = "iPhone product film — muted";
      iframe.allow = "autoplay; encrypted-media; picture-in-picture";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.tabIndex = -1;
      element.append(iframe);
      player.current = new api.Player(iframe, {
        events: {
          onReady: ({ target }) => {
            if (cancelled) return;
            ready.current = true;
            target.mute();
            target.seekTo(source.start, true);
            if (!pauseRef.current) target.playVideo();
            else target.pauseVideo();
          },
          onStateChange: ({ target, data }) => {
            if (cancelled) return;
            if (data === 1) {
              if (pauseRef.current) target.pauseVideo();
              else onPlaying();
            }
            if (data === 0 && !pauseRef.current) {
              target.seekTo(source.start, true);
              target.playVideo();
            }
          },
          onError: () => { if (!cancelled) onError(); },
        },
      });
    }).catch(() => { if (!cancelled) onError(); });
    return () => {
      cancelled = true;
      ready.current = false;
      player.current?.destroy();
      player.current = null;
      element?.replaceChildren();
    };
  }, [source.videoId, source.start, onPlaying, onError]);

  return <div className="youtube-cover" ref={host} />;
}

function FileMedia({ source, paused, onPlaying, onError }: {
  source: Extract<MediaSource, { type: "file" }>;
  paused: boolean;
  onPlaying: () => void;
  onError: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (paused) video.current?.pause();
    else void video.current?.play().catch(() => { /* Browsers may require a user gesture. */ });
  }, [paused]);
  return <video ref={video} src={source.src} poster={source.poster} muted loop playsInline preload="metadata" onPlaying={onPlaying} onError={onError} onLoadedMetadata={() => { if (video.current) video.current.currentTime = source.start ?? 0; }} tabIndex={-1} />;
}
