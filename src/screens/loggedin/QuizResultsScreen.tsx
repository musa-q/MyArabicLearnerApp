import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Alert,
    RefreshControl,
    Platform,
    StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../utils/apiClient';
import { ClashText } from '../../components/customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../styles/shared';
import MainPageLayout from '../../components/customComponents/MainPageLayout';
import SharedBackground from '../../components/customComponents/SharedBackground';
import { BlurView } from 'expo-blur';

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
                <ClashText style={[styles.filterText, selectedType === 'all' && styles.filterTextActive]}>
                    all
                </ClashText>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, selectedType === 'VocabQuiz' && styles.filterButtonActive]}
                onPress={() => setSelectedType('VocabQuiz')}
            >
                <ClashText style={[styles.filterText, selectedType === 'VocabQuiz' && styles.filterTextActive]}>
                    vocabulary
                </ClashText>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.filterButton, selectedType === 'VerbConjugationQuiz' && styles.filterButtonActive]}
                onPress={() => setSelectedType('VerbConjugationQuiz')}
            >
                <ClashText style={[styles.filterText, selectedType === 'VerbConjugationQuiz' && styles.filterTextActive]}>
                    verbs
                </ClashText>
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
                <ClashText style={styles.categoryText}>{item.category}</ClashText>
                <ClashText style={styles.dateText}>
                    {new Date(item.date_completed).toLocaleDateString()}
                </ClashText>
            </View>

            <View style={styles.resultDetails}>
                <View style={styles.scoreContainer}>
                    <MaterialCommunityIcons name="school-outline" size={20} color={Colours.decorative.purple} />
                    <ClashText style={styles.scoreText}>
                        {item.score}/{item.total_questions}
                    </ClashText>
                    <ClashText style={styles.percentageText}>
                        ({((item.score / item.total_questions) * 100).toFixed(1)}%)
                    </ClashText>
                </View>

                <View style={styles.pointsContainer}>
                    <MaterialCommunityIcons name="star-outline" size={20} color={Colours.decorative.gold} />
                    <ClashText style={styles.pointsText}>{item.total_points} points</ClashText>
                </View>
            </View>

            <View style={styles.quizTypeContainer}>
                <ClashText style={styles.quizTypeText}>
                    {item.quiz_type === 'VocabQuiz' ? 'vocabulary' : 'verb conjugation'}
                </ClashText>
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <MainPageLayout>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colours.decorative.purple} />
                </View>
            </MainPageLayout>
        );
    }

    return (
        <SharedBackground style={styles.mainContainer}>
            <BlurView
                intensity={3}
                tint="light"
                style={StyleSheet.absoluteFill}
            />
            <View style={styles.headerContainer}>
                <ClashText style={styles.title}>quiz results</ClashText>
                {renderFilterButtons()}
            </View>

            <FlatList
                data={results}
                renderItem={renderQuizResult}
                keyExtractor={(item) => item.quiz_id}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colours.decorative.purple]}
                        tintColor={Colours.decorative.purple}
                    />
                }
                ListHeaderComponent={<View style={styles.listHeaderSpace} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="file-document-outline" size={48} color={Colours.text.secondary} />
                        <ClashText style={styles.emptyText}>no quiz results found</ClashText>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
            />
        </SharedBackground>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colours.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    headerContainer: {
        paddingTop: 50,
        // paddingBottom: 10,
        // backgroundColor: Colours.background,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    listHeaderSpace: {
        height: 10,
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginVertical: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        padding: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: Colours.surface,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    filterButton: {
        flex: 1,
        padding: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: 'transparent',
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: Colours.decorative.purple,
    },
    filterText: {
        ...Typography.body,
        color: Colours.text.secondary,
        fontSize: 14,
    },
    filterTextActive: {
        color: Colours.text.inverse,
    },
    listContainer: {
        padding: 15,
    },
    resultCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        padding: 15,
        marginBottom: 15,
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
        marginBottom: 10,
    },
    categoryText: {
        ...Typography.headingMedium,
        fontSize: 16,
        color: Colours.text.primary,
    },
    dateText: {
        ...Typography.body,
        color: Colours.text.secondary,
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
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
        marginLeft: 5,
    },
    percentageText: {
        ...Typography.body,
        color: Colours.decorative.teal,
        fontSize: 14,
        marginLeft: 5,
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pointsText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.decorative.copper,
        marginLeft: 5,
    },
    quizTypeContainer: {
        borderTopWidth: 1,
        borderTopColor: Colours.secondary,
        borderTopOpacity: 0.2,
        paddingTop: 10,
        marginTop: 5,
    },
    quizTypeText: {
        ...Typography.body,
        color: Colours.text.secondary,
        fontSize: 14,
        fontStyle: 'italic',
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        ...Typography.body,
        marginTop: 10,
        color: Colours.text.secondary,
        fontSize: 16,
    },
});