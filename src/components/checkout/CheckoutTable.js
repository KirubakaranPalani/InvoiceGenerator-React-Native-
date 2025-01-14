import React from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

const CheckoutTable = ({
  checkoutItems,
  handleItemChange,
  handleDeleteItem,
  styles
}) => {
  const { isDarkMode } = useTheme();

  return (
    <View style={styles.tableContainer}>
      {/* Table Header */}
      <View style={[styles.tableRow, styles.tableHeader, { zIndex: 1 }]}>
        <Text style={[styles.tableCell, styles.cellBase, styles.serialCell]} numberOfLines={1}>
          #
        </Text>
        <Text style={[styles.tableCell, styles.cellBase, styles.productCell]}>Product Info</Text>
        <Text style={[styles.tableCell, styles.cellBase, styles.qtyCell]} numberOfLines={1}>
          Qty
        </Text>
        <Text style={[styles.tableCell, styles.cellBase, styles.priceCell]} numberOfLines={1}>
          Price ₹
        </Text>
        <Text style={[styles.tableCell, styles.cellBase, styles.discountCell]} numberOfLines={1}>
          Disc
        </Text>
        <Text style={[styles.tableCell, styles.cellBase, styles.totalCell]} numberOfLines={1}>
          Total
        </Text>
        <View style={[styles.cellBase, styles.actionCell, styles.headerIcon]}>
          <MaterialIcons
            name="delete-outline"
            size={20}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </View>
      </View>
      <FlatList
        data={checkoutItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.cellBase, styles.serialCell]} numberOfLines={1}>
              {index + 1}
            </Text>
            <View style={[styles.cellBase, styles.productCell, styles.productInfo]}>
              <Text style={styles.productId}>#{item.id}</Text>
              <Text style={styles.productName} numberOfLines={1}>
                {item.name}
              </Text>
            </View>
            { item.measurementType === 'gram' && (
            <TextInput
              style={[styles.inputBase, styles.qtyCell, styles.numericCell]}
              value={`${String(item.quantity)}g`}
              keyboardType="numeric"
              onChangeText={(value) => handleItemChange(index, 'quantity', value)}
              numberOfLines={2}
              multiline={true}
            />
            )
        }
        { item.measurementType === 'unit' && (
            <TextInput
              style={[styles.inputBase, styles.qtyCell, styles.numericCell]}
              value={String(item.quantity)}
              keyboardType="numeric"
              onChangeText={(value) => handleItemChange(index, 'quantity', value)}
              numberOfLines={2}
              multiline={true}
            />
            )
        }
            <TextInput
              style={[styles.inputBase, styles.priceCell, styles.numericCell]}
              value={String(item.price)}
              keyboardType="numeric"
              onChangeText={(value) => handleItemChange(index, 'price', value)}
              numberOfLines={2}
              multiline={true}
            />
            <TextInput
              style={[styles.inputBase, styles.discountCell, styles.numericCell]}
              value={String(item.discount)}
              keyboardType="numeric"
              onChangeText={(value) => handleItemChange(index, 'discount', value)}
              numberOfLines={2}
              multiline={true}
            />
            <Text
              style={[
                styles.tableCell,
                styles.cellBase,
                styles.totalCell,
                styles.numericCell,
              ]}
              numberOfLines={2}
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
        )}
      />
    </View>
  );
};

export default CheckoutTable;
