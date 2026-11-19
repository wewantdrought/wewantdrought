import {
  useEffect,
  useRef,
  type MutableRefObject,
} from 'react';
import {
  pointerLightSettings,
  type BackdropDisturbance,
  type PointerLightState,
} from './pointerLight';

const cellSize = 11;
const cellPitch = 15.5;
const groupPitch = 80.5;
const groupWidth = pointerLightSettings.backdropGroupWidth;
const groupColumns = 8;
const groupRows = 7;
const patternOriginX = 10;
const activationColor = '#808080';
const patternWidth = groupColumns * groupPitch;
const patternHeight = groupRows * groupPitch;

type AsciiBackdropProps = {
  pointerLight: MutableRefObject<PointerLightState>;
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

function smoothstep(edge0: number, edge1: number, value: number) {
  const ratio = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return ratio * ratio * (3 - 2 * ratio);
}

type RenderedDisturbance = BackdropDisturbance & {
  x: number;
  y: number;
  age: number;
  fade: number;
  halfLength: number;
  halfWidth: number;
  tangentX: number;
  tangentY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

export default function AsciiBackdrop({ pointerLight }: AsciiBackdropProps) {
  const activationCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = activationCanvasRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !context) {
      return;
    }

    const drawActivation = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.max(window.devicePixelRatio || 1, 1);
      const backingWidth = Math.max(
        1,
        Math.round(bounds.width * pixelRatio),
      );
      const backingHeight = Math.max(
        1,
        Math.round(bounds.height * pixelRatio),
      );

      if (
        canvas.width !== backingWidth ||
        canvas.height !== backingHeight
      ) {
        canvas.width = backingWidth;
        canvas.height = backingHeight;
      }

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.clearRect(0, 0, bounds.width, bounds.height);

      const now = performance.now();
      const disturbances: RenderedDisturbance[] = pointerLight.current.backdropDisturbances.flatMap(
        (disturbance): RenderedDisturbance[] => {
          const age = (now - disturbance.startedAt) / 1000;

          if (age < 0 || age >= disturbance.lifetimeSeconds) {
            return [];
          }

          const drag = pointerLightSettings.backdropParticleDragPerSecond;
          const velocityDecay = Math.exp(-drag * age);
          const travelSeconds = disturbance.reducedMotion
            ? 0
            : (1 - velocityDecay) / drag;
          const x = disturbance.clientX - bounds.left + disturbance.velocityX * travelSeconds;
          const y = disturbance.clientY - bounds.top + disturbance.velocityY * travelSeconds;
          const ageRatio = age / disturbance.lifetimeSeconds;
          const fade = (1 - ageRatio) ** 2;

          if (disturbance.reducedMotion) {
            return [{
              ...disturbance,
              x,
              y,
              age,
              fade,
              halfLength: 13,
              halfWidth: 13,
              tangentX: 0,
              tangentY: 0,
              minX: x - 13,
              maxX: x + 13,
              minY: y - 13,
              maxY: y + 13,
            }];
          }

          const halfLength =
            pointerLightSettings.backdropBaseHalfLength +
            disturbance.speedRatio * pointerLightSettings.backdropSpeedHalfLength;
          const halfWidth =
            pointerLightSettings.backdropBaseHalfWidth +
            disturbance.speedRatio * pointerLightSettings.backdropSpeedHalfWidth;
          const spread =
            Math.tan(
              (pointerLightSettings.backdropSpreadAngleDegrees * Math.PI) / 180,
            ) * halfLength;
          const tangentX = -disturbance.directionY;
          const tangentY = disturbance.directionX;
          const extentX = Math.abs(disturbance.directionX) * halfLength +
            Math.abs(tangentX) * (halfWidth + spread);
          const extentY = Math.abs(disturbance.directionY) * halfLength +
            Math.abs(tangentY) * (halfWidth + spread);

          return [{
            ...disturbance,
            x,
            y,
            age,
            fade,
            halfLength,
            halfWidth,
            tangentX,
            tangentY,
            minX: x - extentX,
            maxX: x + extentX,
            minY: y - extentY,
            maxY: y + extentY,
          }];
        },
      );

      if (disturbances.length === 0) {
        return;
      }

      const candidateCells = new Map<string, {
        x: number;
        y: number;
        column: number;
        row: number;
      }>();

      for (const disturbance of disturbances) {
        const minX = disturbance.minX;
        const maxX = disturbance.maxX;
        const minY = disturbance.minY;
        const maxY = disturbance.maxY;
        const firstGroupColumn = Math.floor((minX - patternOriginX - cellSize) / groupPitch) - 1;
        const lastGroupColumn = Math.ceil((maxX - patternOriginX) / groupPitch) + 1;
        const firstGroupRow = Math.floor((minY - cellSize) / groupPitch) - 1;
        const lastGroupRow = Math.ceil(maxY / groupPitch) + 1;

        for (let groupRow = firstGroupRow; groupRow <= lastGroupRow; groupRow += 1) {
          for (let groupColumn = firstGroupColumn; groupColumn <= lastGroupColumn; groupColumn += 1) {
            for (let row = 0; row < 5; row += 1) {
              for (let column = 0; column < 5; column += 1) {
                const x = patternOriginX + groupColumn * groupPitch + column * cellPitch;
                const y = groupRow * groupPitch + row * cellPitch;
                if (x + cellSize < minX || x > maxX || y + cellSize < minY || y > maxY) {
                  continue;
                }
                const key = `${groupColumn}:${groupRow}:${column}:${row}`;
                candidateCells.set(key, { x, y, column: groupColumn * 5 + column, row: groupRow * 5 + row });
              }
            }
          }
        }
      }

      const activationValues = new Map<string, { cell: { x: number; y: number }; opacity: number }>();

      for (const [key, cell] of candidateCells) {
        const centerX = cell.x + cellSize / 2;
        const centerY = cell.y + cellSize / 2;
        let combinedInfluence = 0;

        for (const disturbance of disturbances) {
          const dx = centerX - disturbance.x;
          const dy = centerY - disturbance.y;
          let activation = 0;

          if (disturbance.reducedMotion) {
            const distance = Math.hypot(dx, dy);
            const distanceRatio = distance / 13;
            activation =
              distanceRatio < 1
                ? 1 - smoothstep(0, 1, distanceRatio)
                : 0;
          } else {
            const along = dx * disturbance.directionX + dy * disturbance.directionY;
            const across = dx * disturbance.tangentX + dy * disturbance.tangentY;
            const tailHalfLength = disturbance.halfLength * 1.35;
            const longitudinalRatio =
              along >= 0
                ? along / disturbance.halfLength
                : -along / tailHalfLength;
            const frontBlend = smoothstep(
              -tailHalfLength,
              disturbance.halfLength * 0.55,
              along,
            );
            const localHalfWidth =
              disturbance.halfWidth * (0.62 + 0.38 * frontBlend) +
              Math.abs(along) * Math.tan((pointerLightSettings.backdropSpreadAngleDegrees * Math.PI) / 180);
            const normalizedDistance = Math.sqrt(
              longitudinalRatio ** 2 +
                (across / localHalfWidth) ** 2,
            );
            activation =
              1 - smoothstep(0.72, 1.12, normalizedDistance);
          }

          const contribution =
            activation * disturbance.fade * disturbance.intensity;
          combinedInfluence =
            1 - (1 - combinedInfluence) * (1 - contribution);
        }

        if (combinedInfluence > 0.08) {
          const opacity = Math.min(
            pointerLightSettings.backdropMaximumOpacity,
            combinedInfluence *
              pointerLightSettings.backdropMaximumOpacity,
          );
          activationValues.set(key, { cell, opacity });
        }
      }

      context.fillStyle = '#000000';
      for (const { cell, opacity } of activationValues.values()) {
        context.globalAlpha = 1;
        context.fillRect(cell.x - 0.5, cell.y - 0.5, cellSize + 1, cellSize + 1);
        context.fillStyle = activationColor;
        context.globalAlpha = opacity;
        context.fillRect(cell.x - 0.5, cell.y - 0.5, cellSize + 1, cellSize + 1);
        context.fillStyle = '#000000';
      }

      context.globalAlpha = 1;
    };

    pointerLight.current.invalidateBackdrop = drawActivation;
    drawActivation();

    const resizeObserver = new ResizeObserver(drawActivation);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();

      if (pointerLight.current.invalidateBackdrop === drawActivation) {
        pointerLight.current.invalidateBackdrop = null;
      }
    };
  }, [pointerLight]);

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
