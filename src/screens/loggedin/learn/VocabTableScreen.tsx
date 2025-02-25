import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../../utils/apiClient';
import { capitaliseWords } from '../../../utils/textUtils';
import { ClashText } from '../../../components/customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../../styles/shared';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';

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
            <ClashText style={[
                styles.dropdownItemText,
                selectedCategory?.id === item.id ? styles.dropdownItemTextSelected : {}
            ]}>
                {item.category_name.toLowerCase()}
            </ClashText>
            {selectedCategory?.id === item.id && (
                <MaterialCommunityIcons name="check" size={20} color={Colours.decorative.purple} />
            )}
        </TouchableOpacity>
    );

    if (isLoading && !words.length) {
        return (
            <MainPageLayout>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colours.decorative.purple} />
                </View>
            </MainPageLayout>
        );
    }

    return (
        <MainPageLayout>
            <View style={styles.container}>
                <ClashText style={styles.title}>vocabulary visualiser</ClashText>

                {/* Custom Dropdown */}
                <TouchableOpacity
                    style={styles.dropdownButton}
                    onPress={() => setIsDropdownVisible(true)}
                >
                    <ClashText style={styles.dropdownButtonText}>
                        {selectedCategory
                            ? selectedCategory.category_name.toLowerCase()
                            : 'choose a category'}
                    </ClashText>
                    <MaterialCommunityIcons
                        name={isDropdownVisible ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={Colours.decorative.purple}
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
                                <ClashText style={styles.modalHeaderText}>select category</ClashText>
                                <TouchableOpacity
                                    onPress={() => setIsDropdownVisible(false)}
                                    style={styles.closeButton}
                                >
                                    <MaterialCommunityIcons name="close" size={24} color={Colours.text.primary} />
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
                            <ClashText style={styles.headerText}>english</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>arabic</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>transliteration</ClashText>
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
                                        <ClashText style={styles.englishText}>
                                            {word.english.toLowerCase()}
                                        </ClashText>
                                    </View>
                                    <View style={styles.cell}>
                                        <ClashText style={styles.arabicText}>{word.arabic}</ClashText>
                                    </View>
                                    <View style={styles.cell}>
                                        <ClashText style={styles.translitText}>
                                            {word.transliteration}
                                        </ClashText>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <MaterialCommunityIcons
                                    name="book-outline"
                                    size={48}
                                    color={Colours.decorative.purple}
                                    style={styles.emptyIcon}
                                />
                                <ClashText style={styles.emptyText}>
                                    choose a category to view words
                                </ClashText>
                            </View>
                        )}
                    </ScrollView>
                </View>
            </View>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginBottom: 20,
    },
    dropdownButton: {
        height: 50,
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dropdownButtonText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: Colours.surface,
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
        borderBottomColor: Colours.secondary,
    },
    modalHeaderText: {
        ...Typography.headingMedium,
        fontSize: 18,
        color: Colours.text.primary,
    },
    closeButton: {
        padding: 4,
    },
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
        backgroundColor: 'rgba(167, 139, 250, 0.1)',
    },
    dropdownItemText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
    },
    dropdownItemTextSelected: {
        color: Colours.decorative.purple,
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: Colours.secondary,
        opacity: 0.2,
    },
    tableCard: {
        flex: 1,
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colours.decorative.purple,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        color: Colours.text.inverse,
        fontSize: 16,
        fontWeight: '600',
    },
    tableBody: {
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
    },
    evenRow: {
        backgroundColor: 'rgba(245, 240, 230, 0.5)',
    },
    oddRow: {
        backgroundColor: Colours.surface,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    englishText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.primary,
    },
    arabicText: {
        ...Typography.arabic,
        fontSize: 18,
        color: Colours.text.primary,
        textAlign: 'center',
    },
    translitText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.decorative.copper,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyIcon: {
        marginBottom: 12,
    },
    emptyText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.secondary,
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body,
        marginTop: 12,
        fontSize: 16,
        color: Colours.text.secondary,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        ...Typography.body,
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 8,
    },
    retryButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: Colours.decorative.purple,
        borderRadius: 30,
    },
    retryButtonText: {
        color: Colours.text.inverse,
        fontSize: 16,
        fontWeight: '600',
    }
});