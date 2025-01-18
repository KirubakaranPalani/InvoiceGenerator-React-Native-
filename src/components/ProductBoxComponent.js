import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { lightTheme, darkTheme } from '../styles/theme';

const ProductBoxComponent = ({ product, onEdit, onDelete }) => {
  const { isDarkMode } = useTheme();
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = makeStyles(theme);

  const getImageForCategory = (category) => {
    // Map category to image source
    const categoryImages = {
      Electrical: require('../../assets/logo/SmLogo.png'),
      Plumbing: require('../../assets/logo/SmLogo.png'),
      Tools: require('../../assets/logo/SmLogo.png'),
    };
    return categoryImages[category] || require('../../assets/images/adaptive-icon.png');
  };

  return (
    <View style={styles.box}>
      <Text style={styles.productId}>#{product.id}</Text>
      <Text style={styles.quantity}>{product.quantity}{product.measurementTypeId === 1 ? '(N)': '(Kg)'}</Text>
      <Image source={getImageForCategory(product.category)} style={styles.backgroundImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <View style={styles.boxRow}>
          <View style={styles.priceBox}>
            <Text style={styles.boxContent}>₹{product.price}</Text>
            <Text style={styles.boxTitle}>Price</Text>
          </View>
          <View style={styles.discountBox}>
            <Text style={styles.boxContent}>{product.discount}%</Text>
            <Text style={styles.boxTitle}>Discount</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.editButton} onPress={() => onEdit(product)}>
          <MaterialIcons name="edit" size={20} color={theme.colors.buttonText} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(product.id)}>
          <MaterialIcons name="delete" size={20} color={theme.colors.buttonText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const makeStyles = (theme) => StyleSheet.create({
  box: {
    width: '48%',
    margin: '1%',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape ? theme.shape.borderRadius : 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: 'hidden',
  },
  productId: {
    position: 'absolute',
    top: 10,
    left: 10,
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: theme.typography.small,
    color: theme.colors.text,
    position: 'absolute',
    top: 10,
    right: 10,
    color: theme.colors.text,
    fontSize: theme.typography.small,
    fontWeight: 'bold',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    width: '100%',
    opacity: 0.6,
    resizeMode: 'cover',
  },
  infoContainer: {
    marginTop: '50%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  boxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: theme.spacing.md,
  },
  priceBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape ? theme.shape.borderRadius : 10,
    alignItems: 'center',
    padding: theme.spacing.sm,
    marginRight: theme.spacing.xs,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  discountBox: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.shape ? theme.shape.borderRadius : 500,
    alignItems: 'center',
    padding: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  boxContent: {
    fontSize: theme.typography.medium,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  boxTitle: {
    fontSize: theme.typography.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.medium,
    textAlign: 'center',
    paddingBottom:10,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: theme.spacing.sm,
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.sm,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    padding: theme.spacing.sm,
    borderRadius: 5,
  },
});

export default ProductBoxComponent;
