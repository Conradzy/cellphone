"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExpandingVideo } from "@/components/media/ExpandingVideo";
import { initialMediaScale, productFilm } from "@/lib/media";

export function ExpandingVideoSection() {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const sectionElement = section.current;
        const stageElement = stage.current;
        const frameElement = frame.current;
        if (!sectionElement || !stageElement || !frameElement) return;

        // Keep a stable composite layer while visible, then release it offscreen.
        // The iframe retains its full resolution throughout the expansion.
        const visibility = new IntersectionObserver(([entry]) => {
          frameElement.style.willChange = entry.isIntersecting ? "transform" : "auto";
        }, { rootMargin: "200px 0px" });
        visibility.observe(sectionElement);

        gsap.fromTo(frameElement, {
          scale: () => initialMediaScale(window.innerWidth, frameElement.offsetWidth),
          y: 28,
        }, {
          scale: 1, y: 0, force3D: true, ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionElement,
            start: "top top",
            // Expand during the first half of the sticky travel; hold at full
            // size for the remaining half instead of continually rescaling video.
            end: () => `+=${Math.max(1, (sectionElement.offsetHeight - stageElement.offsetHeight) * 0.5)}`,
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(".film-section-heading", { opacity: 0.45, y: 12 }, {
          opacity: 1, y: 0, ease: "none",
          scrollTrigger: { trigger: section.current, start: "top 80%", end: "top 15%", scrub: 0.6 },
        });
        return () => {
          visibility.disconnect();
          frameElement.style.removeProperty("will-change");
        };
      });
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section id="design" className="film-section" ref={section} aria-labelledby="design-title">
      <div className="film-stage" ref={stage}>
        <div className="film-section-heading"><p className="eyebrow">02 — The art of less</p><h2 id="design-title">See the bigger picture.</h2><span className="eyebrow film-scroll-hint">Keep exploring <span aria-hidden="true">↓</span></span></div>
        <div className="film-frame" ref={frame}><ExpandingVideo source={productFilm} /></div>
        <div className="film-stage-footer"><span>Designed to draw you in.</span><span>Every detail. In focus.</span></div>
      </div>
    </section>
  );
}
