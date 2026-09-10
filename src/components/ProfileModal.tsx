import React, { useState, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

type ProfileModalProps = {
  onClose: () => void;
  onLogout: () => void;
};

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose, onLogout }) => {
  const { settings, updateAvatar } = useSettings();
  const { theme, avatar } = settings;
  const [name, setName] = useState('Пользователь');
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleTelegramSync = () => {
    alert('🔗 Синхронизация с Telegram (заглушка).\nБудет доступна позже.');
  };

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      onLogout();
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surface, borderRadius: '24px', padding: '32px',
          maxWidth: '480px', width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: theme.text, fontSize: '22px', margin: 0 }}>👤 Профиль</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: theme.textSecondary, fontSize: '28px', cursor: 'pointer', padding: '0 8px', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
          {avatar ? (
            <img src={avatar} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '32px', fontWeight: 700 }}>G</div>
          )}
          <div>
            <div style={{ fontSize: '20px', fontWeight: 600, color: theme.text, marginBottom: '6px' }}>{name}</div>
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '6px 16px', borderRadius: '30px', border: 'none', background: theme.primary, color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
            >
              📷 Изменить фото
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: theme.textSecondary, fontSize: '13px' }}>Имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '12px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={handleSave}
          style={{ padding: '10px 24px', borderRadius: '30px', border: 'none', background: theme.primary, color: '#fff', fontWeight: 600, fontSize: '15px', cursor: 'pointer', marginBottom: '12px' }}
        >
          💾 Сохранить
        </button>

        {saved && <div style={{ padding: '8px 12px', borderRadius: '12px', background: '#22c55e20', color: '#22c55e', fontSize: '13px', marginBottom: '12px' }}>✅ Сохранено!</div>}

        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px', marginTop: '16px' }}>
          <button
            onClick={handleTelegramSync}
            style={{ width: '100%', padding: '10px', borderRadius: '30px', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.text, cursor: 'pointer', fontSize: '14px', marginBottom: '8px' }}
          >
            🔗 Связать с Telegram
          </button>
          <button
            onClick={handleLogout}
            style={{ width: '100%', padding: '10px', borderRadius: '30px', border: `1px solid ${theme.border}`, background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
          >
            🚪 Выйти
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;