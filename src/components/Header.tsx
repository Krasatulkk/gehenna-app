import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

type HeaderProps = {
  onProfileClick: () => void;
};

const Header: React.FC<HeaderProps> = ({ onProfileClick }) => {
  const { settings } = useSettings();
  const { theme, avatar } = settings;

  return (
    <div
      style={{
        height: '64px',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.border}`,
        background: `rgba(${theme.bg === '#ffffff' ? '255,255,255' : '17,24,39'}, 0.7)`,
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px', fontWeight: 800, color: theme.primary, letterSpacing: '1px' }}>
          GEHENNA
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '30px',
          transition: 'background 0.2s',
        }}
        onClick={onProfileClick}
        onMouseEnter={(e) => (e.currentTarget.style.background = `${theme.primary}15`)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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