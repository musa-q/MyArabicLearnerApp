import React, { useState, useEffect, useMemo } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../utils/apiClient';
import { capitaliseWords } from '../utils/textUtils';
import { ClashText, ClashTextInput } from '../components/customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../styles/shared';
import MainPageLayout from './customComponents/MainPageLayout';

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
                <ActivityIndicator size="large" color={Colours.decorative.purple} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentSection}>
                <ClashText style={styles.title}>
                    choose a topic
                </ClashText>
            </View>

            <View style={styles.searchContainer}>
                <TouchableOpacity
                    onPress={() => setShowSearch(!showSearch)}
                    style={styles.searchIcon}
                >
                    <MaterialCommunityIcons name="magnify" size={24} color={Colours.decorative.purple} />
                </TouchableOpacity>
                {showSearch && (
                    <ClashTextInput
                        style={styles.searchInput}
                        placeholder="search categories..."
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
                                setCategoryName(category.category_name.toLowerCase());
                            }}
                        />
                    ))
                ) : selectedGroup ? (
                    <>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => setSelectedGroup(null)}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={24} color={Colours.decorative.purple} />
                            <ClashText style={styles.backButtonText}>back to groups</ClashText>
                        </TouchableOpacity>
                        {groupedCategories[selectedGroup]?.map((category) => (
                            <CategoryCard
                                key={category.id}
                                category={category}
                                onSelect={() => {
                                    onChoose(category.id);
                                    setCategoryName(category.category_name.toLowerCase());
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
                            <ClashText style={styles.groupTitle}>
                                {group.toLowerCase()}
                            </ClashText>
                            <ClashText style={styles.groupCount}>
                                {groupCategories.length} categories
                            </ClashText>
                        </TouchableOpacity>
                    ))
                )}
            </View>
        </View>
    );
}

function CategoryCard({ category, onSelect }: {
    category: Category;
    onSelect: () => void;
}) {
    return (
        <TouchableOpacity style={styles.categoryCard} onPress={onSelect}>
            <MaterialCommunityIcons name="book-outline" size={24} color={Colours.decorative.purple} />
            <ClashText style={styles.categoryText}>
                {category.category_name.toLowerCase()}
            </ClashText>
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
    contentSection: {
        marginBottom: 30,
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 10,
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
        ...ComponentStyles.input,
        flex: 1,
        marginLeft: 10,
    },
    categoriesContainer: {
        gap: 10,
    },
    categoryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: Colours.surface,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    categoryText: {
        ...Typography.body,
        marginLeft: 10,
        fontSize: 16,
        color: Colours.text.primary,
    },
    groupCard: {
        padding: 15,
        backgroundColor: Colours.surface,
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    groupTitle: {
        ...Typography.headingMedium,
        fontSize: 20,
        color: Colours.text.primary,
    },
    groupCount: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.secondary,
        marginTop: 5,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginBottom: 20,
    },
    backButtonText: {
        ...Typography.body,
        marginLeft: 10,
        fontSize: 16,
        color: Colours.decorative.purple,
    },
});