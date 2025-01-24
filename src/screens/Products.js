import React, { useState, useEffect, useMemo } from 'react';
import { SafeAreaView, BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSQLiteContext } from 'expo-sqlite';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useProductContext } from '../context/ProductContext';
import getProductsStyles from '../styles/ProductsStyles';
import EditModal from '../components/products/EditModal';
import HeaderComponent from '../common/HeaderComponent';
import LoadingOverlay from '../common/LoadingOverlay';
import ProductsContent from '../components/products/ProductsContent';

const Products = () => {
  const { isDarkMode } = useTheme();
  const styles = getProductsStyles(isDarkMode);
  const db = useSQLiteContext();
  const { showToast } = useToast();
  const { products, fetchProducts } = useProductContext();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (selectedCategory) {
          setSelectedCategory(null);
          return true; // Prevent default back action
        }
        return false; // Allow default back action
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [selectedCategory])
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchProducts();
    }, [])
  );

  const handleProductEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalVisible(true);
  };

  const saveEditedProduct = async (product) => {
    setLoading(true);
    try {
      // Update product details including `id` and `measurementTypeId`
      await db.runAsync(
        `UPDATE products 
         SET name = ?, price = ?, quantity = ?, discount = ?, category = ?, subProductCategory = ?, measurementType = ? 
         WHERE id = ?`,
        [
          product.name,
          product.price,
          product.quantity,
          product.discount,
          product.category,
          product.subProductCategory,
          product.measurementType,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent title={
        selectedSubCategory
          ? `Products in ${selectedSubCategory} (${selectedCategory})`
          : selectedCategory
            ? `Products in ${selectedCategory}`
            : "Product Categories"
      } />
      <ProductsContent
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
        handleProductEdit={handleProductEdit}
        products={products}
        fetchProducts={fetchProducts}
        setLoading={setLoading}
      />
      {/* {renderContent()} */}
      {isEditModalVisible && (
        <EditModal
          visible={isEditModalVisible}
          product={selectedProduct}
          onClose={() => {
            setIsEditModalVisible(false);
            setSelectedProduct(null);
          }}
          onSave={saveEditedProduct}
        />
      )}
      {loading && <LoadingOverlay />}
    </SafeAreaView>
  );
};

export default Products;
