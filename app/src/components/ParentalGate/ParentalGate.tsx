import { useState, useCallback } from 'react';
import { useApp } from '@/hooks/useAppState';
import { updateSettings } from '@/db/database';
import { t } from '@/services/i18n';
import './ParentalGate.css';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export function ParentalGate({ onSuccess, onCancel }: Props) {
  const { settings, refreshSettings } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const isSetup = !settings?.parentPin;

  const handleDigit = useCallback(
    (digit: string) => {
      setError(false);
      const next = pin + digit;
      if (next.length > 4) return;
      setPin(next);

      if (next.length === 4) {
        if (isSetup) {
          updateSettings({ parentPin: next }).then(() => {
            refreshSettings();
            onSuccess();
          });
        } else if (next === settings?.parentPin) {
          onSuccess();
        } else {
          setError(true);
          setTimeout(() => setPin(''), 300);
        }
      }
    },
    [pin, isSetup, settings?.parentPin, onSuccess, refreshSettings],
  );

  const handleDelete = () => {
    setPin((p) => p.slice(0, -1));
    setError(false);
  };

  return (
    <div className="pin-overlay" onClick={onCancel}>
      <div className="pin-dialog" onClick={(e) => e.stopPropagation()}>
        <h2 className="pin-title">{isSetup ? t('pin.setup') : t('pin.title')}</h2>

        <div className="pin-dots">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`pin-dot ${i < pin.length ? 'pin-dot--filled' : ''} ${error ? 'pin-dot--error' : ''}`}
            />
          ))}
        </div>

        {error && <p className="pin-error">{t('pin.wrong')}</p>}

        <div className="pin-keypad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map(
            (key) =>
              key === '' ? (
                <div key="empty" />
              ) : key === '⌫' ? (
                <button key="del" className="pin-key" onClick={handleDelete}>
                  ⌫
                </button>
              ) : (
                <button key={key} className="pin-key" onClick={() => handleDigit(key)}>
                  {key}
                </button>
              ),
          )}
        </div>
      </div>
    </div>
  );
}
