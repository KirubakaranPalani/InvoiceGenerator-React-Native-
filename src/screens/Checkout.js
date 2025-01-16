import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  Keyboard
} from 'react-native';
import { TextInput } from 'react-native-paper';
import * as Print from 'expo-print';
import { useTheme } from '../context/ThemeContext';
import Container from '../components/Container';
import HeaderComponent from '../components/HeaderComponent';
import CheckoutTable from '../components/checkout/CheckoutTable';
import CheckoutSummary from '../components/checkout/CheckoutSummary';
import ProductSearch from '../components/checkout/ProductSearch';
import getCheckoutStyles from '../styles/CheckoutStyles';
import { Asset } from 'expo-asset';
import SmLogo from '../../assets/logo/SmLogo.png';
// import { Asset } from 'expo-asset';

const Checkout = () => {
  const { isDarkMode } = useTheme();
  const styles = getCheckoutStyles(isDarkMode);
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const logoURI = Asset.fromModule(SmLogo).uri;
  useEffect(() => {
    calculateSummary();
  }, [checkoutItems]);

  // const [logoBase64, setLogoBase64] = useState('');

  // useEffect(() => {
  //   // Load the image and convert to Base64
  //   const loadLogo = async () => {
  //     try {
  //       const asset = Asset.fromModule(SmLogo);
  //       // await asset.downloadAsync(); // Ensure the image is downloaded
  //       const base64 = await FileSystem.readAsStringAsync(asset.localUri || asset.uri, {
  //         encoding: FileSystem.EncodingType.Base64,
  //       });
  //       setLogoBase64(`data:image/png;base64,${base64}`);
  //     } catch (error) {
  //       console.error('Error loading logo image:', error);
  //     }
  //   };

  //   loadLogo();
  // }, []);

  // const preloadAssets = async () => {
  //   const images = [require('../../assets/logo/SmLogo.png')];
  //   const cacheImages = images.map((image) => Asset.fromModule(image).downloadAsync());
  //   await Promise.all(cacheImages);
  // };

  // useEffect(() => {
  //   const initializeAssets = async () => {
  //     try {
  //       await preloadAssets();
  //     } catch (error) {
  //       console.error('Error preloading assets:', error);
  //     }
  //   };
  
  //   initializeAssets();
  // }, []);

  const calculateSummary = () => {
    const totalQuantitySum = checkoutItems.reduce((sum, item) => {
      if (item.measurementType === 'gram') {
        return sum + 1;
      } else {
        return sum + item.quantity;
      }
    }, 0);
    const totalCost = checkoutItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalProducts(checkoutItems.length);
    setTotalQuantity(totalQuantitySum);
    setTotalPrice(totalCost);
  };
  // Add product to checkout
  const handleAddToCheckout = (product) => {
    if (!product) return;


    const updatedItems = [...checkoutItems];
    const existingIndex = updatedItems.findIndex((item) => item.id === product.id);

    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += 1;
      updatedItems[existingIndex].totalPrice = calculateTotalPrice(updatedItems[existingIndex]);
    } else {
      updatedItems.push({
        ...product,
        quantity: 1,
        totalPrice: calculateTotalPrice({ ...product, quantity: 1 }),
      });
    }
    setCheckoutItems(updatedItems);
  };

  // Handle item change (e.g., quantity or price)
  const handleItemChange = (index, field, value) => {
    const updatedItems = checkoutItems.map((item, i) => {
      if (i === index) {
        const updatedItem = {
          ...item,
          [field]: field === 'quantity' || field === 'price' || field === 'discount'
            ? parseNumericValue(value)
            : value,
        };
        updatedItem.totalPrice = calculateTotalPrice(updatedItem);
        return updatedItem;
      }
      return item;
    });
    setCheckoutItems(updatedItems);
  };
  const parseNumericValue = (value) => {
    const numericValue = parseFloat(value); // Extract numeric part from the string
    return isNaN(numericValue) ? 0 : Math.max(0, numericValue);
  };

  // Calculate total price for each item (including discount)
  const calculateTotalPrice = (item) => {
    const isGramBased = item.measurementType === 'gram';
    const quantity = isGramBased ? item.quantity / 1000 : item.quantity; // Convert grams to kilograms if needed
    const price = Number(item.price) || 0;
    const discount = Number(item.discount) || 0;
    const totalBeforeDiscount = price * quantity;
    const discountAmount = (discount / 100) * totalBeforeDiscount;
    return totalBeforeDiscount - discountAmount;
  };

  // Delete item from checkout
  const handleDeleteItem = (index) => {
    const updatedItems = checkoutItems.filter((_, i) => i !== index);
    setCheckoutItems(updatedItems);
  };

  // Generate and print PDF invoice
  const handleGeneratePDF = async () => {
    const invoiceHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px 0; /* Add top and bottom margins */
                padding: 0;
                width: 100%;
                height: 100vh;
                max-width: 800px;
                margin: 0 auto;
                box-sizing: border-box;
            }
            .invoice-container {
                padding: 20px;
                margin: 0px auto; /* Add top and bottom margins */
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
            .shop-details img {
                max-width: 100px;
                margin-bottom: 10px;
                position: absolute;
                top: -10px;
                left: 10px;
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
                border-top: 1px solid black;
                border-bottom: 1px solid black;
                border-left: 1px solid black;
                border-right: 1px solid black;
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
                    <img src="${logoURI}" alt="Logo"/>
                      <div class = "shop-details-text"><strong> SM Electricals & Plumbings </strong> </div>
                      <div class = "shop-details-text"> No.56A, Arni Rd, Virupatchipuram,</div> 
                      <div class = "shop-details-text"> RV Nagar, Vellore, Tamil Nadu 632002</div>
                      <div class = "shop-details-text"><strong>Phone:</strong> +91 9442731274</div>
                </div>
                <div class="invoice-details">
                    <p><strong>Invoice No:</strong> INV-123456</p>
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
                            <th style="width: 10%;">Discount</th>
                            <th style="width: 15%;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${checkoutItems.map((item, index) => `
                            <tr>
                                <td style="text-align: center;">${index + 1}</td>
                                <td>${item.name}</td>
                                <td style="text-align: center;">${item.quantity}</td>
                                <td>₹${item.price.toFixed(2)}</td>
                                <td>${item.discount}%</td>
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

    try {
      const { uri } = await Print.printToFileAsync({ html: invoiceHTML });
      await Print.printAsync({ uri });
      Alert.alert('Success', 'Invoice generated and previewed.');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      Alert.alert('Error', 'Failed to generate or preview PDF.');
    }
  };


  // Dismiss dropdown when clicking outside the input or dropdown
  const handleDismissDropdown = () => {
    Keyboard.dismiss();
  };

  // Function to convert numbers to words
  const numberToWords = (num) => {
    const a = [
      "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
      "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
    ];
    const b = [
      "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety",
    ];

    const convertTens = (n) => {
      if (n < 20) return a[n];
      return b[Math.floor(n / 10)] + (n % 10 ? "-" + a[n % 10] : "");
    };

    const convertHundreds = (n) => {
      if (n > 99) return a[Math.floor(n / 100)] + " hundred " + convertTens(n % 100);
      return convertTens(n);
    };
    const convertThousands = (n) => {
      if (n > 999) return convertHundreds(Math.floor(n / 1000)) + " thousand " + convertHundreds(n % 1000);
      return convertHundreds(n);
    };

    const convertLakhs = (n) => {
      if (n > 99999) return convertHundreds(Math.floor(n / 100000)) + " lakh " + convertThousands(n % 100000);
      return convertThousands(n);
    };

    const convertCrores = (n) => {
      if (n > 9999999) return convertHundreds(Math.floor(n / 10000000)) + " crore " + convertLakhs(n % 10000000);
      return convertLakhs(n);
    };

    const capitalizeWords = (str) => {
      return str
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    if (num === 0) return "Zero";
    return capitalizeWords(convertCrores(num));
  };
  const finalPrice = Math.round(totalPrice);
  const finalPriceInWords = numberToWords(finalPrice) + " rupees only";

  return (
    <Container>
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
            customerName.length > 0 ? (
              <TextInput.Icon
                icon="close"
                onPress={() => setCustomerName('')} // Clear the input
                forceTextInputFocus={false}
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
      </View>
      {/* Checkout Table */}
      <CheckoutTable
        checkoutItems={checkoutItems}
        handleItemChange={handleItemChange}
        handleDeleteItem={handleDeleteItem}
        styles={styles}
      />
      {/* Checkout Summary */}
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
    </Container>
  );
};

export default Checkout;
