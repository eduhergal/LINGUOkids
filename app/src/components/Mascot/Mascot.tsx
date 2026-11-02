import { motion } from 'framer-motion';
import { useTheme } from '@/themes/ThemeContext';
import { localized } from '@/services/i18n';

interface Props {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 32, md: 48, lg: 64 };

export function Mascot({ message, size = 'md' }: Props) {
  const { theme } = useTheme();
  const px = sizes[size];

  const randomEncouragement = () => {
    const idx = Math.floor(Math.random() * theme.encouragements.length);
    return localized(theme.encouragements[idx]);
  };

  const text = message ?? randomEncouragement();

  return (
    <div className="mascot" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <motion.span
        style={{ fontSize: px, lineHeight: 1, display: 'block' }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        {theme.mascot.emoji}
      </motion.span>
      {text && (
        <motion.span
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: 'rgba(255,255,255,0.9)',
            color: '#333',
            padding: '6px 12px',
            borderRadius: 16,
            fontSize: size === 'sm' ? 11 : 13,
            fontWeight: 700,
            maxWidth: 200,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {text}
        </motion.span>
      )}
    </div>
  );
}
