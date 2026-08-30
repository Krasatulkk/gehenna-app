import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useChat } from '../contexts/ChatContext';
import { useSound } from '../contexts/SoundContext';

const Chat: React.FC = () => {
  const { settings } = useSettings();
  const { theme, wallpaper, animationsEnabled } = settings;
  const { avatar } = settings;
  const { getCurrentChat, addMessage, clearChat } = useChat();
  const { playSend, playReceive } = useSound();
  const currentChat = getCurrentChat();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const sendMessage = () => {
    if (!input.trim() || !currentChat) return;
    addMessage(currentChat.id, { from: 'user', text: input });
    playSend();
    setIsTyping(true);
    setInput('');
    setTimeout(() => {
      if (currentChat) {
        addMessage(currentChat.id, {
          from: 'gehenna',
          text: `Это тестовый ответ на: "${input}" (ИИ пока не подключён)`,
        });
        setIsTyping(false);
        playReceive();
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleClearChat = () => {
    if (!currentChat) return;
    if (window.confirm('Очистить весь чат? Это действие необратимо.')) {
      clearChat(currentChat.id);
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportChat = () => {
    if (!currentChat) return;
    const lines = currentChat.messages.map(
      (msg) => `[${new Date(msg.timestamp).toLocaleString()}] ${msg.from === 'user' ? 'Вы' : 'Gehenna'}: ${msg.text}`
    );
    const content = `Чат: ${currentChat.name}\n${'='.repeat(30)}\n${lines.join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_${currentChat.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!currentChat) {
    return (
      <div style={{ padding: '24px', color: theme.textSecondary }}>
        Нет активного чата. Создайте новый.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          padding: '12px 24px',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: theme.bg,
        }}
      >
        <span style={{ fontWeight: 600, color: theme.text }}>{currentChat.name}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={exportChat}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              background: 'transparent',
              color: theme.textSecondary,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            📤 Экспорт
          </button>
          <button
            onClick={handleClearChat}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              background: 'transparent',
              color: theme.textSecondary,
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            🗑️ Очистить
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          backgroundImage: wallpaper || 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background 0.3s',
        }}
      >
        {currentChat.messages.map((msg) => {
          const isUser = msg.from === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
                alignItems: 'flex-start',
                gap: '10px',
                marginBottom: '16px',
                animation: animationsEnabled ? 'fadeInUp 0.3s ease' : 'none',
              }}
            >
              {!isUser && (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: theme.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '16px',
                    flexShrink: 0,
                  }}
                >
                  G
                </div>
              )}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: isUser ? theme.primary : theme.surface,
                  color: isUser ? '#fff' : theme.text,
                  border: isUser ? 'none' : `1px solid ${theme.border}`,
                  wordWrap: 'break-word',
                  position: 'relative',
                }}
              >
                {msg.text}
                <button
                  onClick={() => copyMessage(msg.text)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    marginLeft: '8px',
                    color: isUser ? 'rgba(255,255,255,0.7)' : theme.textSecondary,
                    padding: 0,
                    verticalAlign: 'middle',
                  }}
                  title="Копировать"
                >
                  📋
                </button>
              </div>
              {isUser && (
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: theme.surface,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="User"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: theme.primary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '16px',
                      }}
                    >
                      U
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: theme.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 700,
                fontSize: '16px',
                flexShrink: 0,
              }}
            >
              G
            </div>
            <div
              style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                color: theme.textSecondary,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: theme.primary,
                  animation: animationsEnabled ? 'bounce 1.2s infinite ease-in-out' : 'none',
                }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: theme.primary,
                  animation: animationsEnabled ? 'bounce 1.2s infinite ease-in-out 0.2s' : 'none',
                }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: theme.primary,
                  animation: animationsEnabled ? 'bounce 1.2s infinite ease-in-out 0.4s' : 'none',
                }}
              />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: '16px 20px',
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          gap: '12px',
          background: theme.bg,
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '24px',
            border: `1px solid ${theme.border}`,
            background: theme.surface,
            color: theme.text,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            background: theme.primary,
            color: '#fff',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'all 0.25s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default Chat;