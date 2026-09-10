import React, { useState, useRef, useEffect } from 'react';
import { useSettings, defaultTheme, Theme } from '../contexts/SettingsContext';
import { checkServerHealth } from '../api/client';

const presets: { name: string; theme: Theme }[] = [
  {
    name: 'Светлый',
    theme: {
      bg: '#ffffff', surface: '#f0f9ff', primary: '#38bdf8',
      primaryHover: '#0ea5e9', text: '#0f172a', textSecondary: '#475569', border: '#e2e8f0',
    },
  },
  {
    name: 'Тёмный',
    theme: {
      bg: '#0f172a', surface: '#1e293b', primary: '#38bdf8',
      primaryHover: '#0ea5e9', text: '#f8fafc', textSecondary: '#94a3b8', border: '#334155',
    },
  },
  {
    name: 'Красный',
    theme: {
      bg: '#0a0a0f', surface: '#111827', primary: '#dc2626',
      primaryHover: '#b91c1c', text: '#f8fafc', textSecondary: '#94a3b8', border: '#1e293b',
    },
  },
  {
    name: 'Фиолетовый',
    theme: {
      bg: '#0a0a0f', surface: '#111827', primary: '#8b5cf6',
      primaryHover: '#7c3aed', text: '#f8fafc', textSecondary: '#94a3b8', border: '#1e293b',
    },
  },
];

type SettingsModalProps = {
  onClose: () => void;
};

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, updateTheme, updateAvatar } = useSettings();
  const { theme, avatar, fontSize, fontFamily, dndMode, animationsEnabled } = settings;
  const [serverUrl, setServerUrl] = useState(() => localStorage.getItem('gehenna-server-url') || 'http://localhost:8000');
  const [serverStatus, setServerStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [updateStatus, setUpdateStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Проверка статуса сервера
  useEffect(() => {
    const check = async () => {
      const online = await checkServerHealth();
      setServerStatus(online ? 'online' : 'offline');
    };
    check();
    const interval = setInterval(check, 10000);
    return () => clearInterval(interval);
  }, [serverUrl]);

  const handleServerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setServerUrl(url);
    localStorage.setItem('gehenna-server-url', url);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => updateAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCheckUpdates = async () => {
    if (window.electronAPI) {
      setUpdateStatus('Проверка...');
      await window.electronAPI.checkForUpdates();
    } else {
      alert('Доступно только в десктопной версии');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.surface,
          borderRadius: '24px',
          padding: '32px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          border: `1px solid ${theme.border}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ color: theme.text, fontSize: '22px', margin: 0 }}>⚙️ Настройки</h2>
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: theme.textSecondary,
              fontSize: '28px', cursor: 'pointer', padding: '0 8px', lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Аватар */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: theme.text, fontSize: '15px', marginBottom: '12px' }}>🖼️ Аватар</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {avatar ? (
              <img src={avatar} alt="Avatar" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 700 }}>G</div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{ padding: '8px 20px', borderRadius: '30px', border: 'none', background: theme.primary, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
            >
              Загрузить фото
            </button>
            {avatar && (
              <button onClick={() => updateAvatar(null)} style={{ padding: '8px 16px', borderRadius: '30px', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.textSecondary, cursor: 'pointer', fontSize: '13px' }}>
                Удалить
              </button>
            )}
            <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
        </div>

        {/* Адрес сервера */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: theme.text, fontSize: '15px', marginBottom: '12px' }}>🌐 Сервер ИИ</h3>
          <input
            type="text"
            value={serverUrl}
            onChange={handleServerUrlChange}
            placeholder="http://your-server-ip:8000"
            style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text, fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
          />
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: theme.textSecondary }}>Статус:</span>
            <span style={{ color: serverStatus === 'online' ? '#22c55e' : serverStatus === 'offline' ? '#ef4444' : '#f59e0b', fontWeight: 600, fontSize: '13px' }}>
              {serverStatus === 'online' ? '✅ Онлайн' : serverStatus === 'offline' ? '❌ Офлайн' : '⏳ Проверка...'}
            </span>
          </div>
        </div>

        {/* Пресеты */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: theme.text, fontSize: '15px', marginBottom: '12px' }}>🎨 Тема</h3>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateTheme(preset.theme)}
                style={{ padding: '8px 16px', borderRadius: '30px', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.text, cursor: 'pointer', fontSize: '13px' }}
              >
                {preset.name}
              </button>
            ))}
            <button onClick={() => updateTheme(defaultTheme)} style={{ padding: '8px 16px', borderRadius: '30px', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.textSecondary, cursor: 'pointer', fontSize: '13px' }}>
              🔄 Сбросить
            </button>
          </div>
        </div>

        {/* Шрифт */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: theme.text, fontSize: '15px', marginBottom: '12px' }}>📝 Шрифт</h3>
          <label style={{ fontSize: '13px', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
            Размер: {fontSize}px
          </label>
          <input type="range" min="12" max="24" value={fontSize} onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })} style={{ width: '100%' }} />
          <select
            value={fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
            style={{ width: '100%', marginTop: '8px', padding: '8px 12px', borderRadius: '12px', border: `1px solid ${theme.border}`, background: theme.bg, color: theme.text }}
          >
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        {/* Переключатели */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: theme.text, fontSize: '15px', marginBottom: '12px' }}>🔧 Дополнительно</h3>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.text, marginBottom: '8px' }}>
            <input type="checkbox" checked={dndMode} onChange={(e) => updateSettings({ dndMode: e.target.checked })} />
            Режим «Не беспокоить»
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.text }}>
            <input type="checkbox" checked={animationsEnabled} onChange={(e) => updateSettings({ animationsEnabled: e.target.checked })} />
            Анимации
          </label>
        </div>

        {/* Версия */}
        <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: theme.textSecondary }}>Версия: 0.2.0</span>
          <button onClick={handleCheckUpdates} style={{ padding: '6px 16px', borderRadius: '30px', border: `1px solid ${theme.border}`, background: 'transparent', color: theme.text, cursor: 'pointer', fontSize: '13px' }}>
            🔄 Проверить обновления
          </button>
          {updateStatus && <span style={{ fontSize: '13px', color: theme.primary }}>{updateStatus}</span>}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;