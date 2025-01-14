import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { RadioButton } from 'react-native-paper';

const EditModal = ({ visible, product, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: '',
    name: '',
    price: '',
    quantity: '',
    discount: '',
    measurementTypeId: 1,
  });

  // Sync form with product when product changes
  useEffect(() => {
    if (product) {
      setForm({
        id: product.id || '',
        name: product.name || '',
        price: product.price || '',
        quantity: product.quantity || '',
        discount: product.discount || '',
        measurementTypeId: product.measurementTypeId || 1,
      });
    }
  }, [product]);

  const handleSave = () => {
    if (!form.id || !form.name || !form.price || !form.quantity || !form.measurementTypeId) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    onSave(form);
  };

  const getMeasurementLabel = (measurementTypeId) => {
    switch (measurementTypeId) {
      case 1:
        return 'Quantity (Unit)';
      case 2:
        return 'Quantity (Kilogram)';
      default:
        return 'Quantity';
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Edit Product</Text>

          <Text style={styles.label}>Product ID: {form.id}</Text>

          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={form?.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(form?.price)}
            onChangeText={(text) => setForm({ ...form, price: Number(text) })}
          />

          <Text style={styles.label}>Discount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(form?.discount || 0)}
            onChangeText={(text) => setForm({ ...form, discount: Number(text) })}
          />
          <Text style={styles.label}>Measurement Type</Text>
          <RadioButton.Group
            onValueChange={(value) => setForm({ ...form, measurementTypeId: Number(value) })}
            value={form?.measurementTypeId}
          >
            <View style={styles.radioGroup}>
              <TouchableOpacity style={styles.radioRow}
               onPress={() =>setForm({ ...form, measurementTypeId: 1 })}>
                <RadioButton value={1} />
                <Text style={styles.radioLabel}>Unit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.radioRow}
               onPress={() =>setForm({ ...form, measurementTypeId: 2 })}>
                <RadioButton value={2} />
                <Text style={styles.radioLabel}>Kilogram</Text>
              </TouchableOpacity>
            </View>
          </RadioButton.Group>

          {/* Quantity Field with Dynamic Label */}
          <Text style={styles.label}>{getMeasurementLabel(form?.measurementTypeId)}</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(form?.quantity)}
            onChangeText={(text) => setForm({ ...form, quantity: Number(text) })}
          />

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
    marginTop:10,
    marginBottom:10,
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
