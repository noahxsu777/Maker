import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const NAV_LINKS = ['Work', 'Services', 'About', 'Blog'];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = document.querySelector('#hero-scroll-root') || window;
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      {/* Logo */}
      <a href="#" className={styles.logo}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="12" height="12" rx="3" fill="white"/>
          <rect x="16" width="12" height="12" rx="3" fill="rgba(255,255,255,0.5)"/>
          <rect y="16" width="12" height="12" rx="3" fill="rgba(255,255,255,0.5)"/>
          <rect x="16" y="16" width="12" height="12" rx="3" fill="white"/>
        </svg>
        <span>Nexus</span>
      </a>

      {/* Center links */}
      <ul className={styles.links}>
        {NAV_LINKS.map(link => (
          <li key={link}>
            <a href="#" className={styles.link}>{link}</a>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className={styles.actions}>
        <a href="#" className={styles.signIn}>Sign in</a>
        <a href="#" className={styles.cta}>
          Get started <span className={styles.arrow}>→</span>
        </a>
      </div>
    </nav>
  );
}
