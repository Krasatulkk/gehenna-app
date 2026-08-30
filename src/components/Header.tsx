import React from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { settings } = useSettings();
  const { theme, avatar } = settings;
  const location = useLocation();
  const navigate = useNavigate();

  const pageNames: Record<string, string> = {
    '/': 'Чат с Gehenna',
    '/image': 'Генерация изображений',
    '/avatar': '3D-Аватар',
    '/profile': 'Профиль',
    '/settings': 'Настройки',
  };
  const title = pageNames[location.pathname] || 'Gehenna';

  return (
    <div
      style={{
        height: '60px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.border}`,
        background: theme.bg,
      }}
    >
      <span style={{ fontWeight: 600, fontSize: '18px' }}>{title}</span>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        onClick={() => navigate('/profile')}
      >
        <span style={{ fontSize: '14px', color: theme.textSecondary }}>Пользователь</span>
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: theme.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 700,
              fontSize: '16px',
            }}
          >
            G
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;