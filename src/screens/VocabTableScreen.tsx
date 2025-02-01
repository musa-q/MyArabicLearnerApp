import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../utils/apiClient';
import { capitaliseWords } from '../utils/textUtils';

interface Category {
    id: string;
    category_name: string;
}

interface Word {
    english: string;
    arabic: string;
    transliteration: string;
}

export default function VocabTableScreen() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [words, setWords] = useState<Word[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.post('/flashcards/get-all-category-names');
            setCategories(response);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to load categories');
            setIsLoading(false);
        }
    };

    const fetchWords = async (categoryId: string) => {
        try {
            setIsLoading(true);
            const response = await apiClient.post('/flashcards/get-category-flashcards', {
                category_id: categoryId,
            });
            setWords(response.words);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching words:', error);
            setError('Failed to load words');
            setIsLoading(false);
        }
    };

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setIsDropdownVisible(false);
        fetchWords(category.id);
    };

    const renderCategoryItem = ({ item }: { item: Category }) => (
        <TouchableOpacity
            style={[
                styles.dropdownItem,
                selectedCategory?.id === item.id && styles.dropdownItemSelected
            ]}
            onPress={() => handleCategorySelect(item)}
        >
            <Text style={[
                styles.dropdownItemText,
                selectedCategory?.id === item.id && styles.dropdownItemTextSelected
            ]}>
                {capitaliseWords(item.category_name)}
            </Text>
            {selectedCategory?.id === item.id && (
                <Ionicons name="checkmark" size={20} color="#6200ee" />
            )}
        </TouchableOpacity>
    );

    if (isLoading && !words.length) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vocabulary Visualiser</Text>

            {/* Custom Dropdown */}
            <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setIsDropdownVisible(true)}
            >
                <Text style={styles.dropdownButtonText}>
                    {selectedCategory
                        ? capitaliseWords(selectedCategory.category_name)
                        : 'Choose a Category'}
                </Text>
                <Ionicons
                    name={isDropdownVisible ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#6200ee"
                />
            </TouchableOpacity>

            {/* Dropdown Modal */}
            <Modal
                visible={isDropdownVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setIsDropdownVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setIsDropdownVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderText}>Select Category</Text>
                            <TouchableOpacity
                                onPress={() => setIsDropdownVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={categories}
                            renderItem={renderCategoryItem}
                            keyExtractor={(item) => item.id}
                            style={styles.dropdownList}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View style={styles.separator} />}
                        />
                    </View>
                </TouchableOpacity>
            </Modal>

            <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>English</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Arabic</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Transliteration</Text>
                    </View>
                </View>

                <ScrollView style={styles.tableBody}>
                    {words.length > 0 ? (
                        words.map((word, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.tableRow,
                                    index % 2 === 0 ? styles.evenRow : styles.oddRow
                                ]}
                            >
                                <View style={styles.cell}>
                                    <Text style={styles.englishText}>
                                        {capitaliseWords(word.english)}
                                    </Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.arabicText}>{word.arabic}</Text>
                                </View>
                                <View style={styles.cell}>
                                    <Text style={styles.translitText}>
                                        {word.transliteration}
                                    </Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons
                                name="book-outline"
                                size={48}
                                color="#6200ee"
                                style={styles.emptyIcon}
                            />
                            <Text style={styles.emptyText}>
                                Choose a category to view words
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    // Container Styles
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    // Header Styles
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ee',
        textAlign: 'center',
        marginBottom: 20,
    },

    // Dropdown Button Styles
    dropdownButton: {
        height: 50,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dropdownButtonText: {
        fontSize: 16,
        color: '#333',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    closeButton: {
        padding: 4,
    },

    // Dropdown List Styles
    dropdownList: {
        padding: 8,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 8,
    },
    dropdownItemSelected: {
        backgroundColor: '#f0e6ff',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
    },
    dropdownItemTextSelected: {
        color: '#6200ee',
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
    },

    // Table Card Styles
    tableCard: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },

    // Table Body Styles
    tableBody: {
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    evenRow: {
        backgroundColor: '#f8f9fa',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    englishText: {
        fontSize: 14,
        color: '#333',
    },
    arabicText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        fontFamily: 'System',  // You might want to use a specific Arabic font here
    },
    translitText: {
        fontSize: 14,
        color: '#666',
    },

    // Empty State Styles
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },

    // Loading State Styles
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },

    // Error State Styles
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 8,
    },
    retryButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#6200ee',
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    }
});