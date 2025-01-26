import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  Keyboard,
  SafeAreaView,
  Text,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as Print from 'expo-print';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import HeaderComponent from '../common/HeaderComponent';
import CheckoutTable from '../components/checkout/CheckoutTable';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import MinimizedCheckoutSummary from '../components/checkout/MinimizedCheckoutSummary';
import ProductSearch from '../components/checkout/ProductSearch';
import getCheckoutStyles from '../styles/CheckoutStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const Checkout = () => {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const styles = getCheckoutStyles(isDarkMode);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [keyboardOn, setKeyboardOn] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  
  // Calculate and update summary when checkoutItems change
  useEffect(() => {
    calculateSummary();
  }, [checkoutItems]);
  
  
  // Manage keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardOn(true); // Set margin to 0 when keyboard is open
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOn(false); // Restore margin when keyboard is closed
    });
    
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  

  // Generate Invoice Number
  const generateInvoiceNumber = async () => {
    try {
      // Get today's date in DDMMYY format
      const today = new Date();
      const datePart = `${String(today.getDate()).padStart(2, '0')}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getFullYear()).slice(2)}`;
      let sequentialNumber = 1;
  
      // Retrieve last invoice data from AsyncStorage
      const lastInvoiceData = await AsyncStorage.getItem('lastInvoice');
      if (lastInvoiceData) {
        const { lastDate, lastNumber } = JSON.parse(lastInvoiceData);
  
        // If the stored date matches today's date, increment the invoice number
        if (lastDate === datePart) {
          sequentialNumber = lastNumber + 1;
        }
      }
  
      // Generate new invoice number
      const newInvoiceNumber = `${datePart}-${String(sequentialNumber).padStart(3, '0')}`;
      
      // Save the new invoice details to AsyncStorage
      await AsyncStorage.setItem(
        'lastInvoice',
        JSON.stringify({ lastDate: datePart, lastNumber: sequentialNumber })
      );
  
      // Update the state
      setInvoiceNumber(newInvoiceNumber);
  
      return newInvoiceNumber;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      Alert.alert('Error', 'Failed to generate invoice number.');
      return null;
    }
  };
  
  
  const calculateSummary = () => {
    const totalQuantitySum = checkoutItems.reduce((sum, item) => sum + (item.measurementType === 'Kilogram' ? 1 : item.quantity), 0);
    const totalCost = checkoutItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    setTotalProducts(checkoutItems.length);
    setTotalQuantity(totalQuantitySum);
    setTotalPrice(totalCost);
  };
  
  // Add product to checkout
  const handleAddToCheckout = (product) => {
    if (!product) return;
    
    setCheckoutItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === product.id);
      
      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        const existingItem = updatedItems[existingIndex];
        
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + 1,
          totalPrice: calculateTotalPrice({
            ...existingItem,
            quantity: existingItem.quantity + 1,
          }),
        };
        
        return updatedItems;
      }
      
      return [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          totalPrice: calculateTotalPrice({ ...product, quantity: 1 }),
        },
      ];
    });
  };

  // Handle item change (e.g., quantity or price)
  const handleItemChange = (index, field, value) => {
    setCheckoutItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? {
            ...item,
            [field]: ['quantity', 'price', 'discount'].includes(field)
              ? parseNumericValue(value)
              : value,
            totalPrice: calculateTotalPrice({
              ...item,
              [field]: ['quantity', 'price', 'discount'].includes(field)
                ? parseNumericValue(value)
                : value,
            }),
          }
          : item
      )
    );
  };

  const parseNumericValue = (value) => {
    if (value === '' || value === '.') return 0; // Allow intermediate '.' or empty input
    const numericValue = parseFloat(value);
    return isNaN(numericValue) ? 0 : numericValue.toString(); // Convert back to string
  };

  // Calculate total price for each item (including discount)
  const calculateTotalPrice = (item) => {
    const quantity = item.quantity;
    const price = parseFloat(item.price) || 0;
    const discount = parseFloat(item.discount) || 0;
    const totalBeforeDiscount = price * quantity;
    return totalBeforeDiscount - (discount / 100) * totalBeforeDiscount;
  };
  const calculateDiscountedPrice = (item) => {
    return calculateTotalPrice(item) / item.quantity;
  };

  // Delete item from checkout
  const handleDeleteItem = (index) => {
    setCheckoutItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  // Generate and print PDF invoice

  const handleGeneratePDF = async () => {
  
    try {
      // Generate the HTML content for the invoice
      if (!invoiceNumber) {
        await generateInvoiceNumber();
      }
      const invoiceHTML = generateInvoiceHTML();
      // Pass the HTML content to the PDF preview screen
      router.push({
        pathname: '/pdf-preview',
        params: { invoiceHTML },
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to navigate to PDF preview.');
    }
  };

  // Helper function to generate Invoice HTML
  const generateInvoiceHTML = () => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice</title>
      <style>
       @page {
        margin: 10px; 
    }
          body {
              padding: 20px 10px;
              font-family: Arial, sans-serif;
              margin: 300px 0;
              margin-left: auto;
              margin-right: auto;
              padding: 0;
              width: 100%;
              height: 100vh;
              max-width: 800px;
              margin: 0 auto;
              box-sizing: border-box;
          }
          .invoice-container {
              padding: 10px 10px;
              margin: 0 auto;
              border: 1px solid #000;
              box-sizing: border-box;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              page-break-after: always;
          }
          .invoice-title {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              margin-bottom: 20px;
          }
          .invoice-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              font-size: 14px;
              align-items: center;
          }
          .shop-details {
              text-align: left;
          }
          .shop-details .logo {
              font-family: "Times New Roman", serif;
              font-size: 48px;
              font-weight: bold;
              margin-bottom: 10px;
              position: absolute;
              top: 5px;
              left: 10px;
              color: white;
              text-shadow: -1px -1px 0 black, 
                1px -1px 0 black, 
                -1px 1px 0 black, 
                1px 1px 0 black; /* Creates a black outline effect */
}
          .shop-details-text {
              margin-bottom: 5px;
          }
          .invoice-details {
              text-align: right;
          }
          .item-list {
              margin-top: 10px;
              flex-grow: 1;
          }
          .item-list table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
          }
          .item-list thead th {
              padding: 6px;
              text-align: left;
              border: 1px solid black;
              background-color: #f2f2f2;
              font-weight: bold;
          }
          .item-list tbody td {
              padding: 6px;
              text-align: left;
              border-left: 1px solid black;
              border-right: 1px solid black;
          }
          .item-list tbody tr:last-child {
              border-bottom: 1px solid black;
          }
          .summary {
              display: flex;
              justify-content: space-between;
              font-size: 16px;
              margin-top: 20px;
          }
          .left-align {
              text-align: left;
              font-weight: bold;
              font-size: 16px;
          }
          .right-align {
              text-align: right;
              font-weight: bold;
              font-size: 16px;
          }
          .fill-space {
              flex-grow: 1;
          }
      </style>
  </head>
  <body>
      <div class="invoice-container">
          <div class="invoice-title">Invoice</div>
          <div class="invoice-header">
              <div class="shop-details">
                  <div class="logo">SM</div>
                  <div class="shop-details-text"><strong>shop name</strong></div>
                  <div class="shop-details-text">shop address,</div>
                  <div class="shop-details-text">shop area</div>
                  <div class="shop-details-text"><strong>Phone:</strong>number</div>
              </div>
              <div class="invoice-details">
                  <p><strong>Invoice No:</strong> ${invoiceNumber}</p>
                  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                  <p><strong>Customer Name:</strong> ${customerName || '_________'}</p>
              </div>
          </div>
          <div class="item-list">
              <table>
                  <thead>
                      <tr>
                          <th style="width: 5%;">S.No</th>
                          <th style="width: 50%;">Item Description</th>
                          <th style="width: 7.5%;">Qty.</th>
                          <th style="width: 12.5%;">Price</th>
                          <th style="width: 15%;">Total</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${checkoutItems.map((item, index) => `
                          <tr>
                              <td style="text-align: center;">${index + 1}</td>
                              <td>${item.name}</td>
                              <td style="text-align: center;">${item.measurementType === 'Kilogram' ? `${item.quantity / 1000}(kg)` : item.quantity}</td>
                              <td>₹${calculateDiscountedPrice(item).toFixed(2)}</td>
                              <td>₹${item.totalPrice.toFixed(2)}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
          </div>
          <div class="fill-space"></div>
          <div class="summary">
              <div class="left-align">
                  <p><strong>Total Products:</strong> ${totalProducts}</p>
                  <p><strong>Total Quantity:</strong> ${totalQuantity}</p>
                  <p><strong>Final Price in Words:</strong> ${finalPriceInWords}</p>
              </div>
              <div class="right-align">
                  <p><strong>Total Price:</strong> ₹${totalPrice.toFixed(2)}</p>
                  <p><strong>Final Price:</strong> ₹${Math.round(totalPrice)}</p>
              </div>
          </div>
      </div>
  </body>
  </html>
  `;


  // Function to convert numbers to words
  const numberToWords = (num) => {
    const ones = [
      "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
    ];
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    const convertTens = (n) => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? "-" + ones[n % 10] : ""));
    const convertHundreds = (n) => (n > 99 ? ones[Math.floor(n / 100)] + " hundred " + convertTens(n % 100) : convertTens(n));
    const convertThousands = (n) => (n > 999 ? convertHundreds(Math.floor(n / 1000)) + " thousand " + convertHundreds(n % 1000) : convertHundreds(n));
    const convertLakhs = (n) => (n > 99999 ? convertHundreds(Math.floor(n / 100000)) + " lakh " + convertThousands(n % 100000) : convertThousands(n));
    const convertCrores = (n) => (n > 9999999 ? convertHundreds(Math.floor(n / 10000000)) + " crore " + convertLakhs(n % 10000000) : convertLakhs(n));

    const capitalize = (str) => str.split(" ").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

    return num === 0 ? "Zero" : capitalize(convertCrores(num));
  };

  const finalPrice = Math.round(totalPrice);
  const finalPriceInWords = `${numberToWords(finalPrice)} rupees only`;

  const renderTableHeaderCell = (label, style) => (
    <Text style={[styles.tableCell, styles.cellBase, style]} numberOfLines={1}>
      {label}
    </Text>
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderComponent title="Checkout" />

      {/* Product Search */}
      <ProductSearch
        onProductSelect={handleAddToCheckout}
        styles={styles}
        isDarkMode={isDarkMode}
      />
      <View style={styles.textBox}>
        <TextInput
          mode="outlined"
          label="Customer Name"
          value={customerName}
          onChangeText={setCustomerName}
          right={
            customerName.length > 0 && (
              <TextInput.Icon
                icon="close"
                onPress={() => setCustomerName('')}
                forceTextInputFocus={false}
              />
            )
          }
          style={[
            { marginVertical: 2, height: 30 },
            { backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff' },
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
      </View>

      {/* Table header */}
      <View style={[styles.tableRow, styles.tableHeader, { zIndex: 1 }]}>
        {renderTableHeaderCell('#', styles.serialCell)}
        {renderTableHeaderCell('Product Info', styles.productCell)}
        {renderTableHeaderCell('Qty', styles.qtyCell)}
        {renderTableHeaderCell('Price ₹', styles.priceCell)}
        {renderTableHeaderCell('Disc%', styles.discountCell)}
        {renderTableHeaderCell('Total', styles.totalCell)}
        <View style={[styles.cellBase, styles.actionCell, styles.headerIcon]}>
          <MaterialIcons
            name="delete-outline"
            size={20}
            color={isDarkMode ? '#fff' : '#000'}
          />
        </View>
      </View>

      {/* Checkout Table */}
      <CheckoutTable
        checkoutItems={checkoutItems}
        handleItemChange={handleItemChange}
        handleDeleteItem={handleDeleteItem}
        styles={styles}
      />
      {/* Checkout Summary */}
      {keyboardOn ? (
        <MinimizedCheckoutSummary
          totalProducts={totalProducts}
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          styles={styles}
          isDarkMode={isDarkMode}
        />
      ) : (
        <CheckoutSummary
          checkoutItems={checkoutItems}
          totalProducts={totalProducts}
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          customerName={customerName}
          setCustomerName={setCustomerName}
          handleGeneratePDF={handleGeneratePDF}
          styles={styles}
          isDarkMode={isDarkMode}
          finalPriceInWords={finalPriceInWords}
        />
      )
      }
    </SafeAreaView>
  );
};

export default Checkout;
