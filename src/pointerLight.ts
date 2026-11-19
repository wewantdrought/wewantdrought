export type BackdropPointerSegment = {
  fromClientX: number;
  fromClientY: number;
  toClientX: number;
  toClientY: number;
  velocityX: number;
  velocityY: number;
  speed: number;
  time: number;
  reducedMotion: boolean;
};

export type PointerLightState = {
  clientX: number;
  clientY: number;
  radius: number;
  strength: number;
  backdropSegments: BackdropPointerSegment[];
  backdropPointerActive: boolean;
  backdropResetVersion: number;
  invalidate: (() => void) | null;
  invalidateBackdrop: (() => void) | null;
};

export const pointerLightSettings = {
  radiusOfVinylWidth: 0.16,
  maximumVinylStrength: 0.28,
  smoothingSeconds: 0.1,
  fadeInSeconds: 0.15,
  fadeOutSeconds: 0.2,
  backdropSimulationSize: 160,
  backdropGroupWidth: 73,
  backdropVelocitySmoothingSeconds: 0.035,
  backdropMaximumInputSpeed: 1200,
  backdropMaximumPendingSegments: 64,
  backdropMaximumSegmentsPerFrame: 24,
  backdropMovementThresholdPixels: 0.5,
  backdropMaximumFrameDeltaSeconds: 0.04,
  backdropPressureIterations: 12,
  backdropVelocityDissipation: 1.4,
  backdropActivationDissipation: 1.8,
  backdropReducedMotionDissipation: 24,
  backdropReducedMotionTrailSeconds: 0.14,
  backdropPointerForce: 4.5,
  backdropActivationForce: 1.6,
  backdropInputRadiusPixels: 18,
  backdropMaximumFlowSpeed: 1.5,
  backdropVelocityZeroThreshold: 0.002,
  backdropMaximumTrailSeconds: 3.25,
  backdropMaximumOpacity: 0.92,
};
