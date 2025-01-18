import React, { useState, useRef } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    SafeAreaView,
    TouchableWithoutFeedback
} from 'react-native';
import {
    TextInput,
    Button,
    Text,
    Surface,
    Portal,
    Snackbar,
    MD3LightTheme,
    Provider as PaperProvider,
    RadioButton,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import { useSQLiteContext } from 'expo-sqlite';
import MobileTableComponent from '../components/MobileTableComponent';
import HeaderComponent from '../components/HeaderComponent';
import { useTheme } from '../context/ThemeContext';
import SampleStyleSheet from '../styles/SampleStyleSheet';
import { useProductContext } from '../context/ProductContext';
import Container from '../components/Container';
import { useToast } from '../context/ToastContext';

const SampleCheckout = () => {

    const keyboardDismissRef = useRef(false);
    const [shouldDismissKeyboard, setShouldDismissKeyboard] = useState(true);
    const db = useSQLiteContext();
    const { isDarkMode } = useTheme();
    const styles = SampleStyleSheet(isDarkMode);
    const { showToast } = useToast();

    const customTheme = {
        ...MD3LightTheme,
        colors: {
            ...MD3LightTheme.colors,
            primary: '#2196F3',
            onPrimaryContainer: '#2196F3',
            outline: '#2196F3',
        },
    };

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        price: '',
        quantity: '',
        discount: '',
        category: '',
        measurementTypeId: 1, // Default to "unit"
    });
    const [temporaryProducts, setTemporaryProducts] = useState([]);
    const [errors, setErrors] = useState({});
    const [snackbar, setSnackbar] = useState({
        visible: false,
        message: '',
        type: 'info' // 'info', 'success', or 'error'
    });

    const showSnackbar = (message, type = 'info') => {
        setSnackbar({
            visible: true,
            message,
            type
        });
    };

    const hideSnackbar = () => {
        setSnackbar(prev => ({ ...prev, visible: false }));
    };

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: null,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { id, name, price, quantity, category } = formData;

        if (!id) newErrors.id = 'Product ID is required';
        if (!name) newErrors.name = 'Product name is required';
        if (!price) newErrors.price = 'Price is required';
        else if (isNaN(price) || parseFloat(price) <= 0) newErrors.price = 'Invalid price';
        if (!quantity) newErrors.quantity = 'Quantity is required';
        else if (isNaN(quantity) || parseInt(quantity) <= 0) newErrors.quantity = 'Invalid quantity';
        if (!category) newErrors.category = 'Category is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddTemporaryProduct = async () => {
        if (!validateForm()) {
            showSnackbar('Please fill all required fields correctly', 'error');
            return;
        }

        try {
            if (temporaryProducts.some((product) => product.id === formData.id)) {
                setErrors({ id: 'Product with this ID already exists in the list' });
                showSnackbar('Product with this ID already exists in the list', 'error');
                return;
            }

            const existingProduct = await db.getFirstAsync(
                'SELECT * FROM products WHERE id = ?',
                [formData.id]
            );
            if (existingProduct) {
                setErrors({ id: 'Product with this ID already exists in the database' });
                showSnackbar('Product with this ID already exists in the database', 'error');
                return;
            }

            setTemporaryProducts((prevProducts) => [
                ...prevProducts,
                {
                    ...formData,
                    price: Number(formData.price),
                    quantity: Number(formData.quantity),
                    discount: Number(formData.discount) || 0,
                },
            ]);
            setFormData({ ...formData, measurementTypeId: 1 });
            showSnackbar('Product added to temporary list', 'success');
        } catch (error) {
            console.error('Error adding temporary product:', error);
            showSnackbar('Failed to validate product', 'error');
        }
        if (keyboardDismissRef.current) {
            Keyboard.dismiss();
        }
    };

    const handleRemoveTemporaryProduct = (id) => {
        setTemporaryProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
        );
        showToast('Product removed successfully', 'delete');
    };

    const handleAddAllProducts = async () => {
        if (temporaryProducts.length === 0) {
            showSnackbar('No products to add', 'error');
            return;
        }
        try {
            for (const product of temporaryProducts) {
                await addProduct(product); // Use context to add product
            }
            showSnackbar('All products added successfully', 'success');
            setTemporaryProducts([]);
        } catch (error) {
            console.error('Error adding products:', error);
            showSnackbar('Failed to save products', 'error');
        }
    };

    const handleClearForm = () => {
        setFormData({
            id: '',
            name: '',
            price: '',
            quantity: '',
            discount: '',
            category: '',
            measurementTypeId: 1,
        });
        setErrors({});
    };
    const { addProduct } = useProductContext();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <HeaderComponent title="Add Product" />

            {/* Snackbar */}
            <Portal>
                <Snackbar
                    visible={snackbar.visible}
                    onDismiss={hideSnackbar}
                    duration={3000}
                    style={[
                        styles.snackbar,
                        snackbar.type === 'success' ? styles.successSnackbar : styles.errorSnackbar
                    ]}
                >
                    {snackbar.message}
                </Snackbar>
            </Portal>

            {/* Form Section */}
            <ScrollView
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.formContainer}>
                    <View style={styles.formInner}>
                        <View style={styles.formFields}>
                            {/* Product ID */}
                            <TextInput
                                mode="outlined"
                                label="Product ID"
                                value={formData.id}
                                onChangeText={(text) => handleInputChange('id', text)}
                                keyboardType="numeric"
                                error={!!errors.id}
                                style={styles.input}
                                dense
                                theme={{
                                    colors: {
                                        text: isDarkMode ? '#ffffff' : '#000000',
                                        placeholder: isDarkMode ? '#ffffff' : '#757575',
                                        onSurfaceVariant: isDarkMode ? '#ffffff' : '#757575',
                                        primary: '#2196F3',
                                        error: isDarkMode ? '#ffffff' : '#FF0000',
                                        background: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        surface: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        onSurface: isDarkMode ? '#ffffff' : '#000000',
                                    }
                                }}
                                activeOutlineColor="#2196F3"
                            />
                            {errors.id && <Text style={styles.errorText}>{errors.id}</Text>}

                            {/* Product Name */}
                            <TextInput
                                mode="outlined"
                                label="Product Name"
                                value={formData.name}
                                onChangeText={(text) => handleInputChange('name', text)}
                                error={!!errors.name}
                                style={styles.input}
                                dense
                                theme={{
                                    colors: {
                                        text: isDarkMode ? '#ffffff' : '#000000',
                                        placeholder: isDarkMode ? '#ffffff' : '#757575',
                                        onSurfaceVariant: isDarkMode ? '#ffffff' : '#757575',
                                        primary: '#2196F3',
                                        error: isDarkMode ? '#ffffff' : '#FF0000',
                                        background: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        surface: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        onSurface: isDarkMode ? '#ffffff' : '#000000',
                                    }
                                }}
                                activeOutlineColor="#2196F3"
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

                            {/* Price */}
                            <TextInput
                                mode="outlined"
                                label="Price"
                                value={formData.price}
                                onChangeText={(text) => handleInputChange('price', text)}
                                keyboardType="numeric"
                                left={<TextInput.Affix text="₹" textStyle={{ color: isDarkMode ? '#ffffff' : '#000000' }} />}
                                error={!!errors.price}
                                style={styles.input}
                                dense
                                theme={{
                                    colors: {
                                        text: isDarkMode ? '#ffffff' : '#000000',
                                        placeholder: isDarkMode ? '#ffffff' : '#757575',
                                        onSurfaceVariant: isDarkMode ? '#ffffff' : '#757575',
                                        primary: isDarkMode ? '#ffffff' : '#757575',
                                        error: isDarkMode ? '#ffffff' : '#FF0000',
                                        background: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        surface: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        onSurface: isDarkMode ? '#ffffff' : '#000000',
                                    }
                                }}
                                activeOutlineColor="#2196F3"
                            />
                            {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}

                            {/* Quantity and Measurement Type */}
                            <View style={styles.row}>
                                <TextInput
                                    mode="outlined"
                                    label="Quantity"
                                    value={formData.quantity}
                                    onChangeText={(text) => handleInputChange('quantity', text)}
                                    keyboardType="numeric"
                                    error={!!errors.quantity}
                                    style={styles.quantityInput}
                                    dense
                                    theme={{
                                        colors: {
                                            text: isDarkMode ? '#ffffff' : '#000000',
                                            placeholder: isDarkMode ? '#ffffff' : '#757575',
                                            onSurfaceVariant: isDarkMode ? '#ffffff' : '#757575',
                                            primary: '#2196F3',
                                            error: isDarkMode ? '#ffffff' : '#FF0000',
                                            background: isDarkMode ? '#2d2d2d' : '#ffffff',
                                            surface: isDarkMode ? '#2d2d2d' : '#ffffff',
                                            onSurface: isDarkMode ? '#ffffff' : '#000000',
                                        }
                                    }}
                                    activeOutlineColor="#2196F3"
                                />
                                <View style={styles.radioGroup}>
                                    <RadioButton.Group
                                        onValueChange={(value) => handleInputChange('measurementTypeId', value)}
                                        value={formData.measurementTypeId}
                                    >
                                        <View style={styles.radioRow}>
                                            {/* Unit Radio Button */}
                                            <TouchableOpacity
                                                style={styles.radioRow} // Ensures alignment remains correct
                                                onPress={() => handleInputChange('measurementTypeId', 1)} // Selects Unit
                                            >
                                                <RadioButton value={1} />
                                                <Text style={[styles.radioLabel, { color: isDarkMode ? '#ffffff' : '#000000' }]}>Unit</Text>
                                            </TouchableOpacity>

                                            {/* Gram Radio Button */}
                                            <TouchableOpacity
                                                style={styles.radioRow} // Ensures alignment remains correct
                                                onPress={() => handleInputChange('measurementTypeId', 2)} // Selects Gram
                                            >
                                                <RadioButton value={2} />
                                                <Text style={[styles.radioLabel, { color: isDarkMode ? '#ffffff' : '#000000' }]}>KiloGram</Text>

                                            </TouchableOpacity>
                                        </View>
                                    </RadioButton.Group>
                                </View>
                            </View>
                            {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}

                            {/* Discount */}
                            <TextInput
                                mode="outlined"
                                label="Discount"
                                value={formData.discount}
                                onChangeText={(text) => handleInputChange('discount', text)}
                                keyboardType="numeric"
                                right={<TextInput.Affix text="%" />}
                                style={styles.input}
                                dense
                                theme={{
                                    colors: {
                                        text: isDarkMode ? '#ffffff' : '#000000',
                                        placeholder: isDarkMode ? '#ffffff' : '#757575',
                                        onSurfaceVariant: isDarkMode ? '#ffffff' : '#757575',
                                        primary: '#2196F3',
                                        error: isDarkMode ? '#ffffff' : '#FF0000',
                                        background: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        surface: isDarkMode ? '#2d2d2d' : '#ffffff',
                                        onSurface: isDarkMode ? '#ffffff' : '#000000',
                                    }
                                }}
                                activeOutlineColor="#2196F3"
                            />

                            {/* Category Picker */}
                            <View style={styles.pickerContainer}>
                                <Text style={styles.pickerLabel}>Category</Text>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={formData.category}
                                        onValueChange={(itemValue) => handleInputChange('category', itemValue)}
                                        style={[
                                            styles.picker,
                                            errors.category && styles.pickerError
                                        ]}
                                    >
                                        <Picker.Item label="Select Category" value="" />
                                        <Picker.Item label="Electrical" value="Electrical" />
                                        <Picker.Item label="Plumbing" value="Plumbing" />
                                        <Picker.Item label="Tools" value="Tools" />
                                        <Picker.Item label="Others" value="Others" />
                                    </Picker>
                                </View>
                                {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
                            </View>
                            {/* Form Actions */}
                            <TouchableWithoutFeedback>
                                <View style={styles.row}>
                                    <Button
                                        mode="contained"
                                        onPress={handleAddTemporaryProduct}
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
                                measurementType: item.measurementTypeId === 2 ? 'gram' : 'unit',
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

export default SampleCheckout;
