import React from 'react';
import { useSettings } from '../contexts/SettingsContext';

const Spinner: React.FC<{ size?: number }> = ({ size = 40 }) => {
  const { settings } = useSettings();
  const { theme } = settings;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `4px solid ${theme.surface}`,
        borderTop: `4px solid ${theme.primary}`,
        animation: 'spin 1s linear infinite',
      }}
    />
  );
};

export default Spinner;