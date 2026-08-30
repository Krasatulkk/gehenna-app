import React, { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

type LoginProps = {
  onLogin: (username: string) => void;
};

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const { settings } = useSettings();
  const theme = settings.theme;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('gehenna-users') || '{}');
    if (isRegister) {
      if (users[username]) {
        setError('Пользователь уже существует');
        return;
      }
      users[username] = { password };
      localStorage.setItem('gehenna-users', JSON.stringify(users));
      localStorage.setItem('gehenna-current-user', username);
      onLogin(username);
    } else {
      if (users[username] && users[username].password === password) {
        localStorage.setItem('gehenna-current-user', username);
        onLogin(username);
      } else {
        setError('Неверное имя пользователя или пароль');
      }
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: theme.bg,
    }}>
      <div style={{
        background: theme.surface,
        padding: '40px',
        borderRadius: '32px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        width: '360px',
        border: `1px solid ${theme.border}`,
      }}>
        <h2 style={{ color: theme.text, marginBottom: '24px', textAlign: 'center' }}>
          {isRegister ? 'Регистрация' : 'Вход'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', color: theme.textSecondary }}>Имя пользователя</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                background: theme.bg,
                color: theme.text,
                fontSize: '14px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '4px', color: theme.textSecondary }}>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '12px',
                border: `1px solid ${theme.border}`,
                background: theme.bg,
                color: theme.text,
                fontSize: '14px',
              }}
              required
            />
          </div>
          {error && <p style={{ color: '#ef4444', fontSize: '14px', marginBottom: '12px' }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '24px',
              border: 'none',
              background: theme.primary,
              color: '#fff',
              fontWeight: 600,
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>
        <button
          onClick={() => setIsRegister(!isRegister)}
          style={{
            background: 'none',
            border: 'none',
            color: theme.textSecondary,
            cursor: 'pointer',
            marginTop: '16px',
            fontSize: '14px',
            textDecoration: 'underline',
          }}
        >
          {isRegister ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
};

export default Login;