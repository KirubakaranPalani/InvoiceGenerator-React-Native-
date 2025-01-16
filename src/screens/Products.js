import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, SafeAreaView, ScrollView, Keyboard } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import ProductBoxComponent from '../components/ProductBoxComponent';
import EditModal from '../components/products/EditModal';
import ExportButton from '../components/products/ExportButton';
import ImportButton from '../components/products/ImportButton';
import HeaderComponent from '../components/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import LoadingOverlay from '../components/LoadingOverlay';
import { useToast } from '../context/ToastContext';
import getProductsStyles from '../styles/ProductsStyles';
import { useProductContext } from '../context/ProductContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Products = () => {
  const { isDarkMode } = useTheme();
  const styles = getProductsStyles(isDarkMode);
  const db = useSQLiteContext();
  const { showToast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const productsPerPage = 10;
  const [paginationMargin, setPaginationMargin] = useState(60);
  const { products, fetchProducts } = useProductContext();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setPaginationMargin(0); // Set margin to 0 when keyboard is open
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setPaginationMargin(60); // Restore margin when keyboard is closed
    });

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

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

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const showPagination = filteredProducts.length >= 4;

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
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          theme={{
            colors: {
              text: isDarkMode ? '#ffffff' : '#000000',
              placeholder: isDarkMode ? '#ffffff80' : '#00000080',
              onSurfaceVariant: isDarkMode ? '#ffffff' : '#757575',
              primary: '#2196F3',
              error: isDarkMode ? '#ffffff' : '#FF0000',
              background: isDarkMode ? '#2d2d2d' : '#ffffff',
              surface: isDarkMode ? '#2d2d2d' : '#ffffff',
              onSurface: isDarkMode ? '#ffffff' : '#000000',
            }
          }}
          mode="outlined" // Optional: use outlined style for better visibility
        />
        <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', padding: 5 }]}>
          {currentProducts.map((product) => (
            <ProductBoxComponent
              key={product.id}
              product={product}
              onEdit={(item) => {
                setSelectedProduct(item);
                setIsEditModalVisible(true);
              }}
              onDelete={handleDelete} />
          ))}
        </View>
      </ScrollView>
      {showPagination && (
        <View style={[styles.paginationContainer, { marginBottom: paginationMargin }]}>
          <TouchableOpacity onPress={handlePrevPage} disabled={currentPage === 1}>
            <MaterialIcons name="arrow-back" size={24} color={currentPage === 1 ? styles.disabled : styles.primary} />
          </TouchableOpacity>
          <Text style={styles.paginationText}>{`Page ${currentPage} of ${Math.ceil(filteredProducts.length / productsPerPage)} (Total: ${filteredProducts.length})`}</Text>
          <TouchableOpacity onPress={handleNextPage} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}>
            <MaterialIcons name="arrow-forward" size={24} color={currentPage === Math.ceil(filteredProducts.length / productsPerPage) ? styles.disabled : styles.primary} />
          </TouchableOpacity>
        </View>
      )}
      {isEditModalVisible && (
        <EditModal
          product={selectedProduct}
          onClose={() => setIsEditModalVisible(false)}
          onSave={saveEditedProduct}
        />
      )}
      {loading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

export default Products;
