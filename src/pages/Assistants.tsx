import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { assistants } from '../data/assistants';
import '../styles/assistants.css';

const Assistants: React.FC = () => {
  const { settings } = useSettings();
  const theme = settings.theme;
  const [selected, setSelected] = useState<string | null>(() => {
    return localStorage.getItem('gehenna-assistant') || null;
  });
  const [currentImageIndex, setCurrentImageIndex] = useState<Record<string, number>>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const newState = { ...prev };
        assistants.forEach((a) => {
          newState[a.id] = ((prev[a.id] || 0) + 1) % 3;
        });
        return newState;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getImageForState = (assistantId: string, state: number) => {
    const assistant = assistants.find(a => a.id === assistantId);
    if (!assistant) return '';
    const states = ['idle', 'listening', 'speaking'];
    const key = states[state % states.length] as keyof typeof assistant.images;
    return assistant.images[key];
  };

  const selectAssistant = (id: string) => {
    setSelected(id);
    localStorage.setItem('gehenna-assistant', id);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: theme.text, marginBottom: '8px' }}>🤖 Выберите помощника</h2>
      <p style={{ color: theme.textSecondary, marginBottom: '24px' }}>
        Выберите голосового помощника, который будет помогать вам в работе.
      </p>

      <div className="assistants-grid">
        {assistants.map((assistant, index) => {
          const isSelected = selected === assistant.id;
          const imgIndex = currentImageIndex[assistant.id] || 0;

          return (
            <div
              key={assistant.id}
              className={`assistant-card ${isSelected ? 'selected' : ''}`}
              style={{
                animationDelay: `${index * 0.15}s`,
                borderColor: isSelected ? theme.primary : theme.border,
              }}
            >
              {/* Убираем эмодзи, оставляем только имя крупно */}
              <h2 style={{ fontSize: '28px', color: theme.text, marginBottom: '8px' }}>
                {assistant.name}
              </h2>
              <div className="assistant-image">
                <img
                  src={getImageForState(assistant.id, imgIndex)}
                  alt={assistant.name}
                />
              </div>
              <p style={{ color: theme.textSecondary, fontSize: '14px', marginBottom: '16px' }}>
                {assistant.description}
              </p>
              <button
                onClick={() => selectAssistant(assistant.id)}
                style={{
                  padding: '8px 24px',
                  borderRadius: '20px',
                  border: isSelected ? 'none' : `1px solid ${theme.border}`,
                  background: isSelected ? theme.primary : 'transparent',
                  color: isSelected ? '#fff' : theme.text,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {isSelected ? '✅ Выбран' : 'Выбрать'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Настройки разрешений убраны отсюда, они перенесены в Settings */}
    </div>
  );
};

export default Assistants;