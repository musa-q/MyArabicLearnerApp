import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Dimensions
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../types/navigation';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../utils/apiClient';
import MainPageLayout from '../../components/customComponents/MainPageLayout';
import { Colours, Typography } from '../../styles/shared';
import { ClashText } from '../../components/customComponents/ClashTexts';

const { width } = Dimensions.get('window');

type ProfileScreenNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;

interface QuizResult {
    quiz_id: string;
    category: string;
    score: number;
    total_questions: number;
    date_completed: string;
}

export default function UserProfile() {
    const { user, logout } = useAuth();
    const [results, setResults] = useState<QuizResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    const fetchResults = async () => {
        try {
            const response = await apiClient.post<{ completed_quizzes: QuizResult[] }>(
                '/quiz/get-completed-quizzes'
            );
            setResults(response.completed_quizzes);
        } catch (error) {
            console.error('Error fetching results:', error);
            Alert.alert('Error', 'Failed to load quiz results');
        }
    };

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            await fetchResults();
        } finally {
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetchResults().finally(() => setIsLoading(false));
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Logout',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };

    const renderRecentResults = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color={Colours.decorative.purple} />;
        }

        if (results.length === 0) {
            return (
                <View style={styles.noResults}>
                    <MaterialCommunityIcons
                        name="school-outline"
                        size={48}
                        color={Colours.decorative.copper}
                    />
                    <ClashText style={styles.noResultsText}>No quiz results yet</ClashText>
                </View>
            );
        }

        return results.slice(0, 3).map((result, index) => (
            <View key={result.quiz_id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                    <ClashText style={styles.categoryText}>{result.category}</ClashText>
                    <ClashText style={styles.dateText}>
                        {new Date(result.date_completed).toLocaleDateString()}
                    </ClashText>
                </View>
                <View style={styles.scoreContainer}>
                    <ClashText style={styles.scoreText}>
                        score: {result.score}/{result.total_questions}
                    </ClashText>
                    <ClashText style={styles.percentageText}>
                        ({((result.score / result.total_questions) * 100).toFixed(1)}%)
                    </ClashText>
                </View>
            </View>
        ));
    };

    return (
        <MainPageLayout refreshing={refreshing} onRefresh={handleRefresh}>
            <View style={styles.headerSection}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <MaterialCommunityIcons
                            name="account-circle"
                            size={80}
                            color={Colours.decorative.gold}
                        />
                    </View>
                    <ClashText style={styles.usernameText}>{user?.username}</ClashText>
                </View>
            </View>

            <View style={styles.statsSection}>
                <View style={styles.statCard}>
                    <MaterialCommunityIcons
                        name="school"
                        size={24}
                        color={Colours.decorative.purple}
                    />
                    <View style={styles.statInfo}>
                        <ClashText style={styles.statLabel}>learning streak</ClashText>
                        <ClashText style={styles.statValue}>7 days</ClashText>
                    </View>
                </View>

                <View style={styles.statCard}>
                    <MaterialCommunityIcons
                        name="star"
                        size={24}
                        color={Colours.decorative.teal}
                    />
                    <View style={styles.statInfo}>
                        <ClashText style={styles.statLabel}>average score</ClashText>
                        <ClashText style={styles.statValue}>85%</ClashText>
                    </View>
                </View>
            </View>

            <View style={styles.resultsSection}>
                <View style={styles.sectionHeader}>
                    <ClashText style={styles.sectionTitle}>recent results</ClashText>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('QuizResults')}
                        style={styles.viewAllButton}
                    >
                        <ClashText style={styles.viewAllText}>view all</ClashText>
                    </TouchableOpacity>
                </View>
                {renderRecentResults()}
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <MaterialCommunityIcons name="logout" size={24} color={Colours.text.inverse} />
                <ClashText style={styles.logoutText}>Logout</ClashText>
            </TouchableOpacity>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    headerSection: {
        alignItems: 'center',
        // paddingVertical: 20,
    },
    arabicTitle: {
        ...Typography.arabicRuqaaBold,
        fontSize: 60,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    profileHeader: {
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 10,
    },
    usernameText: {
        ...Typography.headingMedium,
        color: Colours.decorative.copper,
        fontSize: 24,
    },
    statsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    statCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        padding: 15,
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statInfo: {
        marginLeft: 10,
    },
    statLabel: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.secondary,
    },
    statValue: {
        ...Typography.headingMedium,
        fontSize: 20,
        color: Colours.text.primary,
    },
    resultsSection: {
        padding: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
    },
    viewAllButton: {
        padding: 8,
    },
    viewAllText: {
        ...Typography.body,
        color: Colours.decorative.purple,
        fontWeight: '500',
    },
    resultCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        padding: 15,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    categoryText: {
        ...Typography.headingMedium,
        fontSize: 16,
        color: Colours.text.primary,
    },
    dateText: {
        ...Typography.body,
        color: Colours.text.secondary,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
    },
    percentageText: {
        ...Typography.body,
        marginLeft: 8,
        color: Colours.decorative.teal,
    },
    noResults: {
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        ...Typography.body,
        marginTop: 10,
        color: Colours.text.secondary,
    },
    logoutButton: {
        backgroundColor: Colours.decorative.purple,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    logoutText: {
        ...Typography.body,
        color: Colours.text.inverse,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});