"use client";

import { Component, Suspense, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMousePosition } from "@/hooks/useMousePosition";
import { IPhoneModel } from "./IPhoneModel";
import { PhoneFallback } from "./PhoneFallback";

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <PhoneFallback /> : this.props.children; }
}

export default function HeroScene({ target, paused }: { target: RefObject<HTMLElement | null>; paused: boolean }) {
  const wrapper = useRef<HTMLDivElement>(null);
  const pointer = useMousePosition(target, paused);
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(true);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = wrapper.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { threshold: 0 });
    observer.observe(element);
    const visibility = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <div ref={wrapper} className="scene-canvas" data-ready={ready}>
      <SceneBoundary>
        {!ready && <PhoneFallback />}
        <Canvas camera={{ position: [0, 0, 9], fov: 32, near: 0.1, far: 40 }} dpr={[1, 1.5]}
          frameloop={paused || !active || !visible ? "demand" : "always"}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          fallback={<PhoneFallback />} style={{ pointerEvents: "none" }}>
          <ambientLight intensity={0.25} />
          {/* Broad key and quiet fill retain detail as the phone turns. */}
          <directionalLight position={[-4, 5, 6]} intensity={1.8} />
          <directionalLight position={[4, 1, 4]} intensity={0.65} />
          <directionalLight position={[2, 3, -4]} intensity={1.4} />
          <Suspense fallback={null}>
            <Environment resolution={128} frames={1}>
              <Lightformer form="rect" intensity={2.6} position={[-4, 2, 3]} scale={[3, 7, 1]} rotation={[0, Math.PI / 4, 0]} />
              <Lightformer form="rect" intensity={1.1} position={[4, 0, 4]} scale={[2, 6, 1]} rotation={[0, -Math.PI / 4, 0]} />
              <Lightformer form="rect" intensity={1.7} position={[0, 5, 1]} scale={[5, 2, 1]} rotation={[Math.PI / 2, 0, 0]} />
              <Lightformer form="rect" intensity={2} position={[2, 1, -4]} scale={[2, 6, 1]} rotation={[0, Math.PI, 0]} />
            </Environment>
            <IPhoneModel pointer={pointer} paused={paused} />
            <SceneReady onReady={setReady} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}

function SceneReady({ onReady }: { onReady: (ready: boolean) => void }) {
  useEffect(() => { onReady(true); }, [onReady]);
  return null;
}
