import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
  const vinylCueRef = useRef<HTMLDivElement>(null);
  const heroLocationRef = useRef<HTMLParagraphElement>(null);
  const pointerCursorRef = useRef<HTMLDivElement>(null);
  const pointerLight = useRef<PointerLightState>({
    clientX: 0,
    clientY: 0,
    radius: 0,
    strength: 0,
    backdropSegments: [],
    backdropPointerActive: false,
    backdropResetVersion: 0,
    invalidate: null,
    invalidateBackdrop: null,
  });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [vinylCueVisible, setVinylCueVisible] = useState(true);
  const handleVinylActivated = () => setVinylCueVisible(false);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const vinyl = vinylRef.current;
    const cue = vinylCueRef.current;
    const location = heroLocationRef.current;

    if (!hero || !vinyl || !cue || !location) {
      return;
    }

    const updateCuePosition = () => {
      if (window.innerWidth <= 700) {
        cue.style.position = 'relative';
        cue.style.left = '';
        cue.style.top = '';
        cue.style.margin = '8px 16px 0 auto';
        return;
      }

      const heroBounds = hero.getBoundingClientRect();
      const vinylBounds = vinyl.getBoundingClientRect();
      const locationBounds = location.getBoundingClientRect();
      const visibleVinylRight =
        vinylBounds.left -
        heroBounds.left +
        vinylBounds.width * 0.79;
      const left = visibleVinylRight + 8;
      const cueWidth = cue.offsetWidth;
      const cueHeight = cue.offsetHeight;
      const locationLeft = locationBounds.left - heroBounds.left;
      const locationRight = locationBounds.right - heroBounds.left;
      const locationTop = locationBounds.top - heroBounds.top;
      const locationBottom = locationBounds.bottom - heroBounds.top;

      let top =
        vinylBounds.top -
        heroBounds.top +
        vinylBounds.height * (window.innerWidth <= 1100 ? 0.84 : 0.6325);

      const overlapsLocation =
        left < locationRight &&
        left + cueWidth > locationLeft &&
        top < locationBottom &&
        top + cueHeight > locationTop;

      if (overlapsLocation) {
        const belowLocation = locationBottom + 8;
        const aboveLocation = locationTop - cueHeight - 8;

        top =
          belowLocation + cueHeight <= heroBounds.height
            ? belowLocation
            : Math.max(8, aboveLocation);
      }

      cue.style.position = 'absolute';
      cue.style.margin = '0';
      cue.style.left = `${left}px`;
      cue.style.top = `${top}px`;
    };

    updateCuePosition();

    const observer = new ResizeObserver(updateCuePosition);
    observer.observe(hero);
    observer.observe(vinyl);
    observer.observe(location);
    window.addEventListener('resize', updateCuePosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateCuePosition);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const vinyl = vinylRef.current;
    const pointerCursor = pointerCursorRef.current;

    if (!hero || !vinyl || !pointerCursor) {
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

    const finePointer = window.matchMedia(
      '(any-hover: hover) and (any-pointer: fine)',
    );

    const positionCursor = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches) {
        return;
      }

      pointerCursor.style.transform =
        `translate3d(${event.clientX - 8}px, ${event.clientY - 8}px, 0)`;
      pointerCursor.style.opacity = '1';
    };

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
    };

    const resetPointerHistory = () => {
      pointerSamples = [];
      velocityX = 0;
      velocityY = 0;
    };

    const sampleTime = (event: PointerEvent) =>
      Number.isFinite(event.timeStamp)
        ? event.timeStamp
        : performance.now();

    const addBackdropSegment = (
      from: PointerSample,
      to: PointerSample,
      reducedMotion: boolean,
    ) => {
      const elapsedSeconds = Math.max((to.time - from.time) / 1000, 0.001);
      const rawVelocityX = (to.clientX - from.clientX) / elapsedSeconds;
      const rawVelocityY = (to.clientY - from.clientY) / elapsedSeconds;
      const blend =
        1 -
        Math.exp(
          -elapsedSeconds /
            pointerLightSettings.backdropVelocitySmoothingSeconds,
        );

      velocityX += (rawVelocityX - velocityX) * blend;
      velocityY += (rawVelocityY - velocityY) * blend;

      const estimatedSpeed = Math.hypot(velocityX, velocityY);
      if (estimatedSpeed > pointerLightSettings.backdropMaximumInputSpeed) {
        const velocityScale =
          pointerLightSettings.backdropMaximumInputSpeed / estimatedSpeed;
        velocityX *= velocityScale;
        velocityY *= velocityScale;
      }

      pointerLight.current.backdropSegments.push({
        fromClientX: from.clientX,
        fromClientY: from.clientY,
        toClientX: to.clientX,
        toClientY: to.clientY,
        velocityX,
        velocityY,
        speed: Math.hypot(velocityX, velocityY),
        time: to.time,
        reducedMotion,
      });

      if (
        pointerLight.current.backdropSegments.length >
        pointerLightSettings.backdropMaximumPendingSegments
      ) {
        pointerLight.current.backdropSegments.splice(
          0,
          pointerLight.current.backdropSegments.length -
            pointerLightSettings.backdropMaximumPendingSegments,
        );
      }

      pointerLight.current.invalidateBackdrop?.();
    };

    const animate = (time: number) => {
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
        active || strength > 0
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
      resetPointerHistory();
      pointerSamples = [{
        clientX: event.clientX,
        clientY: event.clientY,
        time: sampleTime(event),
      }];
      pointerLight.current.backdropPointerActive = true;

      updateVisuals();
    };

    const trackPointer = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || !finePointer.matches) {
        return;
      }

      positionCursor(event);

      if (!active) {
        startAt(event);
        return;
      }

      targetX = event.clientX;
      targetY = event.clientY;

      const coalescedSamples = event.getCoalescedEvents?.();
      const samples =
        coalescedSamples && coalescedSamples.length > 0
          ? coalescedSamples
          : [event];

      for (const sample of samples) {
        const next = {
          clientX: sample.clientX,
          clientY: sample.clientY,
          time: sampleTime(sample),
        };
        const previous =
          pointerSamples[pointerSamples.length - 1] ?? next;
        const distance = Math.hypot(
          next.clientX - previous.clientX,
          next.clientY - previous.clientY,
        );

        if (distance >= pointerLightSettings.backdropMovementThresholdPixels) {
          pointerSamples.push(next);
          if (pointerSamples.length > 2) {
            pointerSamples.splice(0, pointerSamples.length - 2);
          }
          addBackdropSegment(previous, next, prefersReducedMotion);
        } else if (pointerSamples.length === 0) {
          pointerSamples.push(next);
        }
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
      pointerCursor.style.opacity = '0';
      resetPointerHistory();
      pointerLight.current.backdropPointerActive = false;

      if (prefersReducedMotion) {
        strength = 0;
        updateVisuals();
      } else if (strength > 0) {
        beginAnimation();
      }
    };

    const clearImmediately = () => {
      active = false;
      pointerCursor.style.opacity = '0';
      strength = 0;
      resetPointerHistory();
      pointerLight.current.backdropPointerActive = false;
      pointerLight.current.backdropSegments = [];
      pointerLight.current.backdropResetVersion += 1;
      window.cancelAnimationFrame(frame);
      frame = 0;
      updateVisuals();

      if (!document.hidden) {
        pointerLight.current.invalidateBackdrop?.();
      }
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
    pointerLight.current.backdropSegments = [];
    pointerLight.current.backdropPointerActive = false;
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

      <AsciiBackdrop
        pointerLight={pointerLight}
        prefersReducedMotion={prefersReducedMotion}
      />

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
        onActivate={handleVinylActivated}
      />

      <div
        ref={vinylCueRef}
        className={
          vinylCueVisible
            ? 'hero-vinyl-cue'
            : 'hero-vinyl-cue is-dismissed'
        }
        aria-hidden="true"
      >
        <span>CLICK ME</span>
        <svg viewBox="0 0 39 11" aria-hidden="true" focusable="false">
          <path d="M38.5 0.5V5.5H1.5M1.5 5.5 7 1M1.5 5.5 7 10" />
        </svg>
      </div>

      <div
        ref={pointerCursorRef}
        className="hero-pointer-cursor"
        aria-hidden="true"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M8 0.5v4M8 11.5v4M0.5 8h4M11.5 8h4" />
          <circle
            cx="8"
            cy="8"
            r="0.75"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      </div>

      <p ref={heroLocationRef} className="hero-location">
        Vancouver, CA / 2026
      </p>
    </main>
  );
}
