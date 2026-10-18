
import "./LandingPage.css";

function LandingPage({ onLogin, onSignup }) {
  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <a className="landing-brand" href="#home">
          <span className="brand-icon">✦</span>
          <span>NexNote<span className="brand-period">.</span></span>
        </a>

        <div className="landing-nav-actions">
          <button
            type="button"
            className="landing-login"
            onClick={onLogin}
          >
            Log In
          </button>

          <button
            type="button"
            className="landing-signup"
            onClick={onSignup}
          >
            Sign Up <span>↗</span>
          </button>
        </div>
      </nav>

      <section className="landing-hero" id="home">
        <div className="hero-copy">
          <div className="hero-badge">
            <span>✦</span> YOUR SPACE. YOUR IDEAS.
          </div>

          <h1>
            Your Thoughts,
            <br />
            One Step <span>Ahead.</span>
          </h1>

          <p className="hero-description">
            A quiet place for your thoughts, a home for your ideas,
            and a smarter way to organize everything on your mind.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary-button"
              onClick={onSignup}
            >
              Get Started <span>→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-button"
              onClick={onLogin}
            >
              I already have an account
            </button>
          </div>

          <div className="hero-note">
            <span className="hero-note-dot" />
            Your ideas deserve a place of their own.
          </div>
        </div>

        <div className="hero-visual" aria-label="Preview of NexNote">
          <div className="visual-glow" />

          <div className="floating-chip chip-top">
            <span>✦</span> Capture your ideas
          </div>

          <div className="preview-window">
            <div className="preview-topbar">
              <div className="preview-brand">
                <span>✦</span> nexnote.
              </div>
              <div className="preview-dots">
                <span />
                <span />
                <span />
              </div>
            </div>

            <div className="preview-body">
              <div className="preview-sidebar">
                <span className="sidebar-active">▤</span>
                <span>✦</span>
                <span>⌕</span>
                <span>⚙</span>
              </div>

              <div className="preview-content">
                <span className="preview-eyebrow">YOUR PERSONAL SPACE</span>
                <h3>Ideas worth keeping.</h3>
                <p>A little thought can become something big.</p>

                <div className="preview-note note-purple">
                  <span>✦ QUICK THOUGHT</span>
                  <strong>Ideas for the future</strong>
                  <p>Make time for the things that inspire you.</p>
                </div>

                <div className="preview-note note-green">
                  <span>✧ INSPIRATION</span>
                  <strong>Learn something new</strong>
                  <p>Small steps. Meaningful progress.</p>
                </div>

                <div className="preview-bottom">
                  <span>✦ Your ideas, organized.</span>
                  <span>02 notes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="floating-chip chip-bottom">
            <span>✓</span> One space for every thought
          </div>
        </div>
      </section>

      <section className="landing-features" id="features">
        <div className="features-heading">
          <span className="hero-badge">MADE FOR YOUR MIND</span>
          <h2>More than just notes<span>.</span></h2>
          <p>Everything you need to turn scattered thoughts into organized ideas.</p>
        </div>

        <div className="features-grid">
          <article className="feature-card">
            <div className="feature-icon feature-purple">✎</div>
            <h3>Smart Notes</h3>
            <p>Capture thoughts, organize details, and find your notes when you need them.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon feature-green">✦</div>
            <h3>Idea Spark</h3>
            <p>Find inspiration with creative prompts whenever you need a fresh perspective.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon feature-orange">◎</div>
            <h3>Idea Universe</h3>
            <p>Explore your collection of notes through a visual space built for ideas.</p>
          </article>

          <article className="feature-card">
            <div className="feature-icon feature-blue">⌕</div>
            <h3>Quick Search</h3>
            <p>Search, pin, edit, and export your notes with a simple workflow.</p>
          </article>
        </div>
      </section>

      <section className="landing-cta">
        <span className="hero-badge">START WITH ONE THOUGHT</span>
        <h2>Your next great idea starts here.</h2>
        <p>Give your thoughts a space to grow.</p>
        <button
          type="button"
          className="hero-primary-button"
          onClick={onSignup}
        >
          Create Your Account <span>→</span>
        </button>
      </section>

      <footer className="landing-footer">
        <a className="landing-brand" href="#home">
          <span className="brand-icon">✦</span>
          <span>NexNote<span className="brand-period">.</span></span>
        </a>
        <span>Your Thoughts, One Step Ahead.</span>
      </footer>
    </main>
  );
}

export default LandingPage;
