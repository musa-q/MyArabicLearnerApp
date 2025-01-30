import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../utils/apiClient';

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
    const navigation = useNavigation<ProfileScreenNavigationProp>();

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.post<{ completed_quizzes: QuizResult[] }>(
                '/quiz/get-completed-quizzes'
            );
            setResults(response.completed_quizzes);
        } catch (error) {
            console.error('Error fetching results:', error);
            Alert.alert('Error', 'Failed to load quiz results');
        } finally {
            setIsLoading(false);
        }
    };

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
            return <ActivityIndicator size="large" color="#6200ee" />;
        }

        if (results.length === 0) {
            return (
                <View style={styles.noResults}>
                    <Ionicons name="school-outline" size={48} color="#666" />
                    <Text style={styles.noResultsText}>No quiz results yet</Text>
                </View>
            );
        }

        return results.slice(0, 5).map((result, index) => (
            <View key={result.quiz_id} style={styles.resultCard}>
                <View style={styles.resultHeader}>
                    <Text style={styles.categoryText}>{result.category}</Text>
                    <Text style={styles.dateText}>
                        {new Date(result.date_completed).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>
                        Score: {result.score}/{result.total_questions}
                    </Text>
                    <Text style={styles.percentageText}>
                        ({((result.score / result.total_questions) * 100).toFixed(1)}%)
                    </Text>
                </View>
            </View>
        ));
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="person-circle-outline" size={80} color="#6200ee" />
                <Text style={styles.emailText}>{user?.email}</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Results</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('QuizResults')}
                        style={styles.viewAllButton}
                    >
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>
                {renderRecentResults()}
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Ionicons name="log-out-outline" size={24} color="white" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: 'white',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    emailText: {
        fontSize: 18,
        marginTop: 10,
        color: '#333',
    },
    section: {
        margin: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    viewAllButton: {
        padding: 8,
    },
    viewAllText: {
        color: '#6200ee',
        fontSize: 14,
    },
    resultCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    dateText: {
        color: '#666',
        fontSize: 14,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 16,
        color: '#333',
    },
    percentageText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        margin: 15,
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    noResults: {
        alignItems: 'center',
        padding: 20,
    },
    noResultsText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
});