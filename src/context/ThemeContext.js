import React, { createContext, useContext, useState } from 'react';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

const ThemeContext = createContext();

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2196F3',
    onPrimaryContainer: '#2196F3',
    outline: '#2196F3',
    secondaryContainer: 'rgb(237, 221, 246)',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#1976D2',
    onPrimaryContainer: '#1976D2',
    outline: '#1976D2',
    secondaryContainer: 'rgb(77, 67, 87)',
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
