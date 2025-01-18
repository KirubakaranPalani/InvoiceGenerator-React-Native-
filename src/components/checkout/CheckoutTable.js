import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { spacing, typography, borderRadius, elevation, lightColors, darkColors } from '../../styles/ProductsStyles';

import { lightTheme, darkTheme } from '../../styles/theme';

const CheckoutTable = ({
  checkoutItems,
  handleItemChange,
  handleDeleteItem,
  styles
}) => {
  const { isDarkMode } = useTheme();

  const colors = isDarkMode ? darkColors : lightColors;
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ScrollView>
      {checkoutItems.map((item, index) => (
        <View key={item.id.toString()} style={[styles.tableRow, {backgroundColor: item.measurementTypeId === 1 ? colors.surface : theme.colors.secondaryContainer}]}>
          <Text style={[styles.tableCell, styles.cellBase, styles.serialCell]} numberOfLines={1}>
            {index + 1}
          </Text>
          <View style={[styles.cellBase, styles.productCell, styles.productInfo]}>
            <Text style={styles.productId}>#{item.id}</Text>
            <Text style={styles.productName} numberOfLines={5}>
              {item.name}
            </Text>
          </View>
          <TextInput
            style={[styles.inputBase, styles.qtyCell, styles.numericCell]}
            value={String(item.quantity)}
            keyboardType="numeric"
            onChangeText={(value) => handleItemChange(index, 'quantity', value)}
            numberOfLines={2}
            multiline={true}
          />
          <TextInput
            style={[styles.inputBase, styles.priceCell, styles.numericCell]}
            value={String(item.price)}
            keyboardType="numeric"
            onChangeText={(value) => handleItemChange(index, 'price', value)}
            numberOfLines={3}
            multiline={true}
          />
          <TextInput
            style={[styles.inputBase, styles.discountCell, styles.numericCell]}
            value={String(item.discount)}
            keyboardType="numeric"
            onChangeText={(value) => {
              const numericValue = parseInt(value, 10);
              if (!isNaN(numericValue)) {
                const clampedValue = Math.max(0, Math.min(100, numericValue));
                handleItemChange(index, 'discount', clampedValue);
              } else if (value === '') {
                handleItemChange(index, 'discount', '');
              }
            }}
            numberOfLines={1}
            multiline={true}
          />
          <Text
            style={[
              styles.tableCell,
              styles.cellBase,
              styles.totalCell,
              styles.numericCell,
            ]}
            numberOfLines={4}
          >
            ₹{item.totalPrice.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[styles.cellBase, styles.actionCell]}
            onPress={() => handleDeleteItem(index)}
          >
            <MaterialIcons
              name="delete"
              size={20}
              color={isDarkMode ? '#ff4d4d' : '#e74c3c'}
            />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default CheckoutTable;
