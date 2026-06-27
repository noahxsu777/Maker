import { useEffect, useRef } from 'react';
import styles from './HeroContent.module.css';

const STATS = [
  { value: '200+', label: 'Projects shipped' },
  { value: '98%', label: 'Client satisfaction' },
  { value: '15yr', label: 'Of excellence' },
];

export default function HeroContent() {
  const containerRef = useRef(null);

  // Staggered entrance animation
  useEffect(() => {
    const items = containerRef.current?.querySelectorAll('[data-animate]');
    if (!items) return;
    items.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      setTimeout(() => {
        el.style.transition = 'opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 200 + i * 120);
    });
  }, []);

  return (
    <div ref={containerRef} className={styles.hero}>

      {/* Badge */}
      <span data-animate className={styles.badge}>
        <span className={styles.badgeDot} />
        Available for new projects · 2026
      </span>

      {/* Headline */}
      <h1 data-animate className={styles.headline}>
        Craft the<br />
        <em className={styles.italic}>future,</em><br />
        <span className={styles.outline}>today.</span>
      </h1>

      {/* Sub-copy */}
      <p data-animate className={styles.sub}>
        Award-winning design &amp; technology studio building digital
        products that move the world forward.
      </p>

      {/* CTA row */}
      <div data-animate className={styles.ctaRow}>
        <a href="#" className={styles.ctaPrimary}>
          View our work
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href="#" className={styles.ctaGlass}>
          Talk to us
        </a>
      </div>

      {/* Stats strip */}
      <div data-animate className={styles.stats}>
        {STATS.map(({ value, label }, i) => (
          <div key={i} className={styles.stat}>
            <strong className={styles.statValue}>{value}</strong>
            <span className={styles.statLabel}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
