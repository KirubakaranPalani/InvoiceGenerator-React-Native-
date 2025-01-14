import React, { useState } from 'react';
import { View, Text, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import MobileTableComponent from '../components/MobileTableComponent';
import EditModal from '../components/products/EditModal';
import ExportButton from '../components/products/ExportButton';
import ImportButton from '../components/products/ImportButton';
import HeaderComponent from '../components/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { useToast } from '../context/ToastContext';
import getProductsStyles from '../styles/ProductsStyles';
import { useProductContext } from '../context/ProductContext';


const Products = () => {
  const { isDarkMode } = useTheme();
  const styles = getProductsStyles(isDarkMode);
  const db = useSQLiteContext();
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { products, fetchProducts } = useProductContext();

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );
  const processImportedData = async (data) => {
    try {
      setLoading(true);
  
      // Validate imported data
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('The imported data is invalid or empty.');
      }
  
      const requiredKeys = ['id', 'name', 'price', 'quantity', 'category', 'measurementTypeId'];
      const isValid = data.every((row) =>
        requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(row, key))
      );
  
      if (!isValid) {
        throw new Error('Invalid data format. Ensure the file contains all required fields.');
      }
  
      const validMeasurementTypes = await db.getAllAsync('SELECT id FROM measurement_types');
      const validMeasurementTypeIds = validMeasurementTypes.map((type) => type.id);
  
      const values = data.map((row) => {
        const measurementTypeId = validMeasurementTypeIds.includes(row.measurementTypeId)
          ? row.measurementTypeId
          : 1; // Default to "unit"
        return `(
          '${String(row.id).replace(/'/g, "''")}',
          '${String(row.name).replace(/'/g, "''")}',
          ${Number(row.price) || 0},
          ${Number(row.quantity) || 0},
          '${String(row.category).replace(/'/g, "''")}',
          ${Number(row.discount) || 0},
          ${measurementTypeId}
        )`;
      }).join(',');
  
      const query = `
        INSERT INTO products (id, name, price, quantity, category, discount, measurementTypeId)
        VALUES ${values}
        ON CONFLICT(id) DO UPDATE SET
          name = excluded.name,
          price = excluded.price,
          quantity = excluded.quantity,
          category = excluded.category,
          discount = excluded.discount,
          measurementTypeId = excluded.measurementTypeId
      `;
  
      await db.runAsync(query);
      fetchProducts();
      showToast('All products were successfully added to the database.');
    } catch (error) {
      console.error('Error during import process:', error);
      showToast(error.message || 'An unexpected error occurred during the import process.', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  const saveEditedProduct = async (product) => {
    setLoading(true);
    try {
      // Update product details including `id` and `measurementTypeId`
      await db.runAsync(
        `UPDATE products 
         SET id = ?, name = ?, price = ?, quantity = ?, discount = ?, measurementTypeId = ? 
         WHERE id = ?`,
        [
          product.newId || product.id, // Use a new ID if provided, otherwise retain the current ID
          product.name,
          product.price,
          product.quantity,
          product.discount,
          product.measurementTypeId,
          product.id, // Condition to match the current product ID
        ]
      );
      fetchProducts(); // Refresh the product list
      showToast('Product updated successfully');
    } catch (error) {
      console.error('Failed to save product:', error);
      showToast('Failed to save product', 'error');
    } finally {
      setLoading(false);
      setSelectedProduct(null);
      setIsEditModalVisible(false);
    }
  };
  

  // Delete a product
  const handleDelete = (productId) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM products WHERE id = ?', [productId]);
              fetchProducts();
              showToast('Product removed successfully', 'delete');
            } catch (error) {
              console.error('Failed to delete product:', error);
              showToast('Failed to delete product', 'error');
            }
          },
        },
      ]
    );
  };

  // Delete all products
  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Products',
      'Are you sure you want to delete all products? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            try {
              await db.runAsync('DELETE FROM products');
              fetchProducts();
              showToast('All products removed successfully', 'delete');
            } catch (error) {
              console.error('Failed to delete all products:', error);
              showToast('Failed to delete all products', 'error');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title="Products" />
      <View style={styles.actionsRow}>
        <ImportButton 
          onImport={processImportedData} 
          style={[styles.actionButton, styles.importButton]}
          textStyle={styles.buttonText}
        />
        <ExportButton 
          data={products} 
          style={[styles.actionButton, styles.exportButton]}
          textStyle={styles.buttonText}
        />
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteAll}
        >
          <Text style={styles.buttonText}>Delete All</Text>
        </TouchableOpacity>
      </View>
      
      {loading && <LoadingOverlay />}
      <View style={styles.tableContainer}>
        {products.length === 0 ? (
          <Text style={styles.noProducts}>No products available.</Text>
        ) : (
          <MobileTableComponent
            data={products}
            onEdit={(item) => {
              setSelectedProduct(item);
              setIsEditModalVisible(true);
            }}
            onDelete={handleDelete}
          />
        )}
      </View>
      <EditModal
        visible={isEditModalVisible}
        product={selectedProduct}
        onClose={() => setIsEditModalVisible(false)}
        onSave={saveEditedProduct}
      />
    </SafeAreaView>
  );
};

export default Products;
