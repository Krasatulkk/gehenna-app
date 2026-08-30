import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const ImageGen: React.FC = () => {
  const { settings } = useSettings();
  const theme = settings.theme;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ color: theme.text, marginBottom: '8px' }}>🎨 Генерация изображений</h2>
      <p style={{ color: theme.textSecondary }}>
        Здесь будет интерфейс для генерации изображений через ИИ (в разработке).
      </p>
      <div
        style={{
          marginTop: '24px',
          padding: '40px',
          border: `2px dashed ${theme.border}`,
          borderRadius: '16px',
          textAlign: 'center',
          color: theme.textSecondary,
        }}
      >
        ⏳ Скоро здесь появится возможность создавать изображения по текстовому описанию.
      </div>
    </div>
  );
};

export default ImageGen;