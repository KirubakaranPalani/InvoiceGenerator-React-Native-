import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';

const EditModal = ({ visible, product, onClose, onSave }) => {
  const [form, setForm] = useState(initialFormState);
  const initialFormState = {
    id: '',
    name: '',
    price: '',
    quantity: '',
    discount: '',
    category: 'Electricals',
    measurementType: 'Unit', // Default to 'Unit'
    subProductCategory: '',
  }

  // Sync form with product when product changes
  useEffect(() => {
    if (product) {
      setForm({
        id: product.id || '',
        name: product.name || '',
        price: product.price || '',
        quantity: product.quantity || '',
        discount: product.discount || 0,
        category: product.category || 'Electricals',
        measurementType: product.measurementType || 'Unit', // Default if not provided
        subProductCategory: product.subProductCategory || '',
      });
    } else {
      setForm(initialFormState);
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setForm((prevForm) => ({
      ...prevForm,
      [field]: value,
    }));
  };

  const validateAndSave = () => {
    const requiredFields = ['name', 'price', 'quantity', 'category'];
    const isValid = requiredFields.every((field) => form[field]);
    if (!isValid) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    onSave(form);
  };
  const renderRadioGroup = (label, options, selectedValue, onChange) => (
    <View>
      <Text style={styles.label}>{label}</Text>
      <RadioButton.Group onValueChange={onChange} value={selectedValue}>
        <View style={styles.radioGroup}>
          {options.map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={styles.radioRow}
              onPress={() => onChange(value)}
            >
              <RadioButton value={value} />
              <Text style={styles.radioLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </RadioButton.Group>
    </View>
  );

  const getMeasurementLabel = (type) =>
    type === 'Kilogram' ? 'Quantity (Kilogram)' : 'Quantity (Unit)';

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Product</Text>

          <Text style={styles.label}>Product ID: {form?.id}</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={form?.name}
            onChangeText={(text) => handleInputChange('name', text)}
          />

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(form?.price)}
            onChangeText={(text) => handleInputChange('price', parseFloat(text) || 0)}
          />

          <Text style={styles.label}>Discount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(form?.discount || 0)}
            onChangeText={(text) => handleInputChange('discount', parseFloat(text) || 0)}
          />
          {renderRadioGroup(
            'Measurement Type',
            [
              { value: 'Unit', label: 'Unit' },
              { value: 'Kilogram', label: 'Kilogram' },
            ],
            form?.measurementType,
            (value) => handleInputChange('measurementType', value)
          )}

          {/* Quantity Field with Dynamic Label */}
          <Text style={styles.label}>{getMeasurementLabel(form?.measurementType)}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(form?.quantity)}
            onChangeText={(text) => handleInputChange('quantity', parseFloat(text) || 0)}
          />

          {renderRadioGroup(
            'Category',
            [
              { value: 'Electricals', label: 'Electricals' },
              { value: 'Plumbing', label: 'Plumbing' },
              { value: 'Others', label: 'Others' },
            ],
            form?.category,
            (value) => handleInputChange('category', value)
          )}

          <Text style={styles.label}>Sub-Product Category</Text>
          <TextInput
            style={styles.input}
            value={form?.subProductCategory}
            onChangeText={(text) => handleInputChange('subProductCategory', text)}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.saveButton} onPress={validateAndSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
  modalContent: { backgroundColor: '#222', padding: 20, borderRadius: 10, width: '90%' },
  modalTitle: { fontSize: 20, color: '#00e0ff', textAlign: 'center', marginBottom: 15 },
  label: { color: '#00e0ff', marginBottom: 5 },
  input: { backgroundColor: '#333', color: '#fff', borderRadius: 5, padding: 10, marginBottom: 10 },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
  saveButton: { backgroundColor: '#4caf50', flex: 1, marginRight: 5, padding: 10, borderRadius: 5 },
  cancelButton: { backgroundColor: '#ff4d4d', flex: 1, marginLeft: 5, padding: 10, borderRadius: 5 },
  buttonText: { color: '#fff', textAlign: 'center' },
  radioGroup: {
    flexDirection: 'row', // Align radio buttons horizontally
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensures items align to the left
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5, // Add space between each radio button group
  },
  radioLabel: {
    marginLeft: 4,
    color: '#00e0ff',
    marginRight: 23,

  },
});

export default EditModal;
