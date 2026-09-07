import React, { useState } from 'react';
import ThreeUIIntroAnimation from './ThreeUIIntroAnimation';

export default function IntroOverlay({ onDismiss, autoDismissTime = 3400 }) {
  const [fading, setFading] = useState(false);

  const handleComplete = () => {
    setFading(true);
    setTimeout(() => {
      onDismiss && onDismiss();
    }, 400);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black transition-opacity duration-500 selection:bg-cyan-500 selection:text-black ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <ThreeUIIntroAnimation
        mode="dark"
        duration={autoDismissTime}
        onComplete={handleComplete}
      />
    </div>
  );
}
