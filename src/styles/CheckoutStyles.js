import { StyleSheet, Platform } from 'react-native';
import { spacing, typography, borderRadius, elevation, lightColors, darkColors } from './ProductsStyles';

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    backgroundColor: colors.background,
  },
  headerContainer: {
    backgroundColor: colors.surface,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...elevation.small,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.xlarge,
    color: colors.text,
    fontWeight: 'bold',
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  searchSection: {
    marginBottom: spacing.xs,
  },
  searchInput: {
    borderRadius: borderRadius.md,
    backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
    color: isDarkMode ? '#fff' : '#000',
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tableContainer: {
    // if i commented flex and changed position to static, i can able to click input box
    flex: 1,
    marginTop: spacing.xs,
    backgroundColor: colors.background,
    maxHeight:400,
    // position: 'static',
    // zIndex: 1,
  },
  tableHeader: {
    backgroundColor: isDarkMode ? '#555' : '#f0f0f0',
    paddingVertical: 10,
    marginBottom: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    ...elevation.small,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDarkMode ? '#444' : '#fff',
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1,  
    ...elevation.small,
  },
  tableCell: {
    color: isDarkMode ? '#fff' : '#000',
    fontSize: typography.regular,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  cellBase: {
    paddingHorizontal: 1,
  },
  numericCell: {
    textAlign: 'center',
    minHeight: 40,
    justifyContent: 'center',
    backgroundColor: isDarkMode ? '#555' : '#f5f5f5',
    borderRadius: 4,
    marginHorizontal: 2,
  },
  serialCell: {
    flex: 0.5,
  },
  productCell: {
    flex: 2.5,
  },
  productInfo: {
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  productId: {
    fontSize: typography.small,
    color: isDarkMode ? '#ffffff80' : '#00000080',
    marginBottom: 2,
  },
  productName: {
    fontSize: typography.regular,
    color: isDarkMode ? '#fff' : '#000',
  },
  qtyCell: {
    flex: 0.8,
  },
  priceCell: {
    flex: 1,
  },
  discountCell: {
    flex: 0.6,
  },
  totalCell: {
    flex: 1.4,
  },
  actionCell: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBase: {
    backgroundColor: isDarkMode ? '#555' : '#f5f5f5',
    color: isDarkMode ? '#fff' : '#000',
    borderRadius: 4,
    paddingVertical: 4,
    marginHorizontal: 2,
    fontSize: typography.regular,
    textAlign: 'center',
    minHeight: 40,
  },

  // CustomerName input box
  textBox: {
    // flex:1,
    // maxHeight:60,
    marginLeft:'25%',
    marginRight:'25%',
    
    // alignContent:'center',
  },
  input: {
    height: 40,
    // borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    fontSize: 16,
  },
});

const getCheckoutStyles = (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return createStyles(colors, isDarkMode);
};

export default getCheckoutStyles;