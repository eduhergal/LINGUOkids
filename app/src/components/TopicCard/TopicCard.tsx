import { useNavigate } from 'react-router-dom';
import { localized } from '@/services/i18n';
import type { Topic } from '@/types';
import './TopicCard.css';

interface Props {
  topic: Topic;
  worldColor: string;
}

export function TopicCard({ topic, worldColor }: Props) {
  const navigate = useNavigate();

  return (
    <button
      className="topic-card"
      style={{ borderLeftColor: worldColor }}
      onClick={() => navigate(`/lessons/${topic.worldId}/${topic.id}`)}
    >
      <span className="topic-card__name">{localized(topic.name)}</span>
      <span className="topic-card__desc">{localized(topic.description)}</span>
    </button>
  );
}
