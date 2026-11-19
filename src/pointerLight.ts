export type BackdropDisturbance = {
  id: number;
  clientX: number;
  clientY: number;
  directionX: number;
  directionY: number;
  velocityX: number;
  velocityY: number;
  speedRatio: number;
  intensity: number;
  startedAt: number;
  lifetimeSeconds: number;
  reducedMotion: boolean;
};

export type PointerLightState = {
  clientX: number;
  clientY: number;
  radius: number;
  strength: number;
  backdropDisturbances: BackdropDisturbance[];
  invalidate: (() => void) | null;
  invalidateBackdrop: (() => void) | null;
};

export const pointerLightSettings = {
  radiusOfVinylWidth: 0.16,
  maximumVinylStrength: 0.28,
  smoothingSeconds: 0.1,
  fadeInSeconds: 0.15,
  fadeOutSeconds: 0.2,
  backdropGroupWidth: 73,
  backdropVelocityWindowSeconds: 0.09,
  backdropVelocitySmoothingSeconds: 0.035,
  backdropMinimumSpeed: 45,
  backdropMaximumSpeed: 1200,
  backdropEmissionDistancePixels: 5,
  backdropEmissionIntervalSeconds: 0.035,
  backdropMaximumDisturbances: 10,
  backdropLifetimeMinimumSeconds: 0.4,
  backdropLifetimeMaximumSeconds: 0.7,
  backdropReducedMotionLifetimeSeconds: 0.12,
  backdropForwardOffsetSeconds: 0.018,
  backdropForwardOffsetMaximumPixels: 24,
  backdropParticleVelocityScale: 0.6,
  backdropParticleDragPerSecond: 2.8,
  backdropBaseHalfLength: 9,
  backdropSpeedHalfLength: 22,
  backdropBaseHalfWidth: 12,
  backdropSpeedHalfWidth: 20,
  backdropSpreadAngleDegrees: 7,
  backdropMaximumOpacity: 0.92,
};
