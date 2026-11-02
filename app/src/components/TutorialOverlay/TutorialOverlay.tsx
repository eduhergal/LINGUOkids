import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { localized, t } from '@/services/i18n';
import { useTheme } from '@/themes/ThemeContext';
import type { TutorialStep } from '@/services/tutorial';

interface Props {
  steps: TutorialStep[];
  onDone: () => void;
}

export function TutorialOverlay({ steps, onDone }: Props) {
  const [index, setIndex] = useState(0);
  const { theme } = useTheme();
  const step = steps[index];
  const isLast = index >= steps.length - 1;

  return (
    <motion.div
      className="tutorial-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        padding: 24,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            background: '#fff',
            borderRadius: 24,
            padding: '32px 24px',
            maxWidth: 320,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
          }}
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ fontSize: 56, marginBottom: 16 }}
          >
            {step.emoji}
          </motion.div>

          <p style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1a1b2e',
            lineHeight: 1.4,
            marginBottom: 24,
          }}>
            {localized(step.text)}
          </p>

          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
            {steps.map((_, i) => (
              <div
                key={i}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: i === index ? theme.colors.primary : '#ddd',
                  transition: 'background 0.2s',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={onDone}
              style={{
                padding: '10px 20px',
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 700,
                background: '#f0f0f0',
                color: '#666',
                border: 'none',
                minHeight: 48,
              }}
            >
              {isLast ? '' : t('onboarding.next') === 'Siguiente' ? 'Ya sé' : 'I know'}
            </button>
            <button
              onClick={() => {
                if (isLast) {
                  onDone();
                } else {
                  setIndex(index + 1);
                }
              }}
              style={{
                padding: '10px 24px',
                borderRadius: 16,
                fontSize: 14,
                fontWeight: 700,
                background: theme.colors.primary,
                color: '#fff',
                border: 'none',
                minHeight: 48,
                flex: 1,
              }}
            >
              {isLast
                ? (t('onboarding.start'))
                : `${t('onboarding.next')} →`}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
