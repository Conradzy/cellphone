"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

export function MagneticButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  const link = useRef<HTMLAnchorElement>(null);
  useLayoutEffect(() => {
    const element = link.current;
    if (!element) return;
    const context = gsap.context(() => {
      const media = gsap.matchMedia();
      media.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
        const xTo = gsap.quickTo(element, "x", { duration: 0.35, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.35, ease: "power3.out" });
        const move = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          xTo(gsap.utils.clamp(-4, 4, (event.clientX - rect.left - rect.width / 2) * 0.09));
          yTo(gsap.utils.clamp(-3, 3, (event.clientY - rect.top - rect.height / 2) * 0.09));
        };
        const reset = () => { xTo(0); yTo(0); };
        element.addEventListener("pointermove", move, { passive: true });
        element.addEventListener("pointerleave", reset);
        element.addEventListener("blur", reset);
        return () => {
          element.removeEventListener("pointermove", move);
          element.removeEventListener("pointerleave", reset);
          element.removeEventListener("blur", reset);
        };
      });
    }, link);
    return () => context.revert();
  }, []);
  return <a ref={link} href={href} className={`pill-button ${className}`}><span>{children}</span><span aria-hidden="true">↗</span></a>;
}
