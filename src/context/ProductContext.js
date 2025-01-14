import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSQLiteContext } from 'expo-sqlite';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const db = useSQLiteContext();
  const [products, setProducts] = useState([]);
  const [measurementTypes, setMeasurementTypes] = useState([]);

  const fetchProducts = async () => {
    try {
      const result = await db.getAllAsync(`
        SELECT products.*, measurement_types.name AS measurementType 
        FROM products 
        LEFT JOIN measurement_types ON products.measurementTypeId = measurement_types.id
      `);
      setProducts(result);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (product) => {
    try {
      // Set measurementTypeId to 1 (unit) if not provided
      const measurementTypeId = product.measurementTypeId || 1;

      await db.runAsync(
        `INSERT INTO products 
        (id, name, price, quantity, category, discount, measurementTypeId) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          product.id,
          product.name,
          product.price,
          product.quantity,
          product.category,
          product.discount || 0,
          measurementTypeId,
        ]
      );
      await fetchProducts(); // Refresh products
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const fetchMeasurementTypes = async (db) => {
    const results = await db.getAllAsync('SELECT * FROM measurement_types');
    return results;
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
    (async () => {
      const types = await fetchMeasurementTypes(db);
      setMeasurementTypes(types);
      await fetchProducts();
    })();
  }, []);

  return (
    <ProductContext.Provider value={{ products, measurementTypes, addProduct, fetchProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
