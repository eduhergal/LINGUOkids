import { useParams } from 'react-router-dom';
import { worlds, activities as allActivities } from '@/data/curriculum';
import { localized, t } from '@/services/i18n';
import { TopicCard } from '@/components/TopicCard/TopicCard';
import { ActivityCard } from '@/components/ActivityCard/ActivityCard';
import './Lessons.css';

export function Lessons() {
  const { worldId, topicId } = useParams();

  if (topicId && worldId) {
    const world = worlds.find((w) => w.id === worldId);
    const topic = world?.topics.find((tp) => tp.id === topicId);
    if (!topic) return <div className="screen">{t('lessons.title')}</div>;

    return (
      <div className="screen lessons">
        <h1 className="lessons__title">{localized(topic.name)}</h1>
        <p className="lessons__desc">{localized(topic.description)}</p>
        {topic.units.map((unit) => (
          <section key={unit.id} className="lessons__unit">
            <h2 className="lessons__unit-title">{localized(unit.name)}</h2>
            {unit.lessons.map((lesson) => (
              <div key={lesson.id} className="lessons__lesson">
                <h3 className="lessons__lesson-title">{localized(lesson.name)}</h3>
                <div className="lessons__activities">
                  {lesson.activities.map((ref) => {
                    const act = allActivities.find((a) => a.id === ref.activityId);
                    if (!act) return null;
                    return <ActivityCard key={act.id} activity={act} />;
                  })}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    );
  }

  if (worldId) {
    const world = worlds.find((w) => w.id === worldId);
    if (!world) return <div className="screen">{t('lessons.title')}</div>;

    return (
      <div className="screen lessons">
        <h1 className="lessons__title">
          {world.icon} {localized(world.name)}
        </h1>
        <div className="lessons__topics">
          {world.topics.map((topic) => (
            <TopicCard key={topic.id} topic={topic} worldColor={world.color} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="screen lessons">
      <h1 className="lessons__title">{t('lessons.title')}</h1>
      {worlds.map((world) => (
        <section key={world.id} className="lessons__world-section">
          <h2 className="lessons__world-heading">
            {world.icon} {localized(world.name)}
          </h2>
          <div className="lessons__topics">
            {world.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} worldColor={world.color} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
