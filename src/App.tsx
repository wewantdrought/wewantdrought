import AsciiBackdrop from './AsciiBackdrop';
import AboutBlock from './AboutBlock';
import VinylScene from './VinylScene';

const sections = [
  { label: 'Home', position: 84 },
  { label: 'Things I’ve Made', position: 286 },
  { label: 'Sound', position: 713 },
  { label: 'About', position: 979 },
  { label: 'Contact', position: 1120 },
];

const homeSectionGuide = 286;
const boundaries = [homeSectionGuide, 609, 713, 979, 1120, 1375];

export default function App() {
  return (
    <main className="hero">
      <h1 className="visually-hidden">Rain Li</h1>

      <AsciiBackdrop />

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
      <VinylScene />

      <p className="hero-location">Vancouver, CA / 2026</p>
    </main>
  );
}
