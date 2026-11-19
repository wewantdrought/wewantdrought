import {
  useEffect,
  useRef,
  type MutableRefObject,
} from 'react';
import {
  pointerLightSettings,
  type PointerLightState,
} from './pointerLight';

const cellSize = 11;
const cellPitch = 15.5;
const groupPitch = 80.5;
const groupWidth = 73;
const groupColumns = 8;
const groupRows = 7;
const patternOriginX = 10;
const activationColor = '#808080';
const patternWidth = groupColumns * groupPitch;
const patternHeight = groupRows * groupPitch;

type AsciiBackdropProps = {
  pointerLight: MutableRefObject<PointerLightState>;
};

const activeGroups = new Set([
  '0,0',
  '5,2',
  '2,3',
  '7,5',
  '4,6',
]);

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

function renderGroup(active: boolean) {
  return groupCells.map(({ column, row }, index) => {
    const x = column * cellPitch;
    const y = row * cellPitch;
    const diagonalInterior =
      column > 0 && column < 4 && row > 0 && row < 4;
    const activeFill = diagonalInterior ? '#2a2a2a' : '#444444';
    const squarePath =
      `M${x} ${y}H${x + cellSize}V${y + cellSize}H${x}Z`;

    return (
      <g key={index}>
        <path
          d={squarePath}
          fill={active ? activeFill : 'none'}
          stroke={active ? activeFill : '#1d1d1d'}
          strokeWidth="1"
          strokeLinejoin="miter"
        />

        {!active && diagonalInterior && (
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

      const pointer = pointerLight.current;
      const pointerX = pointer.clientX - bounds.left;
      const pointerY = pointer.clientY - bounds.top;
      const radius =
        pointer.radius * pointerLightSettings.backdropRadiusScale;

      if (radius <= 0 || pointer.strength <= 0) {
        return;
      }

      const firstGroupColumn =
        Math.floor(
          (pointerX - radius - patternOriginX) / groupPitch,
        ) - 1;
      const lastGroupColumn =
        Math.ceil(
          (pointerX + radius - patternOriginX) / groupPitch,
        ) + 1;
      const firstGroupRow =
        Math.floor((pointerY - radius) / groupPitch) - 1;
      const lastGroupRow =
        Math.ceil((pointerY + radius) / groupPitch) + 1;

      context.fillStyle = activationColor;

      for (
        let groupRow = firstGroupRow;
        groupRow <= lastGroupRow;
        groupRow += 1
      ) {
        for (
          let groupColumn = firstGroupColumn;
          groupColumn <= lastGroupColumn;
          groupColumn += 1
        ) {
          for (let row = 0; row < 5; row += 1) {
            const y = groupRow * groupPitch + row * cellPitch;

            for (let column = 0; column < 5; column += 1) {
              const x =
                patternOriginX +
                groupColumn * groupPitch +
                column * cellPitch;
              const dx = pointerX - (x + cellSize / 2);
              const dy = pointerY - (y + cellSize / 2);
              const distance = Math.hypot(dx, dy);

              if (distance >= radius) {
                continue;
              }

              const normalizedDistance = distance / radius;
              const falloff =
                1 -
                normalizedDistance *
                  normalizedDistance *
                  (3 - 2 * normalizedDistance);
              const opacity = pointer.strength * falloff;

              if (opacity <= 0.005) {
                continue;
              }

              context.globalAlpha = opacity;
              context.fillRect(
                x - 0.5,
                y - 0.5,
                cellSize + 1,
                cellSize + 1,
              );
            }
          }
        }
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
          {renderGroup(false)}
        </symbol>

        <symbol
          id="ascii-active-group"
          viewBox={`0 0 ${groupWidth} ${groupWidth}`}
          overflow="visible"
        >
          {renderGroup(true)}
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
            const active = activeGroups.has(`${column},${row}`);

            return (
              <use
                key={`${column},${row}`}
                href={
                  active
                    ? '#ascii-active-group'
                    : '#ascii-resting-group'
                }
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
