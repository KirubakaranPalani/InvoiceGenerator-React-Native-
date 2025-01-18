import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

const MobileTableComponent = ({ data, onEdit, onDelete, showEditButton = true }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const formatPrice = (price) => `₹${parseFloat(price).toFixed(2)}`;

  const styles = makeStyles(theme);

  const renderItem = ({ item, index }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.serialCell]}>{index + 1}</Text>
      <View style={[styles.cell, styles.productCell]}>
        <Text style={styles.productId} numberOfLines={1}>{item.id}</Text>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      </View>
      {item.measurementType === 'gram' ? (
        <Text style={[styles.cell, styles.qtyCell]}>{item.quantity} Kg</Text>) :
        (
          <Text style={[styles.cell, styles.qtyCell]}>{item.quantity} N</Text>
        )
      }
      <Text style={[styles.cell, styles.discountCell]}>{item.discount || 0}%</Text>
      <Text style={[styles.cell, styles.priceCell]}>{formatPrice(item.price)}</Text>
      <Text style={[styles.cell, styles.categoryCell]} numberOfLines={1}>{item.category}</Text>
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
          onPress={() => onDelete(item.id)}
        >
          <MaterialIcons name="delete" size={16} color={theme.colors.buttonText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerCell, styles.serialCell]}>#</Text>
        <Text style={[styles.headerCell, styles.productCell]}>Product Info</Text>
        <Text style={[styles.headerCell, styles.qtyCell]}>Qty</Text>
        <Text style={[styles.headerCell, styles.discountCell]}>Disc</Text>
        <Text style={[styles.headerCell, styles.priceCell]}>Price</Text>
        <Text style={[styles.headerCell, styles.categoryCell]}>Category</Text>
        <Text style={[styles.headerCell, styles.actionCell]}>Actions</Text>
      </View>
      <ScrollView contentContainerStyle={styles.listContent}>
        {data.map((item, index) => (
          <View key={item.id.toString()}>
            {renderItem({ item, index })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.tableHeader,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  headerCell: {
    color: theme.colors.tableHeaderText,
    fontSize: theme.typography.small,
    fontWeight: '600',
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  cell: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xs,
  },
  serialCell: {
    width: '10%',
  },
  productCell: {
    width: '20%',
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
    width: '20%',
  },
  actionCell: {
    width: '15%',
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
