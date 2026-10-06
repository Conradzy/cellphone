"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function Navbar() {
  const nav = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(nav.current, { opacity: 0, y: -12, duration: 1, delay: 0.15, ease: "power3.out" });
      });
    }, nav);
    return () => context.revert();
  }, []);
  return (
    <header className="navbar" ref={nav}>
      <a className="wordmark" href="#overview" aria-label="FORM home">form<span>®</span></a>
      <nav aria-label="Main navigation">
        <a className="nav-link nav-overview" href="#overview">Overview</a>
        <a className="nav-link" href="#design">Design</a>
        <a className="nav-link" href="#technology">Technology</a>
        <a className="nav-buy" href="#buy">Buy <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  );
}
