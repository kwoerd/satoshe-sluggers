// lib/confetti.ts
import confetti from 'canvas-confetti';

// Confetti configurations for different events
export const CONFETTI_CONFIGS = {
  bidSuccess: {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ff0099', '#00ff99', '#9900ff', '#ffff00', '#ff6600'],
    gravity: 0.8,
    ticks: 200,
  },
  purchaseSuccess: {
    particleCount: 150,
    spread: 80,
    origin: { y: 0.6 },
    colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'],
    gravity: 0.6,
    ticks: 300,
  },
  celebration: {
    particleCount: 200,
    spread: 90,
    origin: { y: 0.5 },
    colors: ['#ff0099', '#00ff99', '#9900ff', '#ffff00', '#ff6600', '#00ffff', '#ff00ff'],
    gravity: 0.5,
    ticks: 400,
  }
};

// Trigger confetti for successful bid
export function triggerBidConfetti() {
  // Main burst
  confetti({
    ...CONFETTI_CONFIGS.bidSuccess,
    angle: 60,
    origin: { x: 0.2, y: 0.6 }
  });

  // Secondary burst
  confetti({
    ...CONFETTI_CONFIGS.bidSuccess,
    angle: 120,
    origin: { x: 0.8, y: 0.6 }
  });

  // Center burst
  setTimeout(() => {
    confetti({
      ...CONFETTI_CONFIGS.bidSuccess,
      angle: 90,
      origin: { x: 0.5, y: 0.6 }
    });
  }, 200);
}

// Trigger confetti for successful purchase - slow celebratory rainfall
export function triggerPurchaseConfetti() {
  // Initial burst celebration
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff0099'],
    gravity: 0.3,
    ticks: 500,
    scalar: 1.2,
  });

  // Slow rainfall effect
  const duration = 5000; // 5 seconds of confetti
  const animationEnd = Date.now() + duration;
  const colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ff0099', '#ff0099'];

  (function frame() {
    confetti({
      particleCount: 2,
      angle: 90,
      spread: 20,
      origin: { x: Math.random(), y: 0 },
      colors: colors,
      gravity: 0.2, // Much slower fall
      ticks: 800, // Longer duration per particle
      drift: (Math.random() - 0.5) * 0.3, // Gentle drift
      scalar: 1.0,
    });

    if (Date.now() < animationEnd) {
      setTimeout(() => requestAnimationFrame(frame), 150); // Slower emission rate
    }
  }());
}

// Trigger confetti for general celebration
export function triggerCelebrationConfetti() {
  confetti({
    ...CONFETTI_CONFIGS.celebration,
    angle: 90,
    origin: { x: 0.5, y: 0.6 }
  });
}

// Trigger confetti with custom configuration
export function triggerCustomConfetti(config: Partial<typeof CONFETTI_CONFIGS.bidSuccess> = {}) {
  confetti({
    ...CONFETTI_CONFIGS.bidSuccess,
    ...config
  });
}
