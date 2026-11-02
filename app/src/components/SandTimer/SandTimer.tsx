import { useState, useEffect } from 'react';
import { getSessionMinutes } from '@/services/screenTime';
import { useApp } from '@/hooks/useAppState';

export function SandTimer() {
  const { settings } = useApp();
  const [pct, setPct] = useState(0);
  const limit = settings?.screenTimeLimitMinutes ?? 0;

  useEffect(() => {
    if (limit <= 0) return;
    const update = () => setPct(Math.min(1, getSessionMinutes() / limit));
    update();
    const id = setInterval(update, 10_000);
    return () => clearInterval(id);
  }, [limit]);

  if (limit <= 0) return null;

  const remaining = Math.max(0, Math.round(limit - getSessionMinutes()));
  const fillColor = pct > 0.8 ? '#ff6857' : pct > 0.5 ? '#ff9a3c' : '#5ac9fa';

  return (
    <div
      title={`${remaining} min`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        opacity: 0.7,
      }}
    >
      <svg viewBox="0 0 24 32" width="18" height="24">
        {/* Glass outline */}
        <path
          d="M4 2 h16 v3 l-6 9 l6 9 v3 h-16 v-3 l6-9 l-6-9 z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Top sand (drains) */}
        <rect
          x="6" y="3"
          width="12"
          height={10 * (1 - pct)}
          rx="1"
          fill={fillColor}
          opacity={0.6}
        />
        {/* Bottom sand (fills) */}
        <rect
          x="6"
          y={26 - 10 * pct}
          width="12"
          height={10 * pct}
          rx="1"
          fill={fillColor}
          opacity={0.8}
        />
        {/* Falling stream */}
        {pct < 1 && (
          <line
            x1="12" y1={13 - 10 * pct + 10}
            x2="12" y2={16 + 10 * pct}
            stroke={fillColor}
            strokeWidth="1.5"
            opacity={0.5}
          >
            <animate
              attributeName="opacity"
              values="0.3;0.7;0.3"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </line>
        )}
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700 }}>{remaining}m</span>
    </div>
  );
}
