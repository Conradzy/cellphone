"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Group, MathUtils, Mesh, MeshStandardMaterial, Vector3 } from "three";

export const IPHONE_MODEL_URL = "/3dmodels/iphone_16_pro_max.glb";
const restingYaw = -0.08;
const maxPointerYaw = 0.18;

export function IPhoneModel({ pointer, paused }: { pointer: RefObject<{ x: number; y: number }>; paused: boolean }) {
  const { scene } = useGLTF(IPHONE_MODEL_URL);
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  const model = useMemo(() => {
    const clone = scene.clone(true);
    // The supplied model's back faces +X. Rotate, center, and normalize its bounds.
    clone.rotation.y = -Math.PI / 2;
    clone.updateMatrixWorld(true);
    const bounds = new Box3().setFromObject(clone);
    const center = bounds.getCenter(new Vector3());
    const size = bounds.getSize(new Vector3());
    const scale = 4.6 / size.y;
    clone.scale.multiplyScalar(scale);
    clone.position.sub(center.multiplyScalar(scale));
    const materials: MeshStandardMaterial[] = [];
    const copies = new Map<MeshStandardMaterial, MeshStandardMaterial>();
    clone.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const convert = (original: MeshStandardMaterial) => {
        const existing = copies.get(original);
        if (existing) return existing;
        const material = original.clone();
        if (material.color) {
          const gray = material.color.r * 0.2126 + material.color.g * 0.7152 + material.color.b * 0.0722;
          material.color.setRGB(gray, gray, gray);
        }
        if (material.name === "basecolor.001") {
          material.roughness = 0.38;
          material.metalness = 0.65;
        }
        material.envMapIntensity = 0.85;
        copies.set(original, material);
        materials.push(material);
        return material;
      };
      object.material = Array.isArray(object.material) ? object.material.map(convert) : convert(object.material);
    });
    return { scene: clone, materials };
  }, [scene]);

  useEffect(() => () => {
    // Cached geometry/textures are shared. Dispose only our cloned materials.
    model.materials.forEach((material) => material.dispose());
  }, [model]);

  useFrame((_, delta) => {
    if (!group.current || paused) return;
    const dt = Math.min(delta, 0.05);
    elapsed.current += dt;
    const time = elapsed.current;
    // Keep pitch/roll fixed: the cursor only turns the phone gently left/right.
    const targetYaw = restingYaw + MathUtils.clamp(pointer.current.x, -1, 1) * maxPointerYaw;
    group.current.rotation.y = MathUtils.damp(group.current.rotation.y, targetYaw, 3.5, dt);
    group.current.position.y = Math.sin(time * 0.55) * 0.027;
  });
  return <group ref={group} name="iphone-presentation" rotation={[-0.035, restingYaw, -0.1]}><primitive object={model.scene} dispose={null} /></group>;
}

useGLTF.preload(IPHONE_MODEL_URL);
