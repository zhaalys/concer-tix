'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';
import './LogoLoop.css';

interface ImageLogo {
  src: string;
  alt: string;
}

interface LogoLoopProps {
  logos: ImageLogo[];
  speed?: number;
  gap?: number;
  logoHeight?: number;
  fadeOut?: boolean;
  fadeOutColor?: string;
}

const LogoLoop = memo(({
  logos,
  speed = 80,
  gap = 48,
  logoHeight = 48,
  fadeOut = true,
  fadeOutColor = '#ffffff',
}: LogoLoopProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const seqRef = useRef<HTMLUListElement>(null);
  const rafRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);
  const [copyCount, setCopyCount] = useState(3);

  const updateCopies = useCallback(() => {
    if (!containerRef.current || !seqRef.current) return;
    const seqW = seqRef.current.getBoundingClientRect().width;
    const contW = containerRef.current.clientWidth;
    if (seqW > 0) {
      setCopyCount(Math.max(3, Math.ceil(contW / seqW) + 2));
    }
  }, []);

  useEffect(() => {
    updateCopies();
    window.addEventListener('resize', updateCopies);
    return () => window.removeEventListener('resize', updateCopies);
  }, [updateCopies]);

  useEffect(() => {
    const track = trackRef.current;
    const seq = seqRef.current;
    if (!track || !seq) return;

    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.05);
      lastTsRef.current = ts;

      const seqW = seq.getBoundingClientRect().width;
      if (seqW > 0) {
        offsetRef.current = (offsetRef.current + speed * dt) % seqW;
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [speed]);

  const cssVars = {
    '--logoloop-gap': `${gap}px`,
    '--logoloop-logoHeight': `${logoHeight}px`,
    '--logoloop-fadeColor': fadeOutColor,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`logoloop${fadeOut ? ' logoloop--fade' : ''}`}
      style={{ overflow: 'hidden', width: '100%', ...cssVars }}
    >
      <div ref={trackRef} className="logoloop__track">
        {Array.from({ length: copyCount }, (_, i) => (
          <ul
            key={i}
            className="logoloop__list"
            ref={i === 0 ? seqRef : undefined}
            aria-hidden={i > 0}
          >
            {logos.map((logo, j) => (
              <li key={j} className="logoloop__item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo.src} alt={logo.alt} draggable={false} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
});

LogoLoop.displayName = 'LogoLoop';
export default LogoLoop;
