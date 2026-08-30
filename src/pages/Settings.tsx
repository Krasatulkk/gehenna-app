import React, { useState, useEffect, useRef } from 'react';
import { useSettings, defaultTheme, Theme } from '../contexts/SettingsContext';

const presets: { name: string; theme: Theme }[] = [
  {
    name: 'Светлый (по умолчанию)',
    theme: {
      bg: '#ffffff',
      surface: '#f0f9ff',
      primary: '#38bdf8',
      primaryHover: '#0ea5e9',
      text: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
    },
  },
  {
    name: 'Тёмный',
    theme: {
      bg: '#0f172a',
      surface: '#1e293b',
      primary: '#38bdf8',
      primaryHover: '#0ea5e9',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#334155',
    },
  },
  {
    name: 'Красный',
    theme: {
      bg: '#0a0a0f',
      surface: '#111827',
      primary: '#dc2626',
      primaryHover: '#b91c1c',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#1e293b',
    },
  },
  {
    name: 'Зелёный',
    theme: {
      bg: '#0a0a0f',
      surface: '#111827',
      primary: '#22c55e',
      primaryHover: '#16a34a',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#1e293b',
    },
  },
  {
    name: 'Фиолетовый',
    theme: {
      bg: '#0a0a0f',
      surface: '#111827',
      primary: '#8b5cf6',
      primaryHover: '#7c3aed',
      text: '#f8fafc',
      textSecondary: '#94a3b8',
      border: '#1e293b',
    },
  },
];

