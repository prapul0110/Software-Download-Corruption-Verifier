import React, { useEffect, useState, useMemo } from 'react';
import './threeui.css';

export default function ThreeUIIntroAnimation({
  mode = "dark",
  onComplete,
  duration = 3200
}) {
  const [progress, setProgress] = useState(0);

  const line1Text = "SOFTWARE DOWNLOAD";
  const line2Text = "CORRUPTION VERIFIER";

  // Pseudo-random deterministic jitter generator for letters assembly
  const jitterLine1 = useMemo(() => {
    return Array.from(line1Text).map((_, i) => ({
      x: (Math.sin(i * 12.7 + 1.1) * 2 - 1),
      y: (Math.cos(i * 8.3 + 2.4) * 2 - 1),
      delay: (Math.sin(i * 4.9) + 1) * 0.22
    }));
  }, [line1Text]);

  const jitterLine2 = useMemo(() => {
    return Array.from(line2Text).map((_, i) => ({
      x: (Math.sin(i * 15.3 + 3.7) * 2 - 1),
      y: (Math.cos(i * 9.1 + 1.8) * 2 - 1),
      delay: (Math.cos(i * 5.3) + 1) * 0.22 + 0.12
    }));
  }, [line2Text]);

  useEffect(() => {
    let animationFrame;
    const startTime = performance.now();
    const totalMs = duration;

    const animate = (now) => {
      const elapsed = now - startTime;
      const p = Math.min(1, elapsed / (totalMs * 0.65)); // Assembly completes in first 65% of duration
      setProgress(p);

      if (elapsed < totalMs) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        onComplete && onComplete();
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [duration, onComplete]);

  // Ease Out Quad
  const easeOut = (t) => 1 - (1 - t) * (1 - t);

  const getCharStyle = (jitter, index, colorHex) => {
    const rawProgress = Math.max(0, Math.min(1, (progress * 1.4) - jitter.delay));
    const a = easeOut(rawProgress);

    const translateX = jitter.x * 55 * (1 - a);
    const translateY = jitter.y * 32 * (1 - a);
    const scale = 1.25 - 0.25 * a;
    const opacity = Math.min(1, a * 1.8);
    const sep = (1 - a) * 12;

    const textShadow = sep > 0.3
      ? `${(-sep).toFixed(1)}px 0 rgba(255, 64, 72, 0.85), ${sep.toFixed(1)}px 0 rgba(64, 255, 190, 0.8), 0 ${(sep * 0.55).toFixed(1)}px rgba(96, 124, 255, 0.8)`
      : 'none';

    const filter = sep > 0.6 ? `blur(${(sep * 0.25).toFixed(1)}px)` : 'none';

    return {
      color: colorHex,
      display: 'inline-block',
      transform: `translate(${translateX.toFixed(1)}px, ${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`,
      opacity: opacity,
      textShadow: textShadow,
      filter: filter,
      willChange: 'transform, opacity, filter',
      transition: 'none'
    };
  };

  return (
    <div className="w-full h-full min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none font-mono">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-950/20 via-black to-blue-950/30 pointer-events-none" />
      <div className="absolute w-[600px] h-[300px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Main Assembly Container */}
      <div className="relative z-10 text-center space-y-3 sm:space-y-4 max-w-5xl w-full px-4">
        
        {/* LINE 1: SOFTWARE DOWNLOAD */}
        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase font-mono leading-none">
          {Array.from(line1Text).map((char, idx) => (
            <span key={idx} style={getCharStyle(jitterLine1[idx], idx, '#f8fafc')}>
              {char === ' ' ? '\u00a0' : char}
            </span>
          ))}
        </div>

        {/* LINE 2: CORRUPTION VERIFIER - 100% VISIBLE VIBRANT CYAN */}
        <div className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight uppercase font-mono leading-none pt-1">
          {Array.from(line2Text).map((char, idx) => (
            <span key={idx} style={getCharStyle(jitterLine2[idx], idx, '#38bdf8')}>
              {char === ' ' ? '\u00a0' : char}
            </span>
          ))}
        </div>

        {/* Subtitle Accent */}
        <div
          className="pt-6 text-xs sm:text-sm font-mono text-cyan-400 tracking-widest uppercase transition-opacity duration-700"
          style={{ opacity: Math.max(0, (progress - 0.6) * 2.5) }}
        >
          CRC-32 Modulo-2 Error Detection Engine
        </div>

      </div>

      {/* Bottom Footer Note */}
      <div className="absolute bottom-6 text-[11px] font-mono text-slate-600 tracking-wider uppercase">
        Academic Final Project Presentation
      </div>

    </div>
  );
}
