import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const db = useSQLiteContext();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const result = await db.getAllAsync(`
        SELECT * FROM products
      `);
      setProducts(result);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (product) => {
    try {

      await db.runAsync(
        `INSERT INTO products 
        (id, name, price, quantity, category, discount, measurementType, subProductCategory) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.name,
          product.price,
          product.quantity,
          product.category,
          product.discount || 0,
          product.measurementType,
          product.subProductCategory,
        ]
      );
      await fetchProducts(); // Refresh products
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const removeProduct = async (id) => {
    try {
      await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  return (
    <ProductContext.Provider value={{ products, addProduct, fetchProducts, removeProduct, }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
