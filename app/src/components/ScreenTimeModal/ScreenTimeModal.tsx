import { t } from '@/services/i18n';
import './ScreenTimeModal.css';

export function ScreenTimeModal() {
  return (
    <div className="screentime-overlay">
      <div className="screentime-dialog">
        <div className="screentime-icon">😴</div>
        <h2 className="screentime-title">{t('screenTime.title')}</h2>
        <p className="screentime-message">{t('screenTime.message')}</p>
      </div>
    </div>
  );
}
