import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { API_URL } from '../api';
import './Home.css';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [serverStatus, setServerStatus] = useState('waking'); // 'waking' | 'ready' | 'hidden'

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Silent wake-up ping — fires immediately on homepage load
  // so Render's free-tier backend is warm before user hits Login
  useEffect(() => {
    const baseUrl = API_URL.replace('/api100b', '');
    fetch(`${baseUrl}/api100b/health`, { method: 'GET' })
      .then(r => r.ok ? setServerStatus('ready') : setServerStatus('hidden'))
      .catch(() => setServerStatus('hidden'));

    // Hide the toast after 4s regardless
    const timer = setTimeout(() => setServerStatus('hidden'), 4000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <div className="home-page">
      {/* SERVER WAKE-UP TOAST */}
      {serverStatus !== 'hidden' && (
        <div className={`server-toast ${serverStatus === 'ready' ? 'server-toast--ready' : ''}`}>
          {serverStatus === 'waking'
            ? <><span className="toast-dot toast-dot--pulse" />Warming up server…</>
            : <><span className="toast-dot toast-dot--green" />Server ready ✓</>
          }
        </div>
      )}

      {/* NAVBAR */}
      <nav className={`home-nav ${isScrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-brand">
          <div className="brand-icon">🎓</div>
          EduManage
        </Link>
        <ul className="nav-links">
          <li><a href="#features">Features</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#testimonials">Reviews</a></li>
        </ul>
        <div className="nav-actions">
          <Link to="/login" className="btn-outline-nav">Log In</Link>
          <Link to="/signup" className="btn-primary-nav">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              Now with AI-powered Attendance & Fee Alerts
            </div>
            <h1>
              Run Your School<br />
              Smarter with<br />
              <span className="highlight">EduManage</span>
            </h1>
            <p className="hero-desc">
              The complete school management platform — students, teachers, fees, attendance and reports all in one powerful dashboard.
            </p>
            <div className="hero-cta">
              <Link to="/signup" className="btn-hero-primary">🚀 Start for Free</Link>
              <Link to="/login" className="btn-hero-secondary">▶️ Sign In</Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div style={{ display: 'flex', gap: '12.5px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(74, 222, 128, 0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '18px' }}>💰</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Fee Collection – March 2026</div>
                  <div style={{ fontSize: '11px', opacity: 0.6 }}>78% of target reached</div>
                </div>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '78%', height: '100%', background: '#4ade80' }} />
              </div>
            </div>

            <div className="hero-card">
              <div style={{ display: 'flex', gap: '12.5px', marginBottom: '15px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(96, 165, 250, 0.2)', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '18px' }}>👨‍🎓</div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Total Students</div>
                  <div style={{ fontSize: '11px', opacity: 0.6 }}>342 active students</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span>Present Today</span>
                <span style={{ color: '#4ade80' }}>315 (92%)</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="features-section" id="features" style={{ padding: '100px 5% 0' }}>
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2>Everything a Modern School Needs</h2>
          <p style={{ color: '#666', maxWidth: '600px', margin: '0 auto' }}>A complete suite of tools built to simplify school administration and enhance learning experiences.</p>
        </div>

        <div className="features-grid">
          {[
            { icon: '👥', title: 'Student Management', desc: 'Enrol, update, and track students across all classes. Search and generate reports instantly.' },
            { icon: '👨‍🏫', title: 'Teacher Portal', desc: 'Teachers get a dedicated portal to manage their class, mark attendance, and assign homework.' },
            { icon: '💳', title: 'Fee Management', desc: 'Track academic fees, UPI payments, pending dues and generate detailed monthly reports.' },
            { icon: '✅', title: 'Attendance Tracking', desc: 'Daily attendance recorded per class with automatic alerts for consistently absent students.' },
            { icon: '📚', title: 'Homework & Study', desc: 'Teachers can assign work digitally. Students submit, teachers mark — all in one place.' },
            { icon: '📉', title: 'Analytics & Reports', desc: 'Beautiful charts for fee collections, student strength, and yearly performance reviews.' },
          ].map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: '100px 5%', background: 'var(--home-primary-dark)', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '40px', marginBottom: '20px' }}>Ready to Transform Your School?</h2>
          <p style={{ marginBottom: '40px', opacity: 0.7 }}>Join 500+ schools already using EduManage. Get started for free — no credit card required.</p>
          <Link to="/signup" className="btn-hero-primary" style={{ padding: '16px 40px', fontSize: '18px' }}>Create Free Account</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 5%', background: '#0a1a12', color: 'rgba(255,255,255,0.4)', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p>© 2026 EduManage School Management System. All rights reserved.</p>
      </footer>
    </div>
  );
}
