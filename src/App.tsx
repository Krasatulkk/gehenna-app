import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { ChatProvider } from './contexts/ChatContext';
import { SoundProvider } from './contexts/SoundContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Chat from './pages/Chat';
import ImageGen from './pages/ImageGen';
import Assistants from './pages/Assistants';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import FloatingAssistant from './components/FloatingAssistant';
import { useVoiceAssistant } from './hooks/useVoiceAssistant';

const App: React.FC = () => {
  const [user, setUser] = useState<string | null>(() => {
    return localStorage.getItem('gehenna-current-user') || null;
  });
  const [selectedAssistant, setSelectedAssistant] = useState<string | null>(() => {
    return localStorage.getItem('gehenna-assistant') || null;
  });
  const [showFloating, setShowFloating] = useState(false);

  const { isActivated, deactivate } = useVoiceAssistant(selectedAssistant);

  // ⭐ Получаем dndMode из настроек
  const { settings } = useSettings();
  const dndMode = settings.dndMode;

  useEffect(() => {
    if (isActivated) {
      setShowFloating(true);
      const timer = setTimeout(() => {
        setShowFloating(false);
        deactivate();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isActivated, deactivate]);

  if (!user) {
    return (
      <SettingsProvider>
        <Login onLogin={(username) => setUser(username)} />
      </SettingsProvider>
    );
  }

  return (
    <SettingsProvider>
      <SoundProvider dndMode={dndMode}>
        <ChatProvider>
          <HashRouter>
            <div style={{ display: 'flex', height: '100vh' }}>
              <Sidebar />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header />
                <div style={{ flex: 1, overflow: 'auto' }}>
                  <Routes>
                    <Route path="/" element={<Chat />} />
                    <Route path="/image" element={<ImageGen />} />
                    <Route path="/assistants" element={<Assistants />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </div>
              </div>
            </div>
            {showFloating && (
              <FloatingAssistant
                assistantId={selectedAssistant}
                onClose={() => {
                  setShowFloating(false);
                  deactivate();
                }}
              />
            )}
          </HashRouter>
        </ChatProvider>
      </SoundProvider>
    </SettingsProvider>
  );
};

export default App;