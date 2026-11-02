import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/hooks/useAppState';
import { getWeekActivities, getTotalTimeThisWeek } from '@/services/progress';
import { getOrCreateWeeklyGoal } from '@/services/gamification';
import { t, localized } from '@/services/i18n';
import { useTheme } from '@/themes/ThemeContext';
import { worlds, getActivity } from '@/data/curriculum';
import type { WeeklyGoal, ActivityProgress } from '@/types';
import './Progress.css';

const DAY_LABELS_ES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAY_LABELS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface TopicStat {
  worldId: string;
  worldName: string;
  worldIcon: string;
  count: number;
  avgScore: number;
}

export function Progress() {
  const navigate = useNavigate();
  const { activeChild, settings } = useApp();
  const { theme } = useTheme();
  const [goal, setGoal] = useState<WeeklyGoal | null>(null);
  const [weekActs, setWeekActs] = useState<ActivityProgress[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const reportRef = useRef<HTMLDivElement>(null);

  const locale = settings?.locale ?? 'es';
  const dayLabels = locale === 'es' ? DAY_LABELS_ES : DAY_LABELS_EN;

  useEffect(() => {
    if (!activeChild) return;
    getOrCreateWeeklyGoal(activeChild.id).then(setGoal);
    getWeekActivities(activeChild.id).then(setWeekActs);
    getTotalTimeThisWeek(activeChild.id).then(setTotalTime);
  }, [activeChild]);

  if (!activeChild) return null;

  const minutes = Math.round(totalTime / 60_000);

  // Daily breakdown
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const dailyCounts = Array(7).fill(0);
  for (const act of weekActs) {
    const d = new Date(act.completedAt);
    const dayIdx = (d.getDay() + 6) % 7;
    dailyCounts[dayIdx]++;
  }
  const maxDaily = Math.max(...dailyCounts, 1);

  // Topic stats
  const topicMap = new Map<string, { count: number; totalScore: number }>();
  for (const act of weekActs) {
    const def = getActivity(act.activityId);
    if (!def) continue;
    const actId = act.activityId;
    let worldId = 'other';
    for (const w of worlds) {
      for (const topic of w.topics) {
        for (const unit of topic.units) {
          for (const lesson of unit.lessons) {
            if (lesson.activities.some((a) => a.activityId === actId)) {
              worldId = w.id;
            }
          }
        }
      }
    }
    const existing = topicMap.get(worldId) ?? { count: 0, totalScore: 0 };
    existing.count++;
    existing.totalScore += act.score;
    topicMap.set(worldId, existing);
  }

  const topicStats: TopicStat[] = [];
  for (const [wid, data] of topicMap) {
    const w = worlds.find((x) => x.id === wid);
    topicStats.push({
      worldId: wid,
      worldName: w ? localized(w.name) : wid,
      worldIcon: w?.icon ?? '📦',
      count: data.count,
      avgScore: data.count > 0 ? data.totalScore / data.count : 0,
    });
  }
  topicStats.sort((a, b) => b.avgScore - a.avgScore);

  const best = topicStats[0];
  const worst = topicStats.length > 1 ? topicStats[topicStats.length - 1] : null;

  const avgScoreAll = weekActs.length > 0
    ? weekActs.reduce((s, a) => s + a.score, 0) / weekActs.length
    : 0;

  // Recommendations
  const recommendations: string[] = [];
  if (worst && worst.avgScore < 2) {
    recommendations.push(
      locale === 'es'
        ? `Practica más en ${worst.worldIcon} ${worst.worldName} para mejorar`
        : `Practice more in ${worst.worldIcon} ${worst.worldName} to improve`,
    );
  }
  if (weekActs.length < 5) {
    recommendations.push(
      locale === 'es'
        ? 'Intenta hacer al menos 5 actividades esta semana'
        : 'Try to complete at least 5 activities this week',
    );
  }
  if (best && best.avgScore >= 2.5 && topicStats.length < worlds.length) {
    const missingWorld = worlds.find((w) => !topicMap.has(w.id));
    if (missingWorld) {
      recommendations.push(
        locale === 'es'
          ? `¡Explora ${missingWorld.icon} ${localized(missingWorld.name)} esta semana!`
          : `Explore ${missingWorld.icon} ${localized(missingWorld.name)} this week!`,
      );
    }
  }
  if (recommendations.length === 0) {
    recommendations.push(
      locale === 'es' ? '¡Buen ritmo! Sigue así 💪' : 'Great pace! Keep it up 💪',
    );
  }

  const goalPct = goal
    ? Math.min(100, (goal.completedActivities / goal.targetActivities) * 100)
    : 0;

  return (
    <div className="screen progress-screen" ref={reportRef}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ fontSize: 20, minWidth: 48, minHeight: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ←
        </button>
        <h1 className="progress-screen__title" style={{ margin: 0 }}>
          {t('parents.weeklyReport')}
        </h1>
      </header>

      <div className="progress-screen__child">
        🧒 {activeChild.name} ({activeChild.age} {locale === 'es' ? 'años' : 'years'})
      </div>

      {/* Stats row */}
      <section className="progress-screen__section">
        <div className="progress-screen__stats">
          <div className="progress-screen__stat">
            <span className="progress-screen__stat-value">{weekActs.length}</span>
            <span className="progress-screen__stat-label">{t('parents.activities')}</span>
          </div>
          <div className="progress-screen__stat">
            <span className="progress-screen__stat-value">{minutes}m</span>
            <span className="progress-screen__stat-label">{t('parents.time')}</span>
          </div>
          <div className="progress-screen__stat">
            <span className="progress-screen__stat-value">
              {'⭐'} {avgScoreAll.toFixed(1)}
            </span>
            <span className="progress-screen__stat-label">{t('parents.avgScore')}</span>
          </div>
          <div className="progress-screen__stat">
            <span className="progress-screen__stat-value">
              🔥 {goal?.streakWeeks ?? 0}
            </span>
            <span className="progress-screen__stat-label">{t('parents.streak')}</span>
          </div>
        </div>
      </section>

      {/* Daily chart */}
      <section className="progress-screen__section">
        <h2>{locale === 'es' ? 'Actividades por día' : 'Activities per day'}</h2>
        <div className="progress-chart">
          {dailyCounts.map((count, i) => {
            const today = (now.getDay() + 6) % 7;
            const isToday = i === today;
            return (
              <div key={i} className="progress-chart__col">
                <div className="progress-chart__bar-wrapper">
                  <div
                    className="progress-chart__bar"
                    style={{
                      height: `${(count / maxDaily) * 100}%`,
                      background: isToday
                        ? theme.colors.primary
                        : `linear-gradient(to top, ${theme.colors.progressFillStart}, ${theme.colors.progressFillEnd})`,
                      opacity: count === 0 ? 0.2 : 1,
                      minHeight: count > 0 ? 8 : 4,
                    }}
                  />
                </div>
                <span
                  className="progress-chart__label"
                  style={{ fontWeight: isToday ? 800 : 500 }}
                >
                  {dayLabels[i]}
                </span>
                {count > 0 && (
                  <span className="progress-chart__count">{count}</span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Goal progress */}
      {goal && (
        <section className="progress-screen__section">
          <h2>{t('home.weeklyGoal')}</h2>
          <div className="progress-screen__goal-bar-wrapper">
            <div className="progress-screen__goal-bar">
              <div
                className="progress-screen__goal-fill"
                style={{ width: `${goalPct}%` }}
              />
            </div>
            <span>{goal.completedActivities}/{goal.targetActivities}</span>
          </div>
        </section>
      )}

      {/* By topic */}
      {topicStats.length > 0 && (
        <section className="progress-screen__section">
          <h2>{t('parents.byTopic')}</h2>
          <div className="progress-topics">
            {topicStats.map((ts) => (
              <div key={ts.worldId} className="progress-topic-row">
                <span className="progress-topic-row__icon">{ts.worldIcon}</span>
                <span className="progress-topic-row__name">{ts.worldName}</span>
                <span className="progress-topic-row__count">{ts.count}x</span>
                <span className="progress-topic-row__stars">
                  {'⭐'.repeat(Math.round(ts.avgScore))}
                  {'☆'.repeat(3 - Math.round(ts.avgScore))}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      <section className="progress-screen__section">
        <h2>{t('parents.recommendation')}</h2>
        <div className="progress-recommendations">
          {recommendations.map((rec, i) => (
            <div key={i} className="progress-recommendation">
              <span className="progress-recommendation__icon">💡</span>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
