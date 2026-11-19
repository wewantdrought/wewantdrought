import {
  useEffect,
  useRef,
  type MutableRefObject,
} from 'react';
import {
  pointerLightSettings,
  type PointerLightState,
} from './pointerLight';
import { AsciiFluidSimulation } from './AsciiFluidSimulation';

const cellSize = 11;
const cellPitch = 15.5;
const groupPitch = 80.5;
const groupWidth = pointerLightSettings.backdropGroupWidth;
const groupColumns = 8;
const groupRows = 7;
const patternOriginX = 10;
const patternWidth = groupColumns * groupPitch;
const patternHeight = groupRows * groupPitch;

type AsciiBackdropProps = {
  pointerLight: MutableRefObject<PointerLightState>;
  prefersReducedMotion: boolean;
};

const groupCells = Array.from({ length: 25 }, (_, index) => ({
  column: index % 5,
  row: Math.floor(index / 5),
}));

const groupPlacements = Array.from(
  { length: groupColumns * groupRows },
  (_, index) => ({
    column: index % groupColumns,
    row: Math.floor(index / groupColumns),
  }),
);

function renderGroup() {
  return groupCells.map(({ column, row }, index) => {
    const x = column * cellPitch;
    const y = row * cellPitch;
    const diagonalInterior =
      column > 0 && column < 4 && row > 0 && row < 4;
    const squarePath =
      `M${x} ${y}H${x + cellSize}V${y + cellSize}H${x}Z`;

    return (
      <g key={index}>
        <path
          d={squarePath}
          fill="none"
          stroke="#1d1d1d"
          strokeWidth="1"
          strokeLinejoin="miter"
        />

        {diagonalInterior && (
          <path
            d={`M${x} ${y}L${x + cellSize} ${y + cellSize}`}
            fill="none"
            stroke="#1d1d1d"
            strokeWidth="1"
          />
        )}
      </g>
    );
  });
}

export default function AsciiBackdrop({
  pointerLight,
  prefersReducedMotion,
}: AsciiBackdropProps) {
  const activationCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = activationCanvasRef.current;
    if (!canvas) {
      return;
    }

    const finePointer = window.matchMedia(
      '(any-hover: hover) and (any-pointer: fine)',
    );
    if (!finePointer.matches) {
      console.info(
        '[AsciiBackdrop] Fluid response disabled: no fine pointer detected.',
      );
      canvas.style.visibility = 'hidden';
      return;
    }

    let simulation: AsciiFluidSimulation;
    try {
      simulation = new AsciiFluidSimulation(canvas);
      canvas.style.visibility = 'visible';
    } catch (error) {
      console.error(
        '[AsciiBackdrop] Fluid initialization failed; showing the static backdrop.',
        error,
      );
      canvas.style.visibility = 'hidden';
      return;
    }

    let disposed = false;
    let frame = 0;
    let previousFrameTime = 0;
    let lastInputTime = 0;
    let knownResetVersion = pointerLight.current.backdropResetVersion;

    function wake() {
      if (!disposed && !document.hidden && frame === 0) {
        frame = window.requestAnimationFrame(renderFrame);
      }
    }

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      simulation.resize(bounds.width, bounds.height);
      wake();
    };

    const renderFrame = (time: number) => {
      frame = 0;
      if (disposed || document.hidden) {
        return;
      }

      const pointer = pointerLight.current;
      if (pointer.backdropResetVersion !== knownResetVersion) {
        knownResetVersion = pointer.backdropResetVersion;
        pointer.backdropSegments = [];
        simulation.clear();
        lastInputTime = 0;
      }

      const bounds = canvas.getBoundingClientRect();
      const segments = pointer.backdropSegments.splice(
        0,
        pointerLightSettings.backdropMaximumSegmentsPerFrame,
      );
      const deltaSeconds =
        previousFrameTime === 0
          ? 1 / 60
          : (time - previousFrameTime) / 1000;
      previousFrameTime = time;

      if (segments.length > 0) {
        lastInputTime = time;
      }

      const settleSeconds = prefersReducedMotion
        ? pointerLightSettings.backdropReducedMotionTrailSeconds
        : pointerLightSettings.backdropMaximumTrailSeconds;
      const hasRecentInput =
        lastInputTime > 0 &&
        time - lastInputTime < settleSeconds * 1000;

      if (segments.length > 0 || hasRecentInput) {
        const activation = simulation.update(
          segments,
          bounds,
          deltaSeconds,
          prefersReducedMotion,
        );
        simulation.render(activation);
      } else {
        if (lastInputTime > 0) {
          simulation.clear();
          lastInputTime = 0;
        }
        simulation.render(simulation.activationTexture);
      }

      if (
        pointer.backdropSegments.length > 0 ||
        lastInputTime > 0
      ) {
        frame = window.requestAnimationFrame(renderFrame);
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        frame = 0;
        simulation.clear();
        lastInputTime = 0;
      } else {
        wake();
      }
    };

    pointerLight.current.invalidateBackdrop = wake;

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    document.addEventListener(
      'visibilitychange',
      onVisibilityChange,
    );

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      document.removeEventListener(
        'visibilitychange',
        onVisibilityChange,
      );

      if (pointerLight.current.invalidateBackdrop === wake) {
        pointerLight.current.invalidateBackdrop = null;
      }

      simulation.dispose();
    };
  }, [pointerLight, prefersReducedMotion]);

  return (
    <>
      <svg
        className="hero-ascii-backdrop"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
        <symbol
          id="ascii-resting-group"
          viewBox={`0 0 ${groupWidth} ${groupWidth}`}
          overflow="visible"
        >
          {renderGroup()}
        </symbol>

        <pattern
          id="ascii-sequencer-pattern"
          x={patternOriginX}
          width={patternWidth}
          height={patternHeight}
          patternUnits="userSpaceOnUse"
          overflow="visible"
        >
          {groupPlacements.map(({ column, row }) => {
            return (
              <use
                key={`${column},${row}`}
                href="#ascii-resting-group"
                x={column * groupPitch}
                y={row * groupPitch}
                width={groupWidth}
                height={groupWidth}
              />
            );
          })}
        </pattern>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill="url(#ascii-sequencer-pattern)"
        />
      </svg>
      <canvas
        ref={activationCanvasRef}
        className="hero-ascii-activation"
        aria-hidden="true"
      />
    </>
  );
}
