const cellSize = 11;
const cellPitch = 15.5;
const groupPitch = 80.5;
const groupWidth = 73;
const groupColumns = 8;
const groupRows = 7;
const patternWidth = groupColumns * groupPitch;
const patternHeight = groupRows * groupPitch;

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

export default function AsciiBackdrop() {
  return (
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
          x={10}
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
  );
}
