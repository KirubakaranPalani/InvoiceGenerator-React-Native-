import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

const MobileTableComponent = ({ data, onEdit, onDelete, showEditButton = true }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = makeStyles(theme, showEditButton);

  const formatPrice = (price) => `₹${parseFloat(price).toFixed(2)}`;

  // Render Header part
  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={[styles.headerCell, styles.serialCell]}>#</Text>
      <Text style={[styles.headerCell, styles.productCell]}>Product Info</Text>
      <Text style={[styles.headerCell, styles.qtyCell]}>Qty</Text>
      <Text style={[styles.headerCell, styles.discountCell]}>Disc</Text>
      <Text style={[styles.headerCell, styles.priceCell]}>Price</Text>
      {!showEditButton && <Text style={[styles.headerCell, styles.categoryCell]}>Category</Text>}
      <Text style={[styles.headerCell, styles.actionCell]}>Actions</Text>
    </View>
  );

  // Render rows
  const renderRow = ({ item, index }) => (
    <View
      key={item.id.toString()}
      style={[
        styles.row,
        {
          backgroundColor: item.measurementType === 'Kilogram'
            ? theme.colors.secondaryContainer
            : theme.colors.surface,
        },
      ]}
    >
      <Text style={[styles.cell, styles.serialCell]}>{item.serialNumber || index + 1}</Text>
      <View style={[styles.cell, styles.productCell]}>
        <Text style={styles.productId} numberOfLines={2}>{item.id}</Text>
        <Text style={styles.productName} numberOfLines={4}>{item.name}</Text>
      </View>
      <Text style={[styles.cell, styles.qtyCell]}>
        {item.quantity} {item.measurementType === 'Kilogram' ? 'Kg' : 'N'}
      </Text>
      <Text style={[styles.cell, styles.discountCell]}>{item.discount || 0}%</Text>
      <Text style={[styles.cell, styles.priceCell]}>{formatPrice(item.price)}</Text>
      {!showEditButton && (
        <Text style={[styles.cell, styles.categoryCell]} numberOfLines={1}>
          {item.category}
        </Text>
      )}
      <View style={[styles.cell, styles.actionCell]}>
        {showEditButton && (
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => onEdit(item)}
          >
            <MaterialIcons name="edit" size={16} color={theme.colors.buttonText} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() => onDelete(item.id, item.name)}
        >
          <MaterialIcons name="delete" size={16} color={theme.colors.buttonText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderHeader()}
      <FlatList
        data={data}
        renderItem={renderRow}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const makeStyles = (theme, showEditButton) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerCell: {
    color: theme.colors.tableHeaderText,
    fontSize: theme.typography.small,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cell: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  serialCell: {
    flex: 1,
  },
  productCell: {
    flex: 3,
  },
  productId: {
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  productName: {
    fontSize: theme.typography.regular,
    color: theme.colors.text,
    fontWeight: '500',
  },
  qtyCell: {
    width: '10%',
  },
  discountCell: {
    width: '10%',
  },
  priceCell: {
    width: '15%',
  },
  categoryCell: {
    width: showEditButton ? 1 : 0,
  },
  actionCell: {
    width: 1.5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  button: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  deleteButton: {
    backgroundColor: theme.colors.buttonDanger,
  },
});

export default MobileTableComponent;
