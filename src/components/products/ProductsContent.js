import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Alert, TouchableOpacity, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { TextInput } from 'react-native-paper';
import CategoryBoxComponent from './CategoryBoxComponent';
import MobileTableComponent from '../../common/MobileTableComponent';
import { useTheme } from '../../context/ThemeContext';
import getProductsStyles from '../../styles/ProductsStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ExportButton from '../../components/products/ExportButton';
import ImportButton from '../../components/products/ImportButton';
import { useSQLiteContext } from 'expo-sqlite';
import { useToast } from '../../context/ToastContext';

const ProductsContent = ({
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    handleProductEdit,
    products,
    fetchProducts,
    setLoading,
}) => {
    const db = useSQLiteContext();
    const { isDarkMode } = useTheme();
    const styles = getProductsStyles(isDarkMode);
    const { showToast } = useToast();
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [commonSearchTerm, setCommonSearchTerm] = useState('');
    const [subSearchTerm, setSubSearchTerm] = useState('');

    useEffect(() => {
        const showListener = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideListener = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));

        return () => {
            showListener.remove();
            hideListener.remove();
        };
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, commonSearchTerm, subSearchTerm]);

    // Memoized categories
    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(product => product.category))];
        return ['All', ...uniqueCategories];
    }, [products]);

    // Get unique subcategories for the selected category
    const subcategories = useMemo(() => {
        if (!selectedCategory || selectedCategory === 'All') return [];
        return [...new Set(products.filter((product) => product.category === selectedCategory).map((product) => product.subProductCategory))];
    }, [products, selectedCategory]);


    // Filtered categories based on search term
    const filteredCategories = useMemo(() => {
        if (!commonSearchTerm) return categories;
        return categories.filter((category) =>
            category.toLowerCase().includes(commonSearchTerm.toLowerCase())
        );
    }, [categories, commonSearchTerm]);

    // Filtered subcategories based on search term
    const filteredSubcategories = useMemo(() => {
        if (!subSearchTerm) return subcategories;
        return subcategories.filter((subcategory) =>
            subcategory.toLowerCase().includes(subSearchTerm.toLowerCase())
        );
    }, [subcategories, subSearchTerm]);

    // Filter products by selected category and subcategory
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const isInCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const isInSubCategory = !selectedSubCategory || product.subProductCategory === selectedSubCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || product.id.toString().startsWith(searchTerm);
            return isInCategory && isInSubCategory && matchesSearch;
        });
    }, [products, selectedCategory, selectedSubCategory, searchTerm]);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    // Calculate total pages
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    const paginatedProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProducts.slice(startIndex, startIndex + itemsPerPage).map((product, index) => ({
            ...product,
            serialNumber: startIndex + index + 1, // Calculate serial number
        }));
    }, [filteredProducts, currentPage]);

    // Handlers for pagination
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const renderPaginationControls = () => {
        if (totalPages <= 1) return null;
        return (
        <View style={[styles.paginationContainer, { marginBottom: keyboardVisible ? 0 : 60 },]}>
            <TouchableOpacity
                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                onPress={handlePreviousPage}
                disabled={currentPage === 1}
            >
                <Text style={styles.paginationText}>Previous</Text>
            </TouchableOpacity>
            <Text style={styles.paginationInfo}>
                Page {currentPage} of {totalPages}
            </Text>
            <TouchableOpacity
                style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
            >
                <Text style={styles.paginationText}>Next</Text>
            </TouchableOpacity>
        </View>
        );
    };

    const subcategoryProductCounts = useMemo(() => {
        if (!selectedCategory || selectedCategory === 'All') return {};
        return products.reduce((acc, product) => {
            if (product.category === selectedCategory) {
                acc[product.subProductCategory] = (acc[product.subProductCategory] || 0) + 1;
            }
            return acc;
        }, {});
    }, [products, selectedCategory]);

    const categorySubcategoryCounts = useMemo(() => {
        return products.reduce((acc, product) => {
            if (!acc[product.category]) acc[product.category] = new Set();
            acc[product.category].add(product.subProductCategory);
            return acc;
        }, {});
    }, [products]);

    const categorySubcategoryCountsBySize = useMemo(() => {
        return Object.entries(categorySubcategoryCounts).reduce((acc, [category, subcategories]) => {
            acc[category] = subcategories.size; // Convert Set to its size
            return acc;
        }, {});
    }, [categorySubcategoryCounts]);

    // Delete all products
    const handleDeleteAll = () => {
        Alert.alert(
            'Delete All Products',
            'Are you sure you want to delete all products? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await db.runAsync('DELETE FROM products');
                            fetchProducts();
                            showToast(`All products removed successfully(${products.length})`, 'delete');
                        } catch (error) {
                            console.error('Failed to delete all products:', error);
                            showToast('Failed to delete all products', 'error');
                        }
                    },
                },
            ]
        );
    };

    const handleProductDelete = (productId, name) => {
        Alert.alert(
            'Delete Product',
            'Are you sure you want to delete this product?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await db.runAsync('DELETE FROM products WHERE id = ?', [productId]);
                            fetchProducts();
                            showToast(`(${name}) removed successfully(${products.length})`);
                        } catch (error) {
                            console.error('Failed to delete product:', error);
                            showToast('Failed to delete product', 'error');
                        }
                    },
                },
            ]
        );
    };

    const processImportedData = async (data) => {
        try {
            setLoading(true);

            // Validate imported data
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('The imported data is invalid or empty.');
            }

            const requiredKeys = ['id', 'name', 'price', 'quantity', 'discount', 'category', 'measurementType', 'subProductCategory'];
            const isValid = data.every((row) => requiredKeys.every((key) => Object.prototype.hasOwnProperty.call(row, key)));

            if (!isValid) {
                throw new Error('Invalid data format. Ensure the file contains all required columns: id, name, price, quantity, category, discount, measurementType, subProductCategory.');
            }

            const values = data.map((row) => {
                return `(
              '${String(row.id).replace(/'/g, "''")}',
              '${String(row.name).replace(/'/g, "''")}',
              ${Number(row.price) || 0},
              ${Number(row.quantity) || 0},
              ${Number(row.discount) || 0},
              '${String(row.category).replace(/'/g, "''")}',
              '${String(row.measurementType).replace(/'/g, "''")}',
              '${String(row.subProductCategory).replace(/'/g, "''")}'
            )`;
            }).join(',');

            const query = `
            INSERT INTO products (id, name, price, quantity, discount, category, measurementType, subProductCategory)
            VALUES ${values}
            ON CONFLICT(id) DO UPDATE SET
              name = excluded.name,
              price = excluded.price,
              quantity = excluded.quantity,
              category = excluded.category,
              discount = excluded.discount,
              measurementType = excluded.measurementType,
              subProductCategory = excluded.subProductCategory
          `;

            await db.runAsync(query);
            fetchProducts();
            showToast(`${data.length} products imported successfully.`);
        } catch (error) {
            console.error('Error during import process:', error);
            showToast(error.message || 'An unexpected error occurred during the import process.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Helper render methods
    const renderSearchBar = (value, setValue, placeholder) => (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.commonSearchInput}
                placeholder={placeholder}
                value={value}
                onChangeText={(text) => setValue(text)}
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
                mode="outlined"
            />
            <TouchableOpacity onPress={() => setValue('')} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
        </View>
    );

    const renderCategoryGrid = (categories, counts, countLabel, onPress) => (
        <ScrollView>
            <View style={styles.categoryContainer}>
                {categories.map((category, index) => (
                    <CategoryBoxComponent
                        key={index}
                        category={category}
                        count={category === 'All' ? products.length : counts[category] || 0}
                        countLabel={category === 'All' ? { singular: 'Product', plural: 'Products' } : countLabel}
                        onPress={() => onPress(category)} />
                ))}
            </View>
        </ScrollView>
    );

    const renderActionButtons = (onImport, products, onDeleteAll) => (
        <View style={styles.actionsRow}>
            <ImportButton onImport={onImport} style={[styles.actionButton, styles.importButton]} textStyle={styles.buttonText} />
            <ExportButton data={products} style={[styles.actionButton, styles.exportButton]} textStyle={styles.buttonText} />
            <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDeleteAll}>
                <Text style={styles.buttonText}>Delete All</Text>
            </TouchableOpacity>
        </View>
    );

    // Helpher render content
    const renderContent = () => {
        // If no category selected, show category grid
        if (!selectedCategory) {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                        {renderActionButtons(processImportedData, products, handleDeleteAll)}
                        {renderSearchBar(commonSearchTerm, setCommonSearchTerm, 'Search Products from whole file...')}
                        <View style={styles.totalProductsContainer}><Text style={[styles.totalProductsText]}>Total number of products: {products.length}</Text></View>
                        {!commonSearchTerm ?
                            renderCategoryGrid(
                                filteredCategories,
                                categorySubcategoryCountsBySize,
                                { singular: 'Category', plural: 'Categories' }, // Display "Categories" here
                                setSelectedCategory
                            )
                            :
                            <>
                                {/* <ScrollView> */}
                                <MobileTableComponent
                                    data={paginatedProducts}
                                    onEdit={handleProductEdit}
                                    onDelete={handleProductDelete}
                                    showEditButton={true}
                                />
                                {/* </ScrollView> */}
                                {renderPaginationControls()}
                            </>
                        }
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            );
        }

        if (selectedCategory === 'All') {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
                        <View style={styles.titleRow}>
                            <TouchableOpacity style={styles.backButton} onPress={() => setSelectedCategory(null)}>
                                <MaterialIcons name="arrow-back" size={24} color={styles.buttonText.color} />
                                <Text style={styles.buttonText}>Back to Categories</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>
                                Total Products: {filteredProducts.length}
                            </Text>
                        </View>
                        <MobileTableComponent data={paginatedProducts} onEdit={handleProductEdit} onDelete={handleProductDelete} />
                        {renderPaginationControls()}
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            );
        }

        if (!selectedSubCategory) {
            return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                        <View style={styles.titleRow}>
                            <TouchableOpacity style={styles.backButton} onPress={() => { setSelectedCategory(null), setSubSearchTerm('') }}>
                                <MaterialIcons name="arrow-back" size={24} color={styles.buttonText.color} />
                                <Text style={styles.buttonText}>Back to Categories</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>
                                Total Products: {filteredSubcategories.length}
                            </Text>
                        </View>

                        {renderSearchBar(subSearchTerm, setSubSearchTerm, 'Search subcategories...')}
                        {renderCategoryGrid(
                            filteredSubcategories,
                            subcategoryProductCounts,
                            { singular: 'Product', plural: 'Products' },
                            setSelectedSubCategory)}
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            );
        }

        // If category is selected, show products in mobile table
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                        <TouchableOpacity style={styles.backButton} onPress={() => { setSelectedSubCategory(null), setSearchTerm('') }}>
                            <MaterialIcons name="arrow-back" size={24} color={styles.buttonText.color} />
                            <Text style={styles.buttonText}>Back to Categories</Text>
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>
                            Total Products: {filteredProducts.length}
                        </Text>
                    </View>
                    {renderSearchBar(searchTerm, setSearchTerm, 'Search products...')}
                    <MobileTableComponent data={paginatedProducts} onEdit={handleProductEdit} onDelete={handleProductDelete} />
                    {renderPaginationControls()}
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        );
    };

    return renderContent();
};

export default ProductsContent;