import { ILLUSTRATIONS } from './illustrations';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

function fallback(name: string): string {
  const palette = ['#ef5350','#42a5f5','#66bb6a','#ffa726','#ab47bc','#ec407a'];
  const bg = palette[name.length % palette.length];
  const label = name.length > 3 ? name.slice(0, 3) : name;
  return (
    `<circle cx="32" cy="32" r="26" fill="${bg}"/>` +
    `<text x="32" y="40" font-size="18" font-weight="700" fill="#fff" text-anchor="middle" font-family="system-ui,sans-serif">${label}</text>`
  );
}

export function SvgIllustration({ name, size = 64, className }: Props) {
  const key = name.trim();
  const renderer = ILLUSTRATIONS[key];
  const inner = renderer ? renderer() : fallback(key);

  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={name}
      dangerouslySetInnerHTML={{ __html: inner }}
    />
  );
}
