import { useEffect, useRef, useState } from 'react';
import AsciiBackdrop from './AsciiBackdrop';
import AboutBlock from './AboutBlock';
import VinylScene from './VinylScene';
import type { PointerLightState } from './pointerLight';
import { pointerLightSettings } from './pointerLight';

const sections = [
  { label: 'Home', position: 84 },
  { label: 'Things I’ve Made', position: 286 },
  { label: 'Sound', position: 713 },
  { label: 'About', position: 979 },
  { label: 'Contact', position: 1120 },
];

const homeSectionGuide = 286;
const boundaries = [homeSectionGuide, 609, 713, 979, 1120, 1375];

type PointerSample = {
  clientX: number;
  clientY: number;
  time: number;
};

export default function App() {
  const heroRef = useRef<HTMLElement>(null);
  const vinylRef = useRef<HTMLDivElement>(null);
  const pointerLight = useRef<PointerLightState>({
    clientX: 0,
    clientY: 0,
    radius: 0,
    strength: 0,
    backdropDisturbances: [],
    invalidate: null,
    invalidateBackdrop: null,
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const hero = heroRef.current;
    const vinyl = vinylRef.current;

    if (!hero || !vinyl) {
      return;
    }

    let active = false;
    let targetX = 0;
    let targetY = 0;
    let smoothX = 0;
    let smoothY = 0;
    let strength = 0;
    let previousTime = 0;
    let frame = 0;
    let pointerSamples: PointerSample[] = [];
    let velocityX = 0;
    let velocityY = 0;
    let distanceSinceEmission = 0;
    let lastEmissionAt = Number.NEGATIVE_INFINITY;
    let nextDisturbanceId = 0;

    const finePointer = window.matchMedia(
      '(any-hover: hover) and (any-pointer: fine)',
    );

    const updateRadius = () => {
      pointerLight.current.radius =
        vinyl.getBoundingClientRect().width *
        pointerLightSettings.radiusOfVinylWidth;
    };

    const updateVisuals = () => {
      pointerLight.current.clientX = smoothX;
      pointerLight.current.clientY = smoothY;
      pointerLight.current.strength = strength;
      pointerLight.current.invalidate?.();
      pointerLight.current.invalidateBackdrop?.();
    };

    const resetVelocityHistory = () => {
      pointerSamples = [];
      velocityX = 0;
      velocityY = 0;
      distanceSinceEmission = 0;
      lastEmissionAt = Number.NEGATIVE_INFINITY;
    };

    const emitDisturbance = (
      clientX: number,
      clientY: number,
      directionX: number,
      directionY: number,
      speed: number,
      now: number,
      reducedMotion = false,
    ) => {
      const speedRatio = Math.max(
        0,
        Math.min(
          1,
          (speed - pointerLightSettings.backdropMinimumSpeed) /
            (pointerLightSettings.backdropMaximumSpeed -
              pointerLightSettings.backdropMinimumSpeed),
        ),
      );
      const forwardOffset = reducedMotion
        ? 0
        : Math.min(
            pointerLightSettings.backdropForwardOffsetMaximumPixels,
            speed * pointerLightSettings.backdropForwardOffsetSeconds,
          );
      const lifetimeSeconds = reducedMotion
        ? pointerLightSettings.backdropReducedMotionLifetimeSeconds
        : pointerLightSettings.backdropLifetimeMinimumSeconds +
          speedRatio *
            (pointerLightSettings.backdropLifetimeMaximumSeconds -
              pointerLightSettings.backdropLifetimeMinimumSeconds);

      pointerLight.current.backdropDisturbances.push({
        id: nextDisturbanceId,
        clientX: clientX + directionX * forwardOffset,
        clientY: clientY + directionY * forwardOffset,
        directionX,
        directionY,
        velocityX: reducedMotion
          ? 0
          : velocityX * pointerLightSettings.backdropParticleVelocityScale,
        velocityY: reducedMotion
          ? 0
          : velocityY * pointerLightSettings.backdropParticleVelocityScale,
        speedRatio,
        intensity: 0.55 + speedRatio * 0.45,
        startedAt: now,
        lifetimeSeconds,
        reducedMotion,
      });
      nextDisturbanceId += 1;

      if (
        pointerLight.current.backdropDisturbances.length >
        pointerLightSettings.backdropMaximumDisturbances
      ) {
        pointerLight.current.backdropDisturbances.splice(
          0,
          pointerLight.current.backdropDisturbances.length -
            pointerLightSettings.backdropMaximumDisturbances,
        );
      }

      pointerLight.current.invalidateBackdrop?.();
    };

    const animate = (time: number) => {
      pointerLight.current.backdropDisturbances =
        pointerLight.current.backdropDisturbances.filter(
          (disturbance) =>
            time - disturbance.startedAt <
            disturbance.lifetimeSeconds * 1000,
        );

      const delta =
        previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;

      if (active) {
        if (prefersReducedMotion) {
          smoothX = targetX;
          smoothY = targetY;
          strength = 1;
        } else {
          const positionBlend =
            1 - Math.exp(-delta / pointerLightSettings.smoothingSeconds);
          smoothX += (targetX - smoothX) * positionBlend;
          smoothY += (targetY - smoothY) * positionBlend;
          strength = Math.min(
            1,
            strength + delta / pointerLightSettings.fadeInSeconds,
          );
        }
      } else if (!prefersReducedMotion && strength > 0) {
        strength = Math.max(
          0,
          strength - delta / pointerLightSettings.fadeOutSeconds,
        );
      }

      updateVisuals();

      if (
        active ||
        strength > 0 ||
        pointerLight.current.backdropDisturbances.length > 0
      ) {
        frame = window.requestAnimationFrame(animate);
      } else {
        frame = 0;
      }
    };

    const beginAnimation = () => {
      if (frame === 0) {
        previousTime = 0;
        frame = window.requestAnimationFrame(animate);
      }
    };

    const startAt = (event: PointerEvent) => {
      active = true;
      targetX = event.clientX;
      targetY = event.clientY;
      smoothX = targetX;
      smoothY = targetY;
      strength = 0;
      previousTime = 0;
      resetVelocityHistory();
      pointerSamples.push({
        clientX: event.clientX,
        clientY: event.clientY,
        time: performance.now(),
      });

      updateVisuals();
    };

    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches) {
        return;
      }

      if (!active) {
        startAt(event);
        return;
      }

      const now = performance.now();
      const deltaX = event.clientX - targetX;
      const deltaY = event.clientY - targetY;
      const movementDistance = Math.hypot(deltaX, deltaY);
      targetX = event.clientX;
      targetY = event.clientY;

      if (movementDistance === 0) {
        return;
      }

      const previousSample = pointerSamples[0];
      const elapsedSeconds = previousSample
        ? Math.max((now - previousSample.time) / 1000, 0.001)
        : 0;
      const rawVelocityX = previousSample
        ? (event.clientX - previousSample.clientX) / elapsedSeconds
        : 0;
      const rawVelocityY = previousSample
        ? (event.clientY - previousSample.clientY) / elapsedSeconds
        : 0;
      const velocityBlend = previousSample
        ? 1 -
          Math.exp(
            -elapsedSeconds /
              pointerLightSettings.backdropVelocitySmoothingSeconds,
          )
        : 1;

      velocityX += (rawVelocityX - velocityX) * velocityBlend;
      velocityY += (rawVelocityY - velocityY) * velocityBlend;

      const estimatedSpeed = Math.hypot(velocityX, velocityY);
      if (estimatedSpeed > pointerLightSettings.backdropMaximumSpeed) {
        const velocityScale =
          pointerLightSettings.backdropMaximumSpeed / estimatedSpeed;
        velocityX *= velocityScale;
        velocityY *= velocityScale;
      }

      const sampleCutoff =
        now - pointerLightSettings.backdropVelocityWindowSeconds * 1000;
      pointerSamples = pointerSamples.filter(
        (sample) => sample.time >= sampleCutoff,
      );
      pointerSamples.push({
        clientX: event.clientX,
        clientY: event.clientY,
        time: now,
      });

      const speed = Math.hypot(velocityX, velocityY);
      const directionLength = Math.hypot(velocityX, velocityY);
      const directionX = directionLength > 0 ? velocityX / directionLength : 0;
      const directionY = directionLength > 0 ? velocityY / directionLength : 0;

      if (prefersReducedMotion) {
        emitDisturbance(
          event.clientX,
          event.clientY,
          directionX,
          directionY,
          speed,
          now,
          true,
        );
        return;
      }

      distanceSinceEmission += movementDistance;
      const minimumIntervalMilliseconds =
        pointerLightSettings.backdropEmissionIntervalSeconds * 1000;

      if (
        speed >= pointerLightSettings.backdropMinimumSpeed &&
        distanceSinceEmission >=
          pointerLightSettings.backdropEmissionDistancePixels &&
        now - lastEmissionAt >= minimumIntervalMilliseconds
      ) {
        emitDisturbance(
          event.clientX,
          event.clientY,
          directionX,
          directionY,
          speed,
          now,
        );
        distanceSinceEmission = 0;
        lastEmissionAt = now;
      }
    };

    const onEnter = (event: PointerEvent) => {
      trackPointer(event);

      if (active) {
        beginAnimation();
      }
    };

    const onMove = (event: PointerEvent) => {
      trackPointer(event);

      if (active) {
        beginAnimation();
      }
    };

    const onLeave = () => {
      active = false;
      resetVelocityHistory();

      if (prefersReducedMotion) {
        pointerLight.current.backdropDisturbances = [];
        strength = 0;
        updateVisuals();
      } else if (
        strength > 0 ||
        pointerLight.current.backdropDisturbances.length > 0
      ) {
        beginAnimation();
      }
    };

    const clearImmediately = () => {
      active = false;
      strength = 0;
      resetVelocityHistory();
      pointerLight.current.backdropDisturbances = [];
      window.cancelAnimationFrame(frame);
      frame = 0;
      updateVisuals();
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        clearImmediately();
      }
    };

    const onPageShow = () => {
      clearImmediately();
    };

    updateRadius();
    strength = 0;
    pointerLight.current.strength = 0;
    pointerLight.current.backdropDisturbances = [];
    updateVisuals();

    const resizeObserver = new ResizeObserver(updateRadius);
    resizeObserver.observe(hero);
    resizeObserver.observe(vinyl);

    hero.addEventListener('pointerenter', onEnter);
    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', clearImmediately);
    window.addEventListener('pageshow', onPageShow);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      hero.removeEventListener('pointerenter', onEnter);
      hero.removeEventListener('pointermove', onMove);
      hero.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', clearImmediately);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    setPrefersReducedMotion(query.matches);
    query.addEventListener('change', updatePreference);

    return () => {
      query.removeEventListener('change', updatePreference);
    };
  }, []);

  return (
    <main ref={heroRef} className="hero">
      <h1 className="visually-hidden">Rain Li</h1>

      <AsciiBackdrop pointerLight={pointerLight} />

      <svg
        className="hero-diagonal"
        viewBox="0 0 1440 900"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M202 80L1389.6 900"
          fill="none"
          stroke="#212121"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="hero-guides" aria-hidden="true">
        {boundaries.map((position) => (
          <span
            key={position}
            style={{
              left:
                position === homeSectionGuide
                  ? 'var(--hero-home-guide-x)'
                  : `${(position / 1440) * 100}%`,
            }}
          />
        ))}
      </div>

      <img
        className="hero-title"
        src="/assets/rain-li-title.svg"
        width="1440"
        height="138"
        alt=""
        aria-hidden="true"
      />

      <div className="hero-progress">
        <ul className="hero-sections" aria-label="Website sections">
          {sections.map(({ label, position }) => (
            <li
              key={label}
              style={{ left: `${(position / 1440) * 100}%` }}
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="hero-track" aria-hidden="true">
          <span className="hero-position" />
        </div>
      </div>

      <AboutBlock />
      <VinylScene
        containerRef={vinylRef}
        pointerLight={pointerLight}
        prefersReducedMotion={prefersReducedMotion}
      />

      <p className="hero-location">Vancouver, CA / 2026</p>
    </main>
  );
}
