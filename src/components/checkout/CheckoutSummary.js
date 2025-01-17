import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { spacing, typography, borderRadius, elevation, lightColors, darkColors } from '../../styles/ProductsStyles';

const CheckoutSummary = ({
  totalProducts, 
  totalQuantity, 
  totalPrice, 
  customerName,
  handleGeneratePDF,
  isDarkMode,
}) => {
  const styles = getSummaryStyles(isDarkMode);
  return (
    <View style={styles.summary}>
      <View style={styles.summaryContent}>
        <View style={styles.summaryLeft}>
          <Text style={styles.summaryText}>Total Products :  <Text style= {styles.summaryBoldText}>{totalProducts}</Text></Text>
          <Text style={styles.summaryText}>Total Quantity  :  <Text style= {styles.summaryBoldText}>{totalQuantity}</Text></Text>
          <Text style={styles.summaryText}>Total Price        :  <Text style= {styles.summaryBoldText}>₹{totalPrice.toFixed(2)}</Text></Text>
        </View>
        <View style={styles.summaryRight}>
        {customerName && <Text style={styles.customerText}>Customer Name</Text>}
        {customerName &&  <Text style={styles.customerInput}>{customerName}</Text>}
        </View>
      </View>
      <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePDF}>
        <Text style={styles.generateButtonText}>Generate Invoice</Text>
      </TouchableOpacity>
    </View>
  );
};
const createStyles = (colors, isDarkMode) => StyleSheet.create({
  summary: {
    backgroundColor: colors.surface,
    paddingLeft:15,
    paddingRight:15,
    borderRadius: borderRadius.md,
    paddingBlock:5,
    ...elevation.large,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginBottom:60,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  summaryBoldText: {
    flex:1,
    fontWeight:'bold',
    fontSize: typography.medium
  },
  summaryLeft: {
    flex: 2,
  },
  summaryRight: {
    flex: 1,
    paddingLeft: spacing.md,
  },
  summaryText: {
    fontSize: typography.regular,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  customerText: {
    fontSize: typography.regular,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign:'center'
  },
  customerInput: {
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    fontSize: typography.medium,
    color: colors.text,
    fontWeight:'bold',
    textAlign:'center'
  },
  generateButton: {
    backgroundColor: '#2196F3',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: typography.regular,
    fontWeight: 'bold',
  },
})
const getSummaryStyles = (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return createStyles(colors, isDarkMode);
};

export default CheckoutSummary;
