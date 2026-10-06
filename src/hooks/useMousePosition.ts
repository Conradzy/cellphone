"use client";

import { useEffect, useRef, type RefObject } from "react";

export function useMousePosition(target: RefObject<HTMLElement | null>, disabled: boolean) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const element = target.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!element || disabled) return;
    // Listen across the viewport, including the navbar and other hero overlays.
    // Store only the latest input; the render loop handles interpolation.
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType === "touch") return;
      pointer.current.x = Math.max(-1, Math.min(1, (event.clientX / window.innerWidth) * 2 - 1));
      pointer.current.y = 0;
    };
    const reset = () => { pointer.current = { x: 0, y: 0 }; };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    finePointer.addEventListener("change", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
      finePointer.removeEventListener("change", reset);
      reset();
    };
  }, [target, disabled]);
  return pointer;
}
