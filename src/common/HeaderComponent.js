import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import ThemeToggleButton from './ThemeToggleButton';
import { useTheme } from '../context/ThemeContext';
import { spacing, typography, elevation, lightColors, darkColors } from '../styles/ProductsStyles';

const HeaderComponent = ({ title }) => {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? darkColors : lightColors;
  const styles = createStyles(colors);

  return (
    <View style={styles.headerContainer}>
      <View style={styles.titleRow}>
        <Text style={styles.headerTitle}>{title}</Text>
        <ThemeToggleButton />
      </View>
    </View>
  );
};

const createStyles = (colors) => StyleSheet.create({
  headerContainer: {
    backgroundColor: colors.formBackground,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...elevation.small,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xlarge,
    color: colors.text,
    fontWeight: 'bold',
  },
});

export default HeaderComponent;
