import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as XLSX from 'xlsx';

const ImportButton = ({ onImport, style, textStyle }) => {
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    try {
      setLoading(true);

      // Open document picker to select an Excel file
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const fileDetails = result.assets[0];
        const fileUri = fileDetails.uri;

        // Fetch the file and read it as a Blob
        const response = await fetch(fileUri);
        const blob = await response.blob();

        const reader = new FileReader();

        reader.onloadend = async (e) => {
          try {
            const data = new Uint8Array(e.target.result);

            // Parse the binary data into a workbook object
            const workbook = XLSX.read(data, { type: 'array' });

            // Extract the first sheet's data
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convert the sheet data to JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            if (jsonData.length === 0) {
              Alert.alert('Error', 'The Excel file is empty. Please select a valid file.');
              return;
            }

            // Validate the data
            if (jsonData.length === 0) {
              throw new Error('The Excel file is empty. Please select a valid file.');
            }

            const requiredKeys = ['id', 'name', 'price', 'quantity', 'category'];
            const isValid = jsonData.every((row) =>
              requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(row, key))
            );

            if (!isValid) {
              throw new Error('Invalid data format. Ensure the file has all required columns.');
            }

            // Pass the parsed data to the parent component
            onImport(jsonData);
          } catch (error) {
            Alert.alert('Error', 'Failed to parse Excel file. Please ensure it is a valid Excel file.');
          }
        };

        reader.onerror = () => {
          Alert.alert('Error', 'Failed to read the file. Please try again.');
        };

        // Read the Blob as an ArrayBuffer
        reader.readAsArrayBuffer(blob);
      } else {
        Alert.alert('Error', 'No file selected or invalid file. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to import file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={style}
      onPress={handleImport}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#ffffff" />
      ) : (
        <Text style={textStyle} numberOfLines={1}>Import</Text>
      )}
    </TouchableOpacity>
  );
};

export default ImportButton;
