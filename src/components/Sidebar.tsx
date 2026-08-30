import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useSettings } from '../contexts/SettingsContext';

const Sidebar: React.FC = () => {
  const { settings } = useSettings();
  const { theme, panelOpacity, animationsEnabled } = settings;
  const { chats, currentChatId, createChat, deleteChat, switchChat, renameChat, togglePinChat } = useChat();
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [newChatAnimation, setNewChatAnimation] = useState<string | null>(null);
  const [compactMode, setCompactMode] = useState(() => {
    return localStorage.getItem('gehenna-compact-mode') === 'true';
  });
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('gehenna-compact-mode', String(compactMode));
  }, [compactMode]);

  useEffect(() => {
    if (editingChatId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingChatId]);

  const handleDoubleClick = (chatId: string, currentName: string) => {
    setEditingChatId(chatId);
    setEditName(currentName);
  };

  const handleRename = (chatId: string) => {
    if (editName.trim()) {
      renameChat(chatId, editName.trim());
    }
    setEditingChatId(null);
  };

  const handleCreateChat = () => {
    const newId = createChat();
    setNewChatAnimation(newId);
    setTimeout(() => setNewChatAnimation(null), 400);
  };

  const navItems = [
    { path: '/', label: '💬 Чат', icon: '💬' },
    { path: '/image', label: '🎨 Генерация', icon: '🎨' },
    { path: '/assistants', label: '🤖 Помощники', icon: '🤖' },
    { path: '/profile', label: '👤 Профиль', icon: '👤' },
    { path: '/settings', label: '⚙️ Настройки', icon: '⚙️' },
  ];

  const isActive = (path: string) => {
    return window.location.hash === `#${path}` || (path === '/' && window.location.hash === '#');
  };

  const pinnedChats = chats.filter((c) => c.pinned);
  const unpinnedChats = chats.filter((c) => !c.pinned);

  return (
    <div
      style={{
        width: compactMode ? '60px' : 'var(--sidebar-width)',
        height: '100vh',
        background: `rgba(${theme.surface.replace('#', '')}, ${panelOpacity})`,
        backdropFilter: 'blur(12px)',
        borderRight: `1px solid ${theme.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 0',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        transition: animationsEnabled ? 'width 0.3s ease' : 'none',
        boxShadow: '0 0 30px rgba(0,0,0,0.05)',
      }}
      onMouseEnter={() => compactMode && setCompactMode(false)}
      onMouseLeave={() => {
        if (compactMode) setCompactMode(true);
      }}
    >
      <div style={{ padding: '0 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!compactMode && (
          <span style={{ fontSize: '24px', fontWeight: 700, color: theme.primary }}>GEHENNA</span>
        )}
        <button
          onClick={() => setCompactMode(!compactMode)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textSecondary,
            cursor: 'pointer',
            fontSize: '18px',
          }}
        >
          {compactMode ? '☰' : '◀'}
        </button>
      </div>

      {/* Список чатов */}
      <div style={{ padding: '0 12px', marginBottom: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px',
            padding: '0 8px',
          }}
        >
          {!compactMode && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: theme.textSecondary, textTransform: 'uppercase' }}>
              Чаты
            </span>
          )}
          <button
            onClick={handleCreateChat}
            style={{
              background: 'none',
              border: 'none',
              color: theme.primary,
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0 4px',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotate(90deg)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotate(0deg)')}
          >
            +
          </button>
        </div>

        {/* Закреплённые */}
        {!compactMode && pinnedChats.length > 0 && (
          <>
            <div style={{ fontSize: '11px', color: theme.textSecondary, padding: '4px 8px', marginTop: '4px' }}>📌 Закреплённые</div>
            {pinnedChats.map((chat) => renderChatItem(chat))}
          </>
        )}

        {/* Остальные чаты */}
        {unpinnedChats.map((chat) => renderChatItem(chat))}
      </div>

      {/* Навигация (только иконки в компактном режиме) */}
      <div style={{ flex: 1 }}>
        {navItems.map((item) => (
          <a
            key={item.path}
            href={`#${item.path}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 20px',
              color: isActive(item.path) ? theme.primary : theme.textSecondary,
              background: isActive(item.path) ? `${theme.primary}15` : 'transparent',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: isActive(item.path) ? 600 : 400,
              borderRight: isActive(item.path) ? `3px solid ${theme.primary}` : 'none',
              transition: 'all 0.25s ease',
              cursor: 'pointer',
              borderRadius: '0 8px 8px 0',
            }}
          >
            <span style={{ fontSize: '20px' }}>{item.icon}</span>
            {!compactMode && item.label}
          </a>
        ))}
      </div>
    </div>
  );

  function renderChatItem(chat: Chat) {
    const isCurrent = currentChatId === chat.id;
    return (
      <div
        key={chat.id}
        onMouseEnter={() => setHoveredChat(chat.id)}
        onMouseLeave={() => setHoveredChat(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 10px',
          borderRadius: '8px',
          marginBottom: '4px',
          cursor: 'pointer',
          background: isCurrent ? `${theme.primary}20` : 'transparent',
          transition: animationsEnabled ? 'all 0.15s' : 'none',
          transform: newChatAnimation === chat.id ? 'translateX(0)' : 'translateX(0)',
          animation: newChatAnimation === chat.id ? 'slideIn 0.3s ease' : 'none',
        }}
        onClick={() => switchChat(chat.id)}
        onDoubleClick={() => handleDoubleClick(chat.id, chat.name)}
      >
        {editingChatId === chat.id ? (
          <input
            ref={inputRef}
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={() => handleRename(chat.id)}
            onKeyDown={(e) => e.key === 'Enter' && handleRename(chat.id)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              borderBottom: `1px solid ${theme.primary}`,
              color: theme.text,
              outline: 'none',
              fontSize: '14px',
              padding: '2px 0',
            }}
          />
        ) : (
          <>
            {!compactMode && (
              <span
                style={{
                  fontSize: '14px',
                  color: isCurrent ? theme.primary : theme.textSecondary,
                  fontWeight: isCurrent ? 600 : 400,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: compactMode ? '20px' : '100px',
                }}
              >
                {chat.pinned && '📌 '}{chat.name}
              </span>
            )}
            {compactMode && (chat.pinned ? '📌' : '💬')}
          </>
        )}
        {hoveredChat === chat.id && editingChatId !== chat.id && !compactMode && (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); togglePinChat(chat.id); }}
              style={{ background: 'none', border: 'none', color: theme.primary, cursor: 'pointer', fontSize: '14px' }}
            >
              {chat.pinned ? '📌' : '📌'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Удалить этот чат?')) deleteChat(chat.id);
              }}
              style={{ background: 'none', border: 'none', color: theme.textSecondary, cursor: 'pointer', fontSize: '14px', padding: '0 4px' }}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    );
  }
};

export default Sidebar;