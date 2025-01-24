import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const lightColors = {
  background: '#ffffff',    // Pure white
  surface: '#ffffff',      // Pure white
  text: '#000000',        // Pure black
  textSecondary: '#333333', // Dark grey
  border: '#e0e0e0',      // Light grey
  
  // Action Buttons
  importButton: '#2196F3',    // Material Blue
  exportButton: '#2ecc71',    // Green
  deleteButton: '#e74c3c',    // Red
  
  buttonText: '#ffffff',    // White
  shadow: '#000000',       // Black
  success: '#2ecc71',      // Green
  warning: '#f1c40f',      // Yellow
  info: '#2196F3',        // Material Blue
  
  // Table specific colors
  buttonPrimary: '#2196F3',   // Material Blue
  buttonDanger: '#e74c3c',    // Red
  primary: '#1976D2',         // Darker Blue
  secondary: '#42A5F5',       // Lighter Blue
  error: '#e74c3c',          // Red
  tableHeader: '#E3F2FD',     // Very Light Blue
  tableHeaderText: '#1976D2', // Darker Blue
  secondaryContainer: '#f1f3f5',
};

export const darkColors = {
  // Base colors
  background: '#121212',    // Darkest background
  surface: '#1e1e1e',      // Dark surface
  text: '#ffffff',         // Pure white for all text
  textSecondary: '#ffffff', // Pure white for secondary text
  border: '#333333',       // Dark grey for borders
  
  // Form specific colors
  inputBackground: '#2d2d2d',  // Slightly lighter dark for input fields
  inputText: '#ffffff',       // White text in inputs
  inputBorder: '#404040',     // Lighter border for inputs
  inputPlaceholder: '#ffffff', // White placeholder text
  inputLabel: '#ffffff',      // White label text
  
  // Action Buttons with different darkness levels
  importButton: '#1565C0',    // Darker Blue
  exportButton: '#196f3d',    // Darker green
  deleteButton: '#922b21',    // Darker red
  
  // Text colors
  buttonText: '#ffffff',     // White text on buttons
  shadow: '#000000',        // Black shadows
  
  // Status colors with different darkness levels
  success: '#196f3d',       // Darker green
  warning: '#9c4100',       // Darker orange
  info: '#1565C0',         // Darker Blue
  error: '#922b21',        // Darker red
  
  // Table specific colors with hierarchy
  buttonPrimary: '#1565C0',   // Primary action - Darker Blue
  buttonDanger: '#922b21',    // Danger action - Darker red
  primary: '#1565C0',        // Primary elements - Darker Blue
  secondary: '#1976D2',      // Secondary elements - Slightly lighter dark blue
  tableHeader: '#262626',    // Slightly lighter than surface
  tableHeaderText: '#ffffff', // White header text
  tableRow: '#1e1e1e',      // Same as surface
  tableRowAlt: '#262626',    // Slightly lighter for alternating rows
  
  // Form section backgrounds with hierarchy
  formBackground: '#1e1e1e',    // Base form background
  formSectionBg: '#262626',     // Slightly lighter for sections
  formInputBg: '#2d2d2d',       // Even lighter for inputs
  secondaryContainer: '#2c2c2c',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
};

export const typography = {
  small: 12,
  regular: 14,
  medium: 14,
  large: 16,
  xlarge: 18,
};

export const borderRadius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  round: 999,
};

export const elevation = {
  small: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  medium: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  large: {
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
};

const createStyles = (colors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.md,
  },
  categoryContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.importButton,
    color: colors.buttonText,
    height: 30,
    ...elevation.small,
  },
  backButtonText: {
    color: colors.text,
    marginLeft: spacing.sm,
    fontSize: typography.medium,
  },
  searchInput: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },

  commonSearchInput: {
    flex: 1,
    height: 10,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: spacing.xs,
    marginLeft: spacing.sm,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
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
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerTitle: {
    fontSize: typography.xlarge,
    color: colors.text,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    width: '100%',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    ...elevation.small,
  },
  importButton: {
    backgroundColor: colors.importButton,
  },
  exportButton: {
    backgroundColor: colors.exportButton,
  },
  deleteButton: {
    backgroundColor: colors.deleteButton,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: typography.regular,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tableContainer: {
    flex: 0.9,
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: colors.surface,
  },
  noProducts: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xl,
    fontSize: typography.medium,
    letterSpacing: 0.5,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonContainer: {
    minWidth: 50,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
    borderRadius: borderRadius.round,
    backgroundColor: Platform.select({
      ios: colors.surface,
      android: colors.background,
    }),
    ...elevation.small,
    shadowColor: colors.shadow,
  },
  // paginationContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   paddingVertical: spacing.xs,
  //   backgroundColor: colors.surface,
  //   borderTopWidth: 1,
  //   borderTopColor: colors.border,
  // },
  // paginationButton: {
  //   paddingLeft: '10%',
  //   paddingRight: '10%',
  //   paddingVertical: 4,
  //   marginBottom: 2,
  //   borderRadius: 20,
  //   backgroundColor: colors.surface,
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 2,
  //   overflow: 'hidden',
  // },
  // paginationText: {
  //   fontSize: typography.regular,
  //   color: colors.text,
  //   paddingRight: 10,
  //   paddingLeft: 10,
  // },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginVertical: spacing.xs,
    paddingRight: 7,
  },
  clearButton: {
    backgroundColor: colors.importButton,
    borderRadius: 10,
    padding: 12,
  },

  clearButtonText: {
    color: colors.buttonText,
    fontSize: typography.small,
  },
  
  totalProductsContainer: {
    padding: spacing.md,
    marginVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...elevation.small,
},
totalProductsText: {
    fontSize: typography.medium,
    color: colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
},
paginationContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 10,
  marginTop: 10,
  // marginBottom: 60,
  borderTopWidth: 1,
  borderColor: '#ccc',
},
paginationButton: {
  padding: 10,
  backgroundColor: colors.importButton,
  borderRadius: 5,
},
paginationButtonDisabled: {
  backgroundColor: colors.border,
},
paginationText: {
  color: colors.buttonText,
  fontSize: 14,
  fontWeight: 'bold',
},
paginationInfo: {
  fontSize: 14,
  color: colors.text,
},
  // searchInput: {
  //   flex: 1,
  //   height: 40,
  //   borderColor: colors.border,
  //   borderWidth: 1,
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   marginRight: spacing.xs,
  //   marginLeft: spacing.sm,
  // },
  // backButton: {
  //   margin: spacing.sm,
  //   padding: spacing.md,
  //   backgroundColor: '#2196F3',
  //   borderRadius: 5,
  //   alignItems: 'center',
  // },
  // backButtonText: {
  //   color: '#ffffff',
  //   fontWeight: 'bold',
  //   fontSize: typography.medium,
  // },
  // tableContainer: {
  //   margin: spacing.md,
  //   padding: spacing.md,
  //   borderRadius: 5,
  //   backgroundColor: lightColors.surface,
  // },
});

export const getProductsStyles = (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return createStyles(colors);
};

export default getProductsStyles;
