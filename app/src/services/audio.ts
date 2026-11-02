import { Howl } from 'howler';

const cache = new Map<string, Howl>();
const failedSrcs = new Set<string>();

let globalRate = 1.0;

export function setAudioSpeed(speed: 'slow' | 'normal' | 'fast') {
  globalRate = speed === 'slow' ? 0.75 : speed === 'fast' ? 1.3 : 1.0;
}

function getOrCreate(src: string): Howl | null {
  if (failedSrcs.has(src)) return null;

  const existing = cache.get(src);
  if (existing) return existing;

  const howl = new Howl({
    src: [src],
    preload: true,
    onloaderror: () => {
      failedSrcs.add(src);
      cache.delete(src);
    },
  });
  cache.set(src, howl);
  return howl;
}

export function play(src: string, rate?: number): Promise<void> {
  return new Promise((resolve) => {
    const howl = getOrCreate(src);
    if (!howl) {
      resolve();
      return;
    }
    howl.rate(rate ?? globalRate);
    howl.once('end', () => resolve());
    howl.once('loaderror', () => resolve());
    howl.once('playerror', () => resolve());
    howl.play();
  });
}

export function playSfx(name: string): void {
  const src = `/audio/sfx/${name}.mp3`;
  const howl = getOrCreate(src);
  if (!howl) return;
  howl.volume(0.6);
  howl.play();
}

export function preload(srcs: string[]): void {
  for (const src of srcs) {
    getOrCreate(src);
  }
}

export function stopAll(): void {
  for (const howl of cache.values()) {
    howl.stop();
  }
}
