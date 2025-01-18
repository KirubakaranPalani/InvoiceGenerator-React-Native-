import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { spacing, typography, borderRadius, elevation, lightColors, darkColors } from '../../styles/ProductsStyles';

const MinimizedCheckoutSummary = ({
    length,
    isDarkMode,
}) => {
    const styles = getSummaryStyles(isDarkMode);
    return (
        <View style={styles.summary}>
            <View style={styles.summaryContent}
            >
                <View style={styles.summaryLeft}>
                    <Text style={styles.summaryText}>Products: <Text style={styles.summaryBoldText}>{totalProducts}</Text></Text>
                </View>
            </View>
        </View>
    );
};
const createStyles = (colors) => StyleSheet.create({
    summary: {
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
        marginBottom: 0,
    },
    summaryContent: {
        flexDirection: 'row',
    },
    summaryBoldText: {
        flex: 1,
        fontWeight: 'bold',
        fontSize: typography.medium
    },
    summaryLeft: {
        flex: 0.9,
    },
    summaryCenter: {
        flex: 0.9,
    },
    summaryRight: {
        flex: 1.46,
    },
    summaryText: {
        fontSize: typography.regular,
        color: colors.text,
        marginBottom: spacing.xs,
    },
})
const getSummaryStyles = (isDarkMode) => {
    const colors = isDarkMode ? darkColors : lightColors;
    return createStyles(colors);
};

export default MinimizedCheckoutSummary;
