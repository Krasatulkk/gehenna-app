import React, { useState, useEffect } from 'react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ChatProvider } from './contexts/ChatContext';
import { SoundProvider } from './contexts/SoundContext';
import Header from './components/Header';
import Chat from './pages/Chat';
import Login from './pages/Login';
import SettingsModal from './components/SettingsModal';
import ProfileModal from './components/ProfileModal';
import VoiceButton from './components/VoiceButton';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';

const AppContent: React.FC<{ user: string; onLogout: () => void }> = ({ user, onLogout }) => {
  const { settings } = useSettings();
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header onProfileClick={() => setShowProfile(true)} />
      <Chat />
      <VoiceButton />

      {/* Шестерёнка в левом нижнем углу */}
      <button
        onClick={() => setShowSettings(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          border: 'none',
          background: settings.theme.primary,
          color: '#fff',
          fontSize: '22px',
          cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Настройки"
      >
        ⚙️
      </button>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} onLogout={onLogout} />}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('gehenna-current-user') || null;
  });

  if (!user) {
    return (
      <SettingsProvider>
        <Login onLogin={(username) => setUser(username)} />
      </SettingsProvider>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('gehenna-current-user');
    setUser(null);
  };

  return (
    <SettingsProvider>
      <SoundProviderWrapper>
        <ChatProvider>
          <AppContent user={user} onLogout={handleLogout} />
        </ChatProvider>
      </SoundProviderWrapper>
    </SettingsProvider>
  );
};

// Обёртка для SoundProvider, чтобы получить dndMode из настроек
const SoundProviderWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings } = useSettings();
  return <SoundProvider dndMode={settings.dndMode}>{children}</SoundProvider>;
};

export default App;