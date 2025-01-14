
import { StyleSheet, Platform } from 'react-native';
import { spacing, borderRadius, elevation, lightColors, darkColors } from './ProductsStyles';


const createStyles = (colors) => StyleSheet.create({
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
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 8,
        margin: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
const getToggleButtonStyles = (isDarkMode) => {
    const colors = isDarkMode ? darkColors : lightColors;
    return createStyles(colors);
};

export default getToggleButtonStyles;
