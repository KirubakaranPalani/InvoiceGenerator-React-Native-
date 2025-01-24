import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { lightColors, darkColors, spacing, typography } from '../../styles/ProductsStyles';

const CategoryBoxComponent = ({ category, count, countLabel, onPress }) => {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? darkColors : lightColors;

  return (
    <TouchableOpacity style={[styles.box, { backgroundColor: colors.surface, shadowColor: isDarkMode ? '#ffffff' : '#000' }]} onPress={onPress}>
      <Text style={[styles.text, { color: colors.text }]}>{category}</Text>
      <Text style={[styles.count, { color: colors.textSecondary }]}>
      {count} {count === 1 ? countLabel.singular : countLabel.plural}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    width: 170,
    height: 120,
    margin: '1%',
    padding: spacing.md,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 7,
  },
  text: {
    fontSize: typography.large,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  count: {
    fontSize: typography.regular,
    fontWeight: '600',
  },
});

export default CategoryBoxComponent;
