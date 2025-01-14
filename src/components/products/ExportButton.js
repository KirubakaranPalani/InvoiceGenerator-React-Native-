import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import XLSX from 'xlsx';

const ExportButton = ({ data, style, textStyle }) => {
  const handleExport = async () => {
    try {
      if (!data || data.length === 0) {
        Alert.alert('Error', 'No data available to export');
        return;
      }

      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Products');

      // Generate Excel file
      const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });
      const fileName = `products_${new Date().getTime()}.xlsx`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // Write file
      await FileSystem.writeAsStringAsync(filePath, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Share file
      await Sharing.shareAsync(filePath, {
        mimeType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Export Products',
      });

      // Clean up
      await FileSystem.deleteAsync(filePath);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data. Please try again.');
    }
  };

  return (
    <TouchableOpacity style={style} onPress={handleExport}>
      <Text style={textStyle} numberOfLines={1}>Export</Text>
    </TouchableOpacity>
  );
};

export default ExportButton;
