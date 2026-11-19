export type PointerLightState = {
  clientX: number;
  clientY: number;
  radius: number;
  strength: number;
  invalidate: (() => void) | null;
};

export const pointerLightSettings = {
  radiusOfVinylWidth: 0.16,
  maximumVinylStrength: 0.28,
  smoothingSeconds: 0.1,
  fadeInSeconds: 0.15,
  fadeOutSeconds: 0.2,
};
