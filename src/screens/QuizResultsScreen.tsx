import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../utils/apiClient';

interface QuizResult {
    quiz_id: string;
    category: string;
    quiz_type: 'VocabQuiz' | 'VerbConjugationQuiz';
    score: number;
    total_questions: number;
    date_completed: string;
    total_points: number;
}

interface QuizDetailsResponse {
    success: boolean;
    user_id: string;
    quiz_type: string;
    quiz_data: {
        score: number;
        total_questions: number;
        total_points: number;
        questions: Array<{
            english: string;
            arabic: string;
            correct_answer: string;
            user_answer: string;
            is_correct: boolean;
            points: number;
        }>;
    };
}

export default function QuizResultsScreen() {
    const [results, setResults] = useState<QuizResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedType, setSelectedType] = useState<'all' | 'VocabQuiz' | 'VerbConjugationQuiz'>('all');

    const fetchResults = async () => {
        try {
            const response = await apiClient.post<{ completed_quizzes: QuizResult[] }>(
                '/quiz/get-completed-quizzes',
                { quiz_type: selectedType === 'all' ? undefined : selectedType }
            );
            setResults(response.completed_quizzes);
        } catch (error) {
            console.error('Error fetching results:', error);
            Alert.alert('Error', 'Failed to load quiz results');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchResults();
    }, [selectedType]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchResults();
    };

    const viewQuizDetails = async (quizId: string, quizType: string) => {
        try {
            const response = await apiClient.post<QuizDetailsResponse>(
                '/quiz/get-quiz-details',
                {
                    quiz_id: quizId,
                    quiz_type: quizType
                }
            );

            const quizData = response.quiz_data;
            const questionsText = quizData.questions
                .map((q: QuizDetailsResponse['quiz_data']['questions'][number], index: number) =>
                    `Q${index + 1}: ${q.english}\n` +
                    `Answer: ${q.correct_answer}\n` +
                    `Your Answer: ${q.user_answer || 'Not answered'}\n` +
                    `Points: ${q.points}`
                )
                .join('\n\n');

            Alert.alert(
                'Quiz Details',
                `Score: ${quizData.score}/${quizData.total_questions}\n` +
                `Total Points: ${quizData.total_points}\n\n` +
                `Questions:\n${questionsText}`,
                [{ text: 'Close', style: 'cancel' }]
            );
        } catch (error) {
            console.error('Error fetching quiz details here:', error);
            Alert.alert(
                'Error',
                'Failed to load quiz details. Please try again.'
            );
        }
    };

    const renderFilterButtons = () => (
        <View style={styles.filterContainer}>
            <TouchableOpacity
                style={[styles.filterButton, selectedType === 'all' && styles.filterButtonActive]}
                onPress={() => setSelectedType('all')}
            >
                <Text style={[styles.filterText, selectedType === 'all' && styles.filterTextActive]}>
                    All
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, selectedType === 'VocabQuiz' && styles.filterButtonActive]}
                onPress={() => setSelectedType('VocabQuiz')}
            >
                <Text style={[styles.filterText, selectedType === 'VocabQuiz' && styles.filterTextActive]}>
                    Vocabulary
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, selectedType === 'VerbConjugationQuiz' && styles.filterButtonActive]}
                onPress={() => setSelectedType('VerbConjugationQuiz')}
            >
                <Text style={[styles.filterText, selectedType === 'VerbConjugationQuiz' && styles.filterTextActive]}>
                    Verbs
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderQuizResult = ({ item }: { item: QuizResult }) => (
        <TouchableOpacity
            style={styles.resultCard}
            onPress={() => {
                viewQuizDetails(item.quiz_id, item.quiz_type);
            }}
        >
            <View style={styles.resultHeader}>
                <Text style={styles.categoryText}>{item.category}</Text>
                <Text style={styles.dateText}>
                    {new Date(item.date_completed).toLocaleDateString()}
                </Text>
            </View>

            <View style={styles.resultDetails}>
                <View style={styles.scoreContainer}>
                    <Ionicons name="school-outline" size={20} color="#6200ee" />
                    <Text style={styles.scoreText}>
                        {item.score}/{item.total_questions}
                    </Text>
                    <Text style={styles.percentageText}>
                        ({((item.score / item.total_questions) * 100).toFixed(1)}%)
                    </Text>
                </View>

                <View style={styles.pointsContainer}>
                    <Ionicons name="star-outline" size={20} color="#ffd700" />
                    <Text style={styles.pointsText}>{item.total_points} points</Text>
                </View>
            </View>

            <View style={styles.quizTypeContainer}>
                <Text style={styles.quizTypeText}>
                    {item.quiz_type === 'VocabQuiz' ? 'Vocabulary' : 'Verb Conjugation'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {renderFilterButtons()}

            <FlatList
                data={results}
                renderItem={renderQuizResult}
                keyExtractor={(item) => item.quiz_id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#6200ee']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="document-text-outline" size={48} color="#666" />
                        <Text style={styles.emptyText}>No quiz results found</Text>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    filterButton: {
        flex: 1,
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: '#6200ee',
    },
    filterText: {
        color: '#666',
        fontSize: 14,
    },
    filterTextActive: {
        color: 'white',
    },
    listContainer: {
        padding: 15,
    },
    resultCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    categoryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    dateText: {
        color: '#666',
        fontSize: 14,
    },
    resultDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    scoreText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 5,
    },
    percentageText: {
        color: '#666',
        fontSize: 14,
        marginLeft: 5,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointsText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 5,
    },
    quizTypeContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
        marginTop: 5,
    },
    quizTypeText: {
        color: '#666',
        fontSize: 14,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 10,
        color: '#666',
        fontSize: 16,
    },
});