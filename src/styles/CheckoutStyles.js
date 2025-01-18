import { StyleSheet, Platform } from 'react-native';
import { spacing, typography, borderRadius, elevation, lightColors, darkColors } from './ProductsStyles';

const createStyles = (colors, isDarkMode) => StyleSheet.create({
  container: {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
  tableHeader: {
    backgroundColor: isDarkMode ? '#3a3a3a' : '#f0f0f0',
    marginBottom: 3,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    ...elevation.small,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: isDarkMode ? '#444' : '#ccc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1,
    borderRadius: borderRadius.md,
    paddingBlock:5,
    ...elevation.large,
    borderTopColor: colors.border,
  },
  tableCell: {
    color: isDarkMode ? '#fff' : '#000',
    fontSize: typography.regular,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    zIndex: 1,
    flex: 1,
  },
  cellBase: {
    paddingHorizontal: 0,
    padding: 2
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
    flex: 2.8,
  },
  productInfo: {
    alignItems: 'flex-start',
  },
  productId: {
    fontWeight: 'bold',
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
    flex: 1.2,
  },
  discountCell: {
    flex: 0.9,
  },
  totalCell: {
    flex: 1.9,
  },
  actionCell: {
    flex: 0.5,
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



  container: {
    flex: 1,
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#f9f9f9',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  input: {
    marginVertical: 2,
    backgroundColor: isDarkMode ? '#3a3a3a' : '#ffffff',
  },
  headerIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
  },
  snackbar: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  successSnackbar: {
    backgroundColor: '#4CAF50',
  },
  errorSnackbar: {
    backgroundColor: '#F44336',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  tableWrapper: {
    borderRadius: 5,
    overflow: 'hidden',
  },
});

const getCheckoutStyles = (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return createStyles(colors, isDarkMode);
};

export default getCheckoutStyles;