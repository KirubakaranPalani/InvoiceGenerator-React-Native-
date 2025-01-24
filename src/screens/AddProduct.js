import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Keyboard, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';
import MobileTableComponent from '../common/MobileTableComponent';
import HeaderComponent from '../common/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import getAddProductStyles from '../styles/AddProductStyles';
import { useProductContext } from '../context/ProductContext';
import { useToast } from '../context/ToastContext';

const AddProduct = () => {
  const { isDarkMode } = useTheme();
  const { showToast } = useToast();
  const { addProduct } = useProductContext();
  const db = useSQLiteContext();
  const styles = getAddProductStyles(isDarkMode);

  // State Management
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    price: '',
    quantity: '',
    discount: '',
    category: 1,
    measurementTypeId: 1,
    subProductCategory: '',
  });
  const [temporaryProducts, setTemporaryProducts] = useState([]);
  const [errors, setErrors] = useState({});

  // Input Change Handler
  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
    if (errors[field]) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));
    }
  };

  // Form Validation
  const validateForm = () => {
    const newErrors = {};
    const { id, name, price, quantity, subProductCategory } = formData;

    if (!id) newErrors.id = 'Product ID is required';
    if (!name) newErrors.name = 'Product name is required';
    if (!price || isNaN(price) || parseFloat(price) < 0) newErrors.price = 'Invalid price';
    if (!quantity || isNaN(quantity) || parseInt(quantity) < 0) newErrors.quantity = 'Invalid quantity';
    if (!subProductCategory) newErrors.subProductCategory = 'Sub-Product Category is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add Temporary Product
  const handleAddTemporaryProduct = async () => {
    if (!validateForm()) {
      showToast('Please fill all required fields correctly', 'error');
      return;
    }

    try {
      if (temporaryProducts.some((product) => product.id === formData.id)) {
        setErrors({ id: 'Product with this ID already exists in the list' });
        showToast('Product with this ID already exists in the list', 'error');
        return;
      }

      const existingProduct = await db.getFirstAsync('SELECT * FROM products WHERE id = ?', [formData.id]);
      if (existingProduct) {
        setErrors({ id: 'Product with this ID already exists in the database' });
        showToast('Product with this ID already exists in the database', 'error');
        return;
      }

      setTemporaryProducts((prevProducts) => [
        ...prevProducts,
        {
          ...formData,
          price: parseFloat(formData.price),
          quantity: parseInt(formData.quantity),
          discount: parseFloat(formData.discount) || 0,
          measurementType: formData.measurementTypeId === 1 ? 'Unit' : 'Kilogram',
          category: formData.category === 1
            ? 'Electricals'
            : formData.category === 2
              ? 'Plumbing'
              : 'Others',

        },
      ]);
      setFormData({ ...formData, category: 1, measurementTypeId: 1 });
      showToast('Product added to temporary list', 'success');
    } catch (error) {
      showToast('Failed to validate product', 'error');
    }
  };

  //Remove Temporary Product
  const handleRemoveTemporaryProduct = (id) => {
    setTemporaryProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
    showToast('Product removed successfully', 'delete');
  };

  // Add All Products
  const handleAddAllProducts = async () => {
    try {
      console.log(temporaryProducts);
      for (const product of temporaryProducts) {
        await addProduct(product);
      }
      showToast('All products added successfully', 'success');
      setTemporaryProducts([]);
    } catch (error) {
      console.error('Error adding products:', error);
      showToast('Failed to save products', 'error');
    }
  };

  // Clear Form
  const handleClearForm = () => {
    setFormData({
      id: '',
      name: '',
      price: '',
      quantity: '',
      discount: '',
      category: 1,
      measurementTypeId: 1,
      subProductCategory: '',
    });
    setErrors({});
  };

  // Theme Colors
  const themeColors = {
    text: isDarkMode ? '#ffffff' : '#000000',
    placeholder: isDarkMode ? '#ffffff' : '#757575',
    onSurfaceVariant: isDarkMode ? '#ffffff' : '#757575',
    primary: '#2196F3',
    error: isDarkMode ? '#ffffff' : '#FF0000',
    background: isDarkMode ? '#2d2d2d' : '#ffffff',
    surface: isDarkMode ? '#2d2d2d' : '#ffffff',
    onSurface: isDarkMode ? '#ffffff' : '#000000',
  };

  // Render Functions
  const renderTextInput = (label, value, onChangeText, error, keyboardType, additionalProps = {}) => (
    <TextInput
      mode="outlined"
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={!!error}
      keyboardType={keyboardType}
      style={styles.input}
      dense
      theme={{ colors: themeColors }}
      activeOutlineColor="#2196F3"
      {...additionalProps}
    />
  );

  const renderRadioButtonGroup = (label, groupValue, options, onValueChange) => (
    <View style={styles.radioGroup}>
      <RadioButton.Group value={groupValue} onValueChange={onValueChange}>
        <View style={styles.radioRow}>
          {options.map(({ value, text }) => (
            <TouchableOpacity
              key={value}
              style={styles.radioRow}
              onPress={() => onValueChange(value)}
            >
              <RadioButton value={value} />
              <Text style={[styles.radioLabel, { color: themeColors.text }]}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </RadioButton.Group>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title="Add Product" />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <View style={styles.formInner}>
            <View style={styles.formFields}>
              {/* Product ID */}
              {renderTextInput('Product ID', formData.id, (text) => handleInputChange('id', text), errors.id, 'numeric')}
              {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}

              {/* Product Name */}
              {renderTextInput('Product Name', formData.name, (text) => handleInputChange('name', text), errors.name)}
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

              {/* Price */}
              {renderTextInput(
                'Price',
                formData.price,
                (text) => handleInputChange('price', text),
                errors.price,
                'numeric',
                {
                  left: <TextInput.Affix text="₹" textStyle={{ color: themeColors.text }} />,
                }
              )}
              {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

              {/* Quantity and Measurement Type */}
              <View style={styles.row}>
                {renderTextInput(
                  'Quantity',
                  formData.quantity,
                  (text) => handleInputChange('quantity', text),
                  errors.quantity,
                  'numeric',
                  { style: styles.quantityInput }
                )}
                {renderRadioButtonGroup('Measurement Type', formData.measurementTypeId, [
                  { value: 1, text: 'Unit' },
                  { value: 2, text: 'Kilogram' },
                ], (value) => handleInputChange('measurementTypeId', value))}
              </View>
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}

              {/* Discount */}
              {renderTextInput(
                'Discount',
                formData.discount,
                (text) => handleInputChange('discount', text),
                null,
                'numeric',
                { right: <TextInput.Affix text="%" /> }
              )}

              {/* Category */}
              {renderRadioButtonGroup('Category', formData.category, [
                { value: 1, text: 'Electricals' },
                { value: 2, text: 'Plumbing' },
                { value: 3, text: 'Others' },
              ], (value) => handleInputChange('category', value))}

              {/* Sub-Product Category */}
              {renderTextInput(
                'Sub-Product Category',
                formData.subProductCategory,
                (text) => handleInputChange('subProductCategory', text),
                errors.subProductCategory
              )}

              {/* Form Actions */}
              <TouchableWithoutFeedback>
                <View style={styles.row}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      handleAddTemporaryProduct();
                      Keyboard.dismiss();
                    }}
                    style={styles.actionButton}
                  >
                    Add to List
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={handleClearForm}
                    style={styles.actionButton}
                  >
                    Clear
                  </Button>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </View>

        {/* Temporary Product List */}
        {temporaryProducts.length > 0 && (
          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>
              Temporary Product List ({temporaryProducts.length})
            </Text>
            <MobileTableComponent
              data={temporaryProducts.map((item) => ({
                ...item,
                price: parseFloat(item.price).toFixed(2),
                discount: item.discount ? `${item.discount}` : '0',
                measurementType: item.measurementTypeId === 1 ? 'Unit' : 'Kilogram',
              }))}
              showEditButton={false}
              onDelete={handleRemoveTemporaryProduct}
            />
            <Button
              mode="contained"
              onPress={handleAddAllProducts}
              style={styles.saveButton}
            >
              Save All Products
            </Button>
          </View>
        )}
      </ScrollView>
      <View style={styles.tempMinimize}>
        <Text style={styles.tempMinimizeText}>
          No of Temporary Products: <Text style={styles.tempMinimizeBoldText}>{temporaryProducts.length}</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AddProduct;
