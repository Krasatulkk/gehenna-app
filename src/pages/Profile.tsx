import React, { useState, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

type ProfileProps = {
  onLogout?: () => void;
};

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const { settings, updateAvatar } = useSettings();
  const theme = settings.theme;
  const { avatar } = settings;
  const [name, setName] = useState('Пользователь');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      updateAvatar(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleTelegramSync = () => {
    alert('🔗 Синхронизация с Telegram (заглушка).\nБудет доступна после подключения сервера.');
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      if (onLogout) onLogout();
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ color: theme.text, marginBottom: '16px' }}>👤 Профиль</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          />
        ) : (
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: theme.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '32px',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}
          >
            G
          </div>
        )}
        <div>
          <div style={{ fontSize: '20px', fontWeight: 600, color: theme.text }}>{name}</div>
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '6px 16px',
              borderRadius: '30px',
              border: 'none',
              background: theme.primary,
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              marginTop: '4px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              transition: 'all 0.25s ease',
            }}
          >
            📷 Изменить аватарку
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', color: theme.textSecondary }}>Имя</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '16px',
            border: `1.5px solid ${theme.border}`,
            background: theme.surface,
            color: theme.text,
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.25s, box-shadow 0.25s',
          }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          padding: '10px 24px',
          borderRadius: '30px',
          border: 'none',
          background: theme.primary,
          color: '#fff',
          fontWeight: 600,
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.25s ease',
        }}
      >
        💾 Сохранить
      </button>

      {saved && (
        <div
          style={{
            marginTop: '12px',
            padding: '12px',
            borderRadius: '16px',
            background: '#22c55e20',
            color: '#22c55e',
            border: '1px solid #22c55e',
          }}
        >
          ✅ Данные сохранены!
        </div>
      )}

      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: `1px solid ${theme.border}` }}>
        <h3 style={{ color: theme.text, fontSize: '16px', marginBottom: '8px' }}>🔗 Синхронизация</h3>
        <button
          onClick={handleTelegramSync}
          style={{
            padding: '10px 20px',
            borderRadius: '30px',
            border: `1px solid ${theme.border}`,
            background: 'transparent',
            color: theme.text,
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.25s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          Связать с Telegram
        </button>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 24px',
            borderRadius: '30px',
            border: `1px solid ${theme.border}`,
            background: 'transparent',
            color: '#ef4444',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.25s ease',
          }}
        >
          🚪 Выйти
        </button>
      </div>
    </div>
  );
};

export default Profile;