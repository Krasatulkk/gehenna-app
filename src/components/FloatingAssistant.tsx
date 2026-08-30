import React, { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { assistants } from '../data/assistants';

type FloatingAssistantProps = {
  assistantId: string | null;
  onClose: () => void;
};

const FloatingAssistant: React.FC<FloatingAssistantProps> = ({ assistantId, onClose }) => {
  const { settings } = useSettings();
  const theme = settings.theme;
  const [position, setPosition] = useState({ x: window.innerWidth - 120, y: window.innerHeight - 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [state, setState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const assistant = assistants.find(a => a.id === assistantId);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: Math.max(0, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x)),
      y: Math.max(0, Math.min(window.innerHeight - 80, e.clientY - dragOffset.y)),
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  if (!assistantId || !assistant) return null;

  const imageSrc = assistant.images[state] || assistant.images.idle;

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        border: `2px solid ${theme.primary}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 9999,
        transition: isDragging ? 'none' : 'box-shadow 0.2s',
        background: theme.surface,
      }}
      onMouseDown={handleMouseDown}
    >
      <img src={imageSrc} alt={assistant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        style={{
          position: 'absolute',
          top: '-6px',
          right: '-6px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: 'none',
          background: '#ef4444',
          color: '#fff',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ×
      </button>
    </div>
  );
};

export default FloatingAssistant;