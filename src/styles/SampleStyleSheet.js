import { StyleSheet } from 'react-native';
import { spacing, typography, borderRadius, elevation, lightColors, darkColors } from './ProductsStyles';

const createStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },
  formContainer: {
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    ...elevation.medium,
    width: '100%',
    marginBottom: spacing.md,
  },
//   formInner: {
//     padding: 10,
//     minHeight: '100%',
//   },
//   formFields: {
//     gap: 2,
//     flex: 1,
//   },
  input: {
    // backgroundColor: colors.inputBackground,
    marginBottom: 2,
    height: 42,
    // color: colors.text,
  },
  quantityInput: {
    flex: 0.8,
    marginRight: 22,
  },
  radioGroup: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  radioLabel: {
    marginLeft: 4,
    marginRight: 23,
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
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
  },
  errorText: {
    color: colors.error,
    fontSize: typography.small,
    marginTop: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  tableContainer: {
    marginBottom:60,
  },
  tableTitle: {
    fontSize: typography.medium,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
  snackbar: {
    margin: spacing.md,
    borderRadius: borderRadius.sm,
  },
  successSnackbar: {
    backgroundColor: colors.success,
  },
  errorSnackbar: {
    backgroundColor: colors.error,
  },
  tempMinimize: {
    backgroundColor: colors.surface,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: borderRadius.md,
    paddingBlock: 5,
    ...elevation.large,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
},
tempMinimizeText: {
    textAlign:'center',
    fontSize: typography.medium,
    color: colors.text,
    marginBottom: spacing.xs,
},
tempMinimizeBoldText: {
    flex: 1,
    color: colors.text,
    fontWeight: 'bold',
    fontSize: typography.large
},
});

const SampleStyleSheet = (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return createStyles(colors);
};

export default SampleStyleSheet;
