import { useSQLiteContext } from 'expo-sqlite';
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, FlatList, TouchableOpacity, Text, TouchableWithoutFeedback } from 'react-native';
import { TextInput } from 'react-native-paper';
import {lightColors, darkColors } from '../../styles/ProductsStyles';
import { useFocusEffect } from '@react-navigation/native';
import { useProductContext } from '../../context/ProductContext';

const ProductSearch = ({
  onProductSelect,
  isDarkMode,
}) => {
  const styles = getProductSearchStyles(isDarkMode);
  const textInputRef = useRef(null);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const db = useSQLiteContext();

  const { products } = useProductContext(); // Use products from context

  // Handle product selection
  const handleProductSelect = (selectedItem) => {
    onProductSelect(selectedItem);
    setSearchInput('');
    setShowDropdown(false);
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

    // const fetchProducts = async () => {
      useEffect(() => {
        async function fetchProducts() {
      try {
        const results = await db.getAllAsync(`SELECT * FROM products;`);
        setProductSuggestions(results);
      } catch (error) {
        console.error('Error searching products:', error);
      }
    }
    fetchProducts();
  }, [])

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchProducts();
  //   }, [])
  // );

  // Search products based on query
  const handleSearch = (inputVal) => {
    setSearchInput(inputVal);
    setShowDropdown(true);
  };

  // Handle keyboard "Enter" or "OK" key press explicitly
  const handleEnterKey = () => {
    const filteredSuggestions = productSuggestions.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        product.id.toString().startsWith(searchInput)
      );
    });

    if (filteredSuggestions.length === 1) {
      handleProductSelect(filteredSuggestions[0]);
      Keyboard.dismiss();
    }
  };

  // Handle keyboard hide and touch outside
  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setShowDropdown(false);
    });

    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  // const filteredProducts = productSuggestions.filter((product) => {
  //   return product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
  //     product.id.toString().startsWith(searchInput);
  // });

   // Filter products based on the search query
   const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    product.id.toString().startsWith(searchInput)
  );
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        { backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff' }
      ]}
      onPress={() => handleProductSelect(
        item
      )}
    >
      <Text style={[
        styles.dropdownItemText,
        { color: isDarkMode ? '#ffffff' : '#000000' }
      ]}>
        {`${item.id} - ${item.name} - ₹${item.price} (${(item.measurementType === 'gram' ? 'Kg' : 'Unit')})`}
      </Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={() => setShowDropdown(false)}>
      <>
        <TouchableWithoutFeedback>
          <>
            <TextInput
              ref={textInputRef}
              mode="outlined"
              label="Search by ID or name..."
              value={searchInput}
              onChangeText={handleSearch}
              onSubmitEditing={handleEnterKey}
              right={
                searchInput.length > 0 ? (
                  <TextInput.Icon
                    icon="close"
                    onPress={() => setSearchInput('')} // Clear the input
                    forceTextInputFocus={false} // Prevent refocusing when clearing
                  />
                ) : null
              }
              style={[
                styles.input,
                { backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff' }
              ]}
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
            />
          </>
        </TouchableWithoutFeedback>
        {showDropdown && searchInput.length > 0 && (
          <TouchableWithoutFeedback>
            <View style={[
              styles.dropdownContainer,
              { backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff' }
            ]}>
              <FlatList
                data={filteredProducts}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                maxHeight={124}
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      {/* </View> */}
      </>
    </TouchableWithoutFeedback>
  );
};

const createStyles = (colors, isDarkMode) => StyleSheet.create({

  input: {
    height: 40,
    borderColor: '#bbb',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    fontSize: 16,
  },
  dropdownContainer: {
    // change position to fix the dropdown container here
    position: 'absolute',
    top: 110,
    left: 10,
    right: 10,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 5,
    zIndex: 1000,
    elevation: 5,
    maxHeight:400,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
})
const getProductSearchStyles = (isDarkMode) => {
  const colors = isDarkMode ? darkColors : lightColors;
  return createStyles(colors, isDarkMode);
};

export default ProductSearch;
