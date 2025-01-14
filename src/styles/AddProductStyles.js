import { StyleSheet, Platform, Dimensions } from 'react-native';
import { spacing, typography, borderRadius, elevation, lightColors, darkColors } from './ProductsStyles';

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  formSection: {
    flex: 1,
    // marginTop: 340,
    // marginBottom: spacing.md,
    width: '100%',
    maxHeight:'42%',
    flexBasis:0.1,
    // height: Platform.OS === 'ios' ? '42%' : '54%',
  },
  formContainer: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    ...elevation.medium,
    width: '100%',
    height: '100%',
  },
  formInner: {
    padding: 10,
    minHeight: '100%',
  },
  formFields: {
    gap: 2,
    flex: 1,
  },
  input: {
    backgroundColor: colors.inputBackground,
    marginBottom: 2,
    height: 42,
    color: colors.text,
  },
  pickerContainer: {
    marginBottom: spacing.xs,
  },
  pickerLabel: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  pickerWrapper: {
    backgroundColor: colors.inputBackground,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    height: 50,
  },
  picker: {
    color: colors.text,
    height: 52,
  },
  pickerError: {
    borderColor: colors.error,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.small,
    marginTop: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  button: {
    flex: 1,
    height: 38,
  },
  tableSection: {
    flex: 0.8,
    flexBasis:0.1,
    marginTop: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tableContainer: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    ...elevation.medium,
    paddingBottom: spacing.sm,
  },
  tableWrapper: {
    minHeight: 180,
    maxHeight: 250,
  },
  sectionTitle: {
    fontSize: typography.medium,
    color: colors.text,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  snackbar: {
    position: 'relative',
    top: -710,
    zIndex:9999,
    margin: spacing.md,
    borderRadius: borderRadius.sm,
  },
  successSnackbar: {
    backgroundColor: colors.success,
  },
  errorSnackbar: {
    backgroundColor: colors.error,
  },
  submitButton: {
    marginHorizontal: spacing.md,
  },
  cameraContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    zIndex: 2000,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    ...elevation.small,
  },
  camera: {
    flex: 1,
  },
  cameraButtonsContainer: {
    position: 'absolute',
    bottom: spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
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

  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  quantityInput: {
    flex: 0.8,
    marginRight: 22,
  },
  radioGroup: {
    flex: 1, // Ensures it has enough space in the row
    flexDirection: 'row', // Align radio buttons horizontally
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensures items align to the left
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5, // Add space between each radio button group
  },
  radioLabel: {
    marginLeft: 4,
    marginRight: 23,
    
  },
});

const getAddProductStyles = (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return createStyles(colors);
};

export default getAddProductStyles;
