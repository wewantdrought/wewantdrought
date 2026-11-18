import './about.css';

const reachLinks = [
  {
    platform: 'GITHUB',
    identifier: '@WEWANTDROUGHT',
    href: 'https://github.com/wewantdrought',
  },
  {
    platform: 'LINKEDIN',
    identifier: '/IN/RAINLI07',
    href: 'https://www.linkedin.com/in/rainli07/',
  },
  {
    platform: 'SOUNDCLOUD',
    identifier: '@RAINLI',
    href: 'https://soundcloud.com/rainli',
  },
];

function NortheastArrow() {
  return (
    <svg
      className="about-arrow"
      viewBox="0 0 16 16"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 1h14M15 1v14M5.1 10.9 15 1" />
    </svg>
  );
}

export default function AboutBlock() {
  return (
    <section className="about-block" aria-labelledby="about-heading">
      <h2 className="about-heading" id="about-heading">
        SOFTWARE + DESIGN + MUSIC
      </h2>

      <div className="about-status">
        <p>&gt; CURRENTLY&nbsp; CS @WESTERN</p>
        <p>&gt; LEARNING&nbsp;&nbsp; THREE.JS, REACT</p>
      </div>

      <nav className="about-links" aria-label="Find Rain online">
        {reachLinks.map(({ platform, identifier, href }) => (
          <a
            className="about-link"
            href={href}
            key={platform}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{platform}</span>
            <span>{identifier}</span>
            <NortheastArrow />
          </a>
        ))}
      </nav>
    </section>
  );
}
