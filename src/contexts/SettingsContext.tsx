import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = {
  bg: string;
  surface: string;
  primary: string;
  primaryHover: string;
  text: string;
  textSecondary: string;
  border: string;
};

export const defaultTheme: Theme = {
  bg: '#ffffff',
  surface: '#f0f9ff',
  primary: '#38bdf8',
  primaryHover: '#0ea5e9',
  text: '#0f172a',
  textSecondary: '#475569',
  border: '#e2e8f0',
};

type Settings = {
  theme: Theme;
  avatar: string | null;
  fontSize: number;           // 14
  fontFamily: string;         // 'sans-serif'
  panelOpacity: number;       // 0.8
  wallpaper: string | null;   // URL или градиент
  autoDarkMode: boolean;      // включено ли авто
  darkModeStart: string;      // '21:00'
  darkModeEnd: string;        // '06:00'
  dndMode: boolean;           // режим не беспокоить
  animationsEnabled: boolean; // 37
};

const defaultSettings: Settings = {
  theme: defaultTheme,
  avatar: null,
  fontSize: 14,
  fontFamily: 'sans-serif',
  panelOpacity: 0.8,
  wallpaper: null,
  autoDarkMode: false,
  darkModeStart: '21:00',
  darkModeEnd: '06:00',
  dndMode: false,
  animationsEnabled: true,
};

const SettingsContext = createContext<{
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateTheme: (theme: Theme) => void;
  updateAvatar: (avatar: string | null) => void;
}>({
  settings: defaultSettings,
  updateSettings: () => {},
  updateTheme: () => {},
  updateAvatar: () => {},
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem('gehenna-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // ⭐ Мержим с defaultSettings, чтобы заполнить недостающие поля
        return { ...defaultSettings, ...parsed };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateTheme = (theme: Theme) => {
    setSettings((prev) => ({ ...prev, theme }));
  };

  const updateAvatar = (avatar: string | null) => {
    setSettings((prev) => ({ ...prev, avatar }));
  };

  useEffect(() => {
    localStorage.setItem('gehenna-settings', JSON.stringify(settings));
    const root = document.documentElement;
    const t = settings.theme;
    root.style.setProperty('--color-bg', t.bg);
    root.style.setProperty('--color-surface', t.surface);
    root.style.setProperty('--color-primary', t.primary);
    root.style.setProperty('--color-primary-hover', t.primaryHover);
    root.style.setProperty('--color-text', t.text);
    root.style.setProperty('--color-text-secondary', t.textSecondary);
    root.style.setProperty('--color-border', t.border);
    root.style.setProperty('--font-size-base', (settings.fontSize ?? 14) + 'px');
    root.style.setProperty('--font-family', settings.fontFamily ?? 'sans-serif');
    root.style.setProperty('--panel-opacity', (settings.panelOpacity ?? 0.8).toString());
    root.style.setProperty('--animations-enabled', settings.animationsEnabled ? '1' : '0');
    if (settings.wallpaper) {
      root.style.setProperty('--chat-wallpaper', `url(${settings.wallpaper})`);
    } else {
      root.style.removeProperty('--chat-wallpaper');
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateTheme, updateAvatar }}>
      {children}
    </SettingsContext.Provider>
  );
};