type GlyphKind = 'square' | 'diagonal' | 'cross' | 'filled';

const gridSize = 32;
const cellSize = 13.5;
const glyphScale = 0.75;
const patternSize = gridSize * cellSize;

const backgroundCells = Array.from(
  { length: gridSize * gridSize },
  (_, index) => {
    const x = index % gridSize;
    const y = Math.floor(index / gridSize);
    const field =
      Math.sin((x * 2 + y) * Math.PI / 16) +
      0.6 * Math.cos((x - y * 2) * Math.PI / 16);
    const wrappedX = x % gridSize;
    const wrappedY = y % gridSize;
    const seed =
      (wrappedX * 73 +
        wrappedY * 151 +
        wrappedX * wrappedY * 37) %
      577;

    let kind: GlyphKind;

    if (seed / 577 < 0.055) {
      kind = 'filled';
    } else if (field < -0.45) {
      kind = 'square';
    } else if (field < 0.15) {
      kind = 'diagonal';
    } else if (field < 1) {
      kind = 'cross';
    } else {
      kind = 'square';
    }

    return { x, y, kind };
  },
);

export default function AsciiBackdrop() {
  return (
    <svg
      className="hero-ascii-backdrop"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id="hero-ascii-pattern"
          width={patternSize}
          height={patternSize}
          patternUnits="userSpaceOnUse"
        >
          <g
            fill="none"
            stroke="#777"
            strokeWidth="1.2"
            strokeLinejoin="miter"
          >
            {backgroundCells.map(({ x, y, kind }, index) => {
              const offsetX = x * cellSize;
              const offsetY = y * cellSize;
              const glyphTransform =
                `translate(${offsetX} ${offsetY}) scale(${glyphScale})`;

              if (kind === 'filled') {
                return (
                  <rect
                    key={index}
                    transform={glyphTransform}
                    x="3"
                    y="3"
                    width="12"
                    height="12"
                    fill="#777"
                  />
                );
              }

              if (kind === 'square') {
                return (
                  <rect
                    key={index}
                    transform={glyphTransform}
                    x="2.5"
                    y="2.5"
                    width="13"
                    height="13"
                  />
                );
              }

              if (kind === 'diagonal') {
                return (
                  <path
                    key={index}
                    transform={glyphTransform}
                    d="M2 16L16 2"
                  />
                );
              }

              return (
                <path
                  key={index}
                  transform={glyphTransform}
                  d="M9 2v14M2 9h14"
                />
              );
            })}
          </g>
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        fill="url(#hero-ascii-pattern)"
      />
    </svg>
  );
}