const Settings: React.FC = () => {
  const { settings, updateSettings, updateTheme, updateAvatar } = useSettings();
  const { theme, avatar, fontSize, fontFamily, panelOpacity, wallpaper, autoDarkMode, darkModeStart, darkModeEnd, dndMode, animationsEnabled } = settings;
  const [localTheme, setLocalTheme] = useState<Theme>(theme);
  const [updateStatus, setUpdateStatus] = useState<string>('');
  const [fileAccess, setFileAccess] = useState<boolean>(() => {
    return localStorage.getItem('gehenna-file-access') === 'true';
  });
  const [micAccess, setMicAccess] = useState<boolean>(() => {
    return localStorage.getItem('gehenna-mic-access') === 'true';
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalTheme(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gehenna-file-access', String(fileAccess));
    localStorage.setItem('gehenna-mic-access', String(micAccess));
  }, [fileAccess, micAccess]);

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      updateSettings({ wallpaper: base64 });
    };
    reader.readAsDataURL(file);
  };

  const requestFileAccess = async () => {
    if (window.electronAPI) {
      const result = await window.electronAPI.openFileDialog();
      if (result && !result.canceled) {
        setFileAccess(true);
        alert('✅ Доступ к файлам предоставлен.');
      } else {
        setFileAccess(false);
        alert('❌ Доступ отклонён.');
      }
    } else {
      try {
        const [fileHandle] = await window.showOpenFilePicker();
        if (fileHandle) {
          setFileAccess(true);
          alert('✅ Доступ к файлам предоставлен.');
        }
      } catch {
        setFileAccess(false);
        alert('❌ Доступ отклонён.');
      }
    }
  };

  const requestMicAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicAccess(true);
      alert('✅ Доступ к микрофону предоставлен.');
    } catch {
      setMicAccess(false);
      alert('❌ Доступ к микрофону отклонён.');
    }
  };

  const handleCheckUpdates = async () => {
    if (window.electronAPI) {
      setUpdateStatus('Проверка...');
      await window.electronAPI.checkForUpdates();
    } else {
      alert('Функция доступна только в десктопной версии.');
    }
  };

  const colorFields: { key: keyof Theme; label: string }[] = [
    { key: 'bg', label: 'Основной фон' },
    { key: 'surface', label: 'Фон карточек' },
    { key: 'primary', label: 'Акцентный цвет' },
    { key: 'primaryHover', label: 'Акцент при наведении' },
    { key: 'text', label: 'Основной текст' },
    { key: 'textSecondary', label: 'Второстепенный текст' },
    { key: 'border', label: 'Цвет границ' },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '8px', color: theme.text }}>⚙️ Настройки</h2>

      {/* Внешний вид */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '12px', color: theme.text, fontSize: '16px' }}>🎨 Внешний вид</h3>
        {/* Пресеты */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                setLocalTheme(preset.theme);
                updateTheme(preset.theme);
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '30px',
                border: '1px solid var(--color-border)',
                background: 'transparent',
                color: theme.text,
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'all 0.25s ease',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = theme.surface)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={() => {
              setLocalTheme(defaultTheme);
              updateTheme(defaultTheme);
            }}
            style={{
              padding: '8px 16px',
              borderRadius: '30px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: theme.textSecondary,
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.25s ease',
            }}
          >
            🔄 Сбросить
          </button>
        </div>
        {/* Цветовые пикеры */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {colorFields.map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <label style={{ fontSize: '13px', color: theme.textSecondary }}>{label}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="color"
                  value={localTheme[key]}
                  onChange={(e) => {
                    const updated = { ...localTheme, [key]: e.target.value };
                    setLocalTheme(updated);
                    updateTheme(updated);
                  }}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    borderRadius: '8px',
                    background: 'transparent',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                />
                <input
                  type="text"
                  value={localTheme[key]}
                  onChange={(e) => {
                    const updated = { ...localTheme, [key]: e.target.value };
                    setLocalTheme(updated);
                    updateTheme(updated);
                  }}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                    fontSize: '13px',
                    fontFamily: 'monospace',
                    outline: 'none',
                  }}
                />
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    background: localTheme[key],
                    border: `1px solid ${theme.border}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Шрифт и размер (14) */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: theme.textSecondary }}>Размер текста: {fontSize}px</label>
          <input
            type="range"
            min="12"
            max="24"
            value={fontSize}
            onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
          <label style={{ display: 'block', marginTop: '12px', marginBottom: '4px', color: theme.textSecondary }}>Шрифт</label>
          <select
            value={fontFamily}
            onChange={(e) => updateSettings({ fontFamily: e.target.value })}
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              background: theme.surface,
              color: theme.text,
              width: '100%',
            }}
          >
            <option value="sans-serif">Sans-serif</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>

        {/* Авто-тёмная тема (15) */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.text }}>
            <input
              type="checkbox"
              checked={autoDarkMode}
              onChange={(e) => updateSettings({ autoDarkMode: e.target.checked })}
            />
            Автоматическая тёмная тема по времени
          </label>
          {autoDarkMode && (
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <div>
                <label style={{ fontSize: '13px', color: theme.textSecondary }}>Начало</label>
                <input
                  type="time"
                  value={darkModeStart}
                  onChange={(e) => updateSettings({ darkModeStart: e.target.value })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', color: theme.textSecondary }}>Конец</label>
                <input
                  type="time"
                  value={darkModeEnd}
                  onChange={(e) => updateSettings({ darkModeEnd: e.target.value })}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '12px',
                    border: `1px solid ${theme.border}`,
                    background: theme.surface,
                    color: theme.text,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Кастомные обои (23) */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: theme.textSecondary }}>Обои чата</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleWallpaperUpload}
            style={{
              padding: '6px 10px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              background: theme.surface,
              color: theme.text,
            }}
          />
          {wallpaper && (
            <button
              onClick={() => updateSettings({ wallpaper: null })}
              style={{
                marginTop: '8px',
                padding: '6px 16px',
                borderRadius: '30px',
                border: 'none',
                background: '#ef4444',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '13px',
              }}
            >
              Удалить обои
            </button>
          )}
        </div>

        {/* Прозрачность панели (32) */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'block', marginBottom: '4px', color: theme.textSecondary }}>Прозрачность панели: {Math.round(panelOpacity * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={panelOpacity}
            onChange={(e) => updateSettings({ panelOpacity: Number(e.target.value) })}
            style={{ width: '100%' }}
          />
        </div>

        {/* Эффект стекла (28) — включен по умолчанию, можно добавить переключатель */}
        <div style={{ marginTop: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: theme.text }}>
            <input type="checkbox" defaultChecked disabled />
            Эффект стекла (всегда включён)
          </label>
        </div>
      </div>

      {/* Расширенные настройки */}
      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: `1px solid ${theme.border}` }}>
        <h3 style={{ color: theme.text, fontSize: '16px', marginBottom: '16px' }}>🔒 Расширенные настройки</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: theme.text }}>Доступ к файлам</span>
            <div>
              <span style={{ color: fileAccess ? '#22c55e' : '#ef4444', marginRight: '12px' }}>
                {fileAccess ? '✅ Разрешён' : '❌ Запрещён'}
              </span>
              <button
                onClick={requestFileAccess}
                style={{
                  padding: '6px 16px',
                  borderRadius: '30px',
                  border: 'none',
                  background: theme.primary,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.25s ease',
                }}
              >
                {fileAccess ? 'Изменить' : 'Запросить'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: theme.text }}>Доступ к микрофону</span>
            <div>
              <span style={{ color: micAccess ? '#22c55e' : '#ef4444', marginRight: '12px' }}>
                {micAccess ? '✅ Разрешён' : '❌ Запрещён'}
              </span>
              <button
                onClick={requestMicAccess}
                style={{
                  padding: '6px 16px',
                  borderRadius: '30px',
                  border: 'none',
                  background: theme.primary,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.25s ease',
                }}
              >
                {micAccess ? 'Изменить' : 'Запросить'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: theme.text }}>Режим «Не беспокоить» (17)</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={dndMode}
                onChange={(e) => updateSettings({ dndMode: e.target.checked })}
              />
              {dndMode ? 'Включён' : 'Выключен'}
            </label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: theme.text }}>Анимации (37)</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => updateSettings({ animationsEnabled: e.target.checked })}
              />
              {animationsEnabled ? 'Включены' : 'Отключены'}
            </label>
          </div>
        </div>
      </div>

      {/* Версия и обновления */}
      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px' }}>
          <span style={{ fontSize: '13px', color: theme.textSecondary }}>Версия: 0.1.0</span>
          <button
            onClick={handleCheckUpdates}
            style={{
              padding: '6px 16px',
              borderRadius: '30px',
              border: '1px solid var(--color-border)',
              background: 'transparent',
              color: theme.text,
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'all 0.25s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            🔄 Проверить обновления
          </button>
          {updateStatus && <span style={{ fontSize: '13px', color: theme.primary }}>{updateStatus}</span>}
        </div>
      </div>
    </div>
  );
};

export default Settings;