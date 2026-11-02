import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getChildren } from '@/services/profiles';
import { setLocale, t } from '@/services/i18n';
import { useApp } from '@/hooks/useAppState';
import type { Child } from '@/types';
import './ChildSelect.css';

const AVATAR_EMOJIS: Record<string, string> = {
  'avatar-1': '🦁', 'avatar-2': '🐸', 'avatar-3': '🐻',
  'avatar-4': '🐰', 'avatar-5': '🦊', 'avatar-6': '🐼',
  'avatar-7': '🐨', 'avatar-8': '🐯',
};

export function ChildSelect() {
  const navigate = useNavigate();
  const { setActiveChild } = useApp();
  const [children, setChildren] = useState<Child[]>([]);

  useEffect(() => {
    getChildren().then(setChildren);
  }, []);

  const handleSelect = (child: Child) => {
    setLocale(child.locale);
    setActiveChild(child);
    navigate('/', { replace: true });
  };

  const handleAdd = () => {
    navigate('/onboarding', { replace: true });
  };

  return (
    <div className="child-select screen-no-nav">
      <h1 className="child-select__title">{t('childSelect.title')}</h1>
      <div className="child-select__grid">
        {children.map((child, i) => (
          <motion.button
            key={child.id}
            className="child-select__card"
            onClick={() => handleSelect(child)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="child-select__avatar">
              {AVATAR_EMOJIS[child.avatarId] ?? '🧒'}
            </span>
            <span className="child-select__name">{child.name}</span>
          </motion.button>
        ))}
        <motion.button
          className="child-select__card child-select__card--add"
          onClick={handleAdd}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: children.length * 0.1 }}
        >
          <span className="child-select__avatar">➕</span>
          <span className="child-select__name">{t('childSelect.add')}</span>
        </motion.button>
      </div>
    </div>
  );
}
