import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useChat } from '../contexts/ChatContext';
import { useSound } from '../contexts/SoundContext';
import { sendMessageToAI } from '../api/client';

const Chat: React.FC = () => {
  const { settings } = useSettings();
  const { theme, avatar, animationsEnabled } = settings;
  const { getCurrentChat, addMessage } = useChat();
  const { playSend, playReceive } = useSound();
  const currentChat = getCurrentChat();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.messages]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPendingImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const sendMessage = async () => {
    if (!input.trim() && !pendingImage) return;
    if (!currentChat) return;

    // Отправляем текст
    if (input.trim()) {
      addMessage(currentChat.id, { from: 'user', text: input });
      playSend();
    }

    // Отправляем изображение
    if (pendingImage) {
      addMessage(currentChat.id, { from: 'user', text: `[Фото] ${input || ''}`, image: pendingImage });
      setPendingImage(null);
    }

    const userMessage = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessageToAI(userMessage || 'Что на фото?', 'default');
      setIsTyping(false);
      playReceive();

      if (response.type === 'mcp_command' && response.tool) {
        const result = await window.electronAPI?.executeMCP(response.tool, response.params || {});
        addMessage(currentChat.id, { from: 'gehenna', text: `✅ Результат: ${result}` });
      } else {
        addMessage(currentChat.id, { from: 'gehenna', text: response.response || 'Ответ получен' });
      }
    } catch (error: any) {
      setIsTyping(false);
      addMessage(currentChat.id, { from: 'gehenna', text: `❌ Ошибка: ${error.message}` });
    }
  };

  if (!currentChat) {
    return <div style={{ padding: '24px', color: theme.textSecondary }}>Нет активного чата</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
      {/* Область сообщений с анимированным фоном */}
      <div
        style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          background: 'linear-gradient(-45deg, #0a0a0f, #111827, #1e293b, #0a0a0f)',
          backgroundSize: '400% 400%',
          animation: animationsEnabled ? 'gradientMove 20s ease infinite' : 'none',
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
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px', flexShrink: 0 }}>G</div>
              )}
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  background: isUser ? theme.primary : theme.surface,
                  color: isUser ? '#fff' : theme.text,
                  border: isUser ? 'none' : `1px solid ${theme.border}`,
                  wordWrap: 'break-word',
                }}
              >
                {msg.image && (
                  <img src={msg.image} alt="Uploaded" style={{ maxWidth: '100%', borderRadius: '12px', marginBottom: msg.text ? '8px' : 0 }} />
                )}
                {msg.text && <div>{msg.text}</div>}
              </div>
              {isUser && (
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: theme.surface, border: `1px solid ${theme.border}` }}>
                  {avatar ? <img src={avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>U</div>}
                </div>
              )}
            </div>
          );
        })}
        {isTyping && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: theme.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>G</div>
            <div style={{ padding: '12px 16px', borderRadius: '16px', background: theme.surface, border: `1px solid ${theme.border}`, display: 'flex', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.primary, animation: 'bounce 1.2s infinite ease-in-out' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.primary, animation: 'bounce 1.2s infinite ease-in-out 0.2s' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: theme.primary, animation: 'bounce 1.2s infinite ease-in-out 0.4s' }} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div
        style={{
          padding: '16px 20px',
          borderTop: `1px solid ${theme.border}`,
          display: 'flex',
          gap: '12px',
          background: theme.bg,
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '40px', height: '40px', borderRadius: '50%', border: 'none',
            background: theme.surface, color: theme.text, cursor: 'pointer',
            fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
          title="Прикрепить фото"
        >
          📎
        </button>
        <input type="file" ref={fileInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />

        {pendingImage && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img src={pendingImage} alt="Pending" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
            <button
              onClick={() => setPendingImage(null)}
              style={{ position: 'absolute', top: '-6px', right: '-6px', width: '18px', height: '18px', borderRadius: '50%', border: 'none', background: '#ef4444', color: '#fff', fontSize: '11px', cursor: 'pointer' }}
            >
              ×
            </button>
          </div>
        )}

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Введите сообщение..."
          style={{
            flex: 1, padding: '12px 18px', borderRadius: '24px',
            border: `1px solid ${theme.border}`, background: theme.surface,
            color: theme.text, outline: 'none', fontSize: '14px',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '12px 24px', borderRadius: '24px', border: 'none',
            background: theme.primary, color: '#fff', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          ➡️
        </button>
      </div>
    </div>
  );
};

export default Chat;