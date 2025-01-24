import React from 'react';
import { View,TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import getToggleButtonStyles from '../styles/ThemeToggleButton';


const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const styles = getToggleButtonStyles(isDarkMode);


  return (
    <View style={styles.themeButtonContainer}>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff' }
        ]}
        onPress={toggleTheme}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={isDarkMode ? 'wb-sunny' : 'nightlight-round'}
          size={24}
          color={isDarkMode ? '#ffffff' : '#2c3e50'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ThemeToggleButton;
