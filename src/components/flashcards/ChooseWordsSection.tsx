import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../utils/apiClient';
import { capitaliseWords } from '../../utils/textUtils';

interface Category {
    id: string;
    category_name: string;
}

interface Props {
    onChoose: (id: string) => void;
    setCategoryName: (name: string) => void;
}

export function ChooseWordsSection({ onChoose, setCategoryName }: Props) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showSearch, setShowSearch] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    const groupedCategories = useMemo(() => {
        const groups: Record<string, Category[]> = {};
        categories.forEach(category => {
            const mainCategory = category.category_name.split(':')[0].trim();
            if (!groups[mainCategory]) {
                groups[mainCategory] = [];
            }
            groups[mainCategory].push(category);
        });
        return groups;
    }, [categories]);

    const filteredCategories = useMemo(() => {
        if (!searchQuery) return categories;
        return categories.filter(category =>
            category.category_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [categories, searchQuery]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await apiClient.post<{ categories: Category[] }>(
                '/flashcards/get-all-category-names'
            );
            setCategories(response);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Flashcards</Text>

            <View style={styles.searchContainer}>
                <TouchableOpacity
                    onPress={() => setShowSearch(!showSearch)}
                    style={styles.searchIcon}
                >
                    <Ionicons name="search" size={24} color="#6200ee" />
                </TouchableOpacity>
                {showSearch && (
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                )}
            </View>

            <View style={styles.categoriesContainer}>
                {searchQuery ? (
                    filteredCategories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            onSelect={() => {
                                onChoose(category.id);
                                setCategoryName(category.category_name);
                            }}
                        />
                    ))
                ) : selectedGroup ? (
                    <>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setSelectedGroup(null)}
                        >
                            <Ionicons name="arrow-back" size={24} color="#6200ee" />
                            <Text style={styles.backButtonText}>Back to groups</Text>
                        </TouchableOpacity>
                        {groupedCategories[selectedGroup]?.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onSelect={() => {
                                    onChoose(category.id);
                                    setCategoryName(category.category_name);
                                }}
                            />
                        ))}
                    </>
                ) : (
                    Object.entries(groupedCategories).map(([group, groupCategories]) => (
                        <TouchableOpacity
                            key={group}
                            style={styles.groupCard}
                            onPress={() => setSelectedGroup(group)}
                        >
                            <Text style={styles.groupTitle}>
                                {capitaliseWords(group)}
                            </Text>
                            <Text style={styles.groupCount}>
                                {groupCategories.length} categories
                            </Text>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </ScrollView>
    );
}

function CategoryCard({ category, onSelect }: {
    category: Category;
    onSelect: () => void;
}) {
    return (
        <TouchableOpacity style={styles.categoryCard} onPress={onSelect}>
            <Ionicons name="book-outline" size={24} color="#6200ee" />
            <Text style={styles.categoryText}>
                {capitaliseWords(category.category_name)}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#6200ee',
        textAlign: 'center',
        marginBottom: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    searchIcon: {
        padding: 10,
    },
    searchInput: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginLeft: 10,
    },
    categoriesContainer: {
        gap: 10,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    categoryText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    groupCard: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    groupTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    groupCount: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
    },
    backButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#6200ee',
    },
});
