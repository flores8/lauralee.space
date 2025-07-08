// app/page.tsx
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="content-section">
      <h1>Welcome to my digital sketchbook</h1>
      
      <p className="intro-text">
      This is my personal corner of the internet. A space that&apos;s unfiltered, evolving, and deeply mine. 
        Here, I write, share what I&apos;m reading, and experiment with ideas that don&apos;t need 
        to be portfolio-ready or professionally polished.
      </p>

      <div className="sketchbook-grid">
        <div className="sketchbook-card writing-card">
          <div className="card-content">
            <h2>Writing</h2>
            <p>Musings, essays, and meanderings in progress. Thoughts that need room to breathe.</p>
            <Link href="/writing" className="card-link">
              Read my thoughts →
            </Link>
          </div>
          <div className="card-decoration"></div>
        </div>

        <div className="sketchbook-card reading-card">
          <div className="card-content">
            <h2>Reading</h2>
            <p>Books I&apos;m loving, learning from, or wrestling with. The ideas that shape my thinking.</p>
            <Link href="/reading" className="card-link">
              See what I&apos;m reading →
            </Link>
          </div>
          <div className="card-decoration"></div>
        </div>

        <div className="sketchbook-card projects-card">
          <div className="card-content">
            <h2>Projects</h2>
            <p>Creative experiments, design tests, and imperfect ideas in motion. Work in progress.</p>
            <Link href="/projects" className="card-link">
              Explore experiments →
            </Link>
          </div>
          <div className="card-decoration"></div>
        </div>
      </div>

      <div className="about-note">
        <p>
          <strong>No pressure to perform.</strong> This space isn&apos;t trying to sell anything. 
          It&apos;s here so I can think out loud, experiment with ideas, chase sparks of inspiration, and document 
          half-formed thoughts.
        </p>
      </div>

      <div className="external-links">
        <p>
          Looking for more? 
          <Link href="https://lauraleeflores.com" className="external-link">My full story</Link> • 
          <Link href="https://lauralee.design" className="external-link">My design portfolio</Link>
        </p>
      </div>
    </div>
  );
}
