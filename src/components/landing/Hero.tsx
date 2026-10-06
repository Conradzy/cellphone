"use client";

import dynamic from "next/dynamic";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PhoneFallback } from "@/components/three/PhoneFallback";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => <PhoneFallback />,
});
const quote = "The cost of innovation is eclipsed by the price of obsolescence.";
const words = quote.split(" ");

export function Hero() {
  const hero = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        const letters = gsap.utils.toArray<HTMLElement>(".quote-letter");
        const entrance = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.35 });
        entrance.from(".hero-eyebrow", { opacity: 0, y: 8, duration: 0.8 }, 0);
        let time = 0.18;
        letters.forEach((letter, index) => {
          entrance.fromTo(letter, { opacity: 0, y: 5, filter: "blur(3px)" }, {
            opacity: 1, y: 0, filter: "blur(0px)", duration: 0.42,
            onComplete: () => { letter.style.removeProperty("filter"); },
          }, time);
          // Deterministic word-boundary pauses give the reveal natural pacing.
          time += (index % 4 === 0 ? 0.042 : 0.027) + (!letter.nextElementSibling ? 0.085 : 0);
        });
        entrance.from(".hero-cta", { opacity: 0, y: 12, duration: 0.8 }, time - 0.15);
        entrance.from(".scene-entrance", { opacity: 0, y: 64, rotation: 3, duration: 1.7 }, 0.7);
        entrance.from(".hero-footnote", { opacity: 0, duration: 1 }, 1.2);
        gsap.timeline({
          scrollTrigger: { trigger: hero.current, start: "top top", end: "bottom top", scrub: 0.7 },
          defaults: { ease: "none" },
        }).to(".hero-copy", { y: -70, opacity: 0, duration: 0.65 }, 0)
          .to(".hero-scene", { y: 95, scale: 0.9, opacity: 0, duration: 1 }, 0)
          .to(".hero-footnote", { opacity: 0, duration: 0.3 }, 0);
      });
    }, hero);
    return () => context.revert();
  }, []);

  return (
    <section id="overview" className="hero" ref={hero} aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow"><span className="status-dot" /> iPhone 16 Pro Max <span className="eyebrow-divider">/</span> A study in possibility</p>
        <h1 id="hero-title" className="hero-quote" aria-label={quote}>
          <span aria-hidden="true">{words.map((word, index) => (
            <span key={index}><span className="quote-word">{Array.from(word).map((letter, letterIndex) => <span className="quote-letter" key={letterIndex}>{letter}</span>)}</span>{index < words.length - 1 ? " " : ""}</span>
          ))}</span>
        </h1>
        <div className="hero-cta"><MagneticButton href="#buy">Buy Now</MagneticButton></div>
      </div>
      <div className="hero-scene" aria-hidden="true"><div className="scene-entrance"><HeroScene target={hero} paused={paused || reducedMotion} /></div></div>
      <div className="hero-footnote hero-footnote-left">
        <span className="eyebrow">01 — A new perspective</span>
        <a href="#design" className="scroll-link" aria-label="Scroll to discover"><span className="scroll-line" /><span className="scroll-label">Scroll to discover</span></a>
      </div>
      <div className="hero-footnote hero-footnote-right">
        <p>Considered in every detail.<br /><span>Extraordinary by design.</span></p>
        {!reducedMotion && <button className="motion-toggle" type="button" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={`${paused ? "Resume" : "Pause"} 3D motion`}><span className="motion-label">{paused ? "Resume" : "Pause"} 3D motion</span><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>}
      </div>
    </section>
  );
}
