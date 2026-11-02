export function hapticFeedback(type: 'success' | 'error' | 'light') {
  if (!('vibrate' in navigator)) return;
  switch (type) {
    case 'success':
      navigator.vibrate([30, 50, 30]);
      break;
    case 'error':
      navigator.vibrate(80);
      break;
    case 'light':
      navigator.vibrate(15);
      break;
  }
}

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playTone(type: 'correct' | 'wrong' | 'tap' | 'complete') {
  try {
    const ctx = getAudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    gain.gain.value = 0.15;

    switch (type) {
      case 'correct':
        osc.frequency.value = 523;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
        setTimeout(() => {
          const o2 = ctx.createOscillator();
          const g2 = ctx.createGain();
          o2.connect(g2);
          g2.connect(ctx.destination);
          o2.frequency.value = 659;
          o2.type = 'sine';
          g2.gain.value = 0.15;
          g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          o2.start();
          o2.stop(ctx.currentTime + 0.25);
        }, 120);
        break;
      case 'wrong':
        osc.frequency.value = 200;
        osc.type = 'triangle';
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        break;
      case 'tap':
        osc.frequency.value = 800;
        osc.type = 'sine';
        gain.gain.value = 0.08;
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
        break;
      case 'complete':
        osc.frequency.value = 523;
        osc.type = 'sine';
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
        [659, 784, 1047].forEach((freq, i) => {
          setTimeout(() => {
            const o = ctx.createOscillator();
            const g = ctx.createGain();
            o.connect(g);
            g.connect(ctx.destination);
            o.frequency.value = freq;
            o.type = 'sine';
            g.gain.value = 0.12;
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
            o.start();
            o.stop(ctx.currentTime + 0.2);
          }, (i + 1) * 150);
        });
        break;
    }
  } catch {
    // Audio not available
  }
}
