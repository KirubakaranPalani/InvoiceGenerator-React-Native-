import React from 'react';
import { StyleSheet, View, Alert, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import * as Print from 'expo-print';

const PDFPreview = () => {
  const { invoiceHTML } = useLocalSearchParams(); // Retrieve params passed during navigation

  if (!invoiceHTML) {
    Alert.alert('Error', 'No content to preview.');
    return null; // Return early if there's no content
  }
  const handlePrint = async () => {
    try {
      // Use the Print API to print the invoice
      await Print.printAsync({ html: invoiceHTML });
    } catch (error) {
      console.error('Error during printing:', error);
      Alert.alert('Error', 'Failed to print the document.');
    }
  };

  return (
    <View style={styles.container}>
      {/* WebView for PDF preview */}
      <WebView 
        originWhitelist={['*']} 
        source={{ html: invoiceHTML }} 
        style={styles.webview} 
        scalesPageToFit={true} 
        javaScriptEnabled={true} 
      />
      {/* Print button */}
      <View style={styles.buttonContainer}>
        <Button title="Print" onPress={handlePrint} color="#2196F3" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  webview: {
    flex: 1,
    width: "auto", // Ensure it takes the full width of the container
    // marginHorizontal: '2%', // Add a slight margin for better presentation
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },

});

export default PDFPreview;

