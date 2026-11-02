import { useNavigate } from 'react-router-dom';
import { localized } from '@/services/i18n';
import type { ActivityDef } from '@/types';
import './ActivityCard.css';

const TYPE_ICONS: Record<string, string> = {
  phonics_trace: '✏️',
  phonics_identify: '🔤',
  matching: '🔗',
  memory_cards: '🃏',
  coloring: '🎨',
  drag_and_drop: '👆',
  word_builder: '🧩',
  i_spy: '🔍',
  show_and_tell: '🔊',
  sorting: '📊',
};

interface Props {
  activity: ActivityDef;
  bestScore?: number;
}

export function ActivityCard({ activity, bestScore }: Props) {
  const navigate = useNavigate();

  return (
    <button
      className="activity-card"
      onClick={() => navigate(`/activity/${activity.id}`)}
    >
      <span className="activity-card__icon">
        {TYPE_ICONS[activity.type] ?? '🎮'}
      </span>
      <div className="activity-card__info">
        <span className="activity-card__name">{localized(activity.name)}</span>
        <div className="activity-card__stars">
          {[1, 2, 3].map((s) => (
            <span key={s} className={s <= (bestScore ?? 0) ? 'star--filled' : 'star--empty'}>
              {s <= (bestScore ?? 0) ? '⭐' : '☆'}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}
