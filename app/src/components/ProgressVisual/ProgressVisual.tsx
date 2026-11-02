import { motion } from 'framer-motion';
import { useTheme } from '@/themes/ThemeContext';
import { localized } from '@/services/i18n';

interface Props {
  completed: number;
  total: number;
}

export function ProgressVisual({ completed, total }: Props) {
  const { themeId, theme } = useTheme();
  const pct = Math.min(1, completed / total);
  const label = `${completed}/${total} ${localized(theme.progressLabel)}`;

  if (themeId === 'forest') return <ForestTree pct={pct} label={label} />;
  if (themeId === 'space') return <SpaceOrbit pct={pct} label={label} completed={completed} total={total} />;
  return <GardenFlower pct={pct} label={label} completed={completed} total={total} />;
}

function ForestTree({ pct, label }: { pct: number; label: string }) {
  const fruitCount = Math.round(pct * 6);
  const fruitPositions = [
    { cx: 42, cy: 38 }, { cx: 58, cy: 32 },
    { cx: 72, cy: 42 }, { cx: 48, cy: 52 },
    { cx: 68, cy: 56 }, { cx: 58, cy: 48 },
  ];
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 120 110" width="130" height="120">
        <circle cx="58" cy="45" r="32" fill="#66bb6a" opacity={0.4} />
        <circle cx="58" cy="45" r="24" fill="#81c784" opacity={0.6} />
        <circle cx="58" cy="45" r="16" fill="#a5d6a7" />
        <rect x="55" y="68" width="6" height="22" rx="3" fill="#8d6e63" />
        {fruitPositions.slice(0, fruitCount).map((p, i) => (
          <motion.circle
            key={i} cx={p.cx} cy={p.cy} r="5"
            fill="#ffeb3b" stroke="#fbc02d" strokeWidth="0.5"
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: i * 0.15, type: 'spring' }}
          />
        ))}
        {fruitPositions.slice(fruitCount).map((p, i) => (
          <circle key={`e${i}`} cx={p.cx} cy={p.cy} r="5" fill="#e0e0e0" opacity={0.4} />
        ))}
      </svg>
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.7, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function SpaceOrbit({ pct, label, completed, total }: { pct: number; label: string; completed: number; total: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 120 120" width="130" height="130">
        <circle cx="60" cy="60" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="14" fill="#7c4dff" opacity={0.8} />
        <text x="60" y="64" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="800">
          {completed}/{total}
        </text>
        <motion.circle
          cx="60" cy="15" r="6" fill="#ff6d00"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          style={{ transformOrigin: '60px 60px' }}
        />
        <motion.circle
          cx="105" cy="60" r="5" fill="#536dfe"
          animate={{ rotate: -360 }}
          transition={{ repeat: Infinity, duration: 30, ease: 'linear' }}
          style={{ transformOrigin: '60px 60px' }}
        />
        <motion.path
          d={`M 60 60 L 60 ${60 - 45 * pct}`}
          stroke="#b388ff" strokeWidth="2" strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
      </svg>
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.7, marginTop: 2 }}>{label}</div>
    </div>
  );
}

function GardenFlower({ pct, label, completed, total }: { pct: number; label: string; completed: number; total: number }) {
  const petalCount = Math.round(pct * 8);
  const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div style={{ textAlign: 'center' }}>
      <svg viewBox="0 0 120 120" width="130" height="130">
        <rect x="57" y="68" width="6" height="28" rx="3" fill="#4caf50" />
        <ellipse cx="45" cy="80" rx="12" ry="5" fill="#66bb6a" opacity={0.5} />
        <ellipse cx="75" cy="80" rx="12" ry="5" fill="#66bb6a" opacity={0.5} />
        {petalAngles.map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const cx = 60 + Math.cos(rad) * 18;
          const cy = 48 + Math.sin(rad) * 18;
          const filled = i < petalCount;
          return (
            <motion.ellipse
              key={i} cx={cx} cy={cy} rx="10" ry="7"
              fill={filled ? '#f48fb1' : '#e0e0e0'}
              opacity={filled ? 0.9 : 0.3}
              transform={`rotate(${angle}, ${cx}, ${cy})`}
              initial={filled ? { scale: 0 } : {}}
              animate={filled ? { scale: 1 } : {}}
              transition={{ delay: i * 0.1, type: 'spring' }}
            />
          );
        })}
        <circle cx="60" cy="48" r="10" fill="#ffeb3b" />
        <text x="60" y="52" textAnchor="middle" fontSize="8" fill="#4a1942" fontWeight="800">
          {completed}
        </text>
      </svg>
      <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.7, marginTop: 2 }}>{label}</div>
    </div>
  );
}
