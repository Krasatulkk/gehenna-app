import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

const VoiceButton: React.FC = () => {
  const { settings } = useSettings();
  const { theme } = settings;
  const [isListening, setIsListening] = useState(false);

  const toggleListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Голосовой ввод не поддерживается в вашем браузере.');
      return;
    }
    setIsListening(!isListening);
    // Здесь можно добавить логику распознавания
  };

  return (
    <button
      onClick={toggleListening}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '24px',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        border: 'none',
        background: isListening ? '#ef4444' : theme.primary,
        color: '#fff',
        fontSize: '24px',
        cursor: 'pointer',
        boxShadow: isListening ? '0 0 30px #ef4444' : '0 4px 20px rgba(0,0,0,0.2)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
      title={isListening ? 'Слушаю...' : 'Голосовой ввод'}
    >
      {isListening ? '⏺️' : '🎤'}
    </button>
  );
};

export default VoiceButton;