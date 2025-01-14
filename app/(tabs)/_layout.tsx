import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';

import React, { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { lightTheme, darkTheme } from '../../src/styles/theme';

export default function TabLayout() {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: theme.colors.primary,
      tabBarInactiveTintColor: theme.colors.textSecondary,
      tabBarStyle: {
        backgroundColor: theme.colors.surface,
        borderTopColor: theme.colors.border,
        paddingBottom: 5,
        height: 60,
        display: keyboardVisible ? 'none' : 'flex',
        position: 'absolute',
      },
      headerShown: false,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Checkout',
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="shoppingcart" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="products"

        options={{
          title: 'Products',
          headerShown: false,
          tabBarIcon: ({ color }) => <Fontisto name="shopping-store" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add-products"
        options={{
          title: 'Add Product',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
