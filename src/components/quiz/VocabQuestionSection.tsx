import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../utils/apiClient';
import { capitaliseWords } from '../../utils/textUtils';

const INITIAL_TIME = 15;
const ERROR_MESSAGES = {
    NO_ANSWER: "Please provide an answer!",
    NETWORK_ERROR: "Network error occurred. Please try again.",
    LOAD_ERROR: "Error loading question. Please try again.",
    UNAUTHORIZED: "Your session has expired. Please login again.",
};

interface Props {
    quizId: string;
    categoryName: string | null;
    onBack: () => void;
}

export default function VocabQuestionSection({ quizId, categoryName, onBack }: Props) {
    const [quizState, setQuizState] = useState({
        currentQuestionId: null,
        currentQuestion: null,
        currentAnswer: "",
        hint: null,
        points: 0,
        streak: 0,
        timeRemaining: INITIAL_TIME,
    });

    const [uiState, setUiState] = useState({
        loading: true,
        isSubmitting: false,
        showHintButton: true,
        showNextButton: false,
        showResultsPage: false,
        revealAnswer: false,
        resultMessage: "",
        error: null as string | null,
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const startTimer = useCallback(() => {
        setQuizState(prev => ({ ...prev, timeRemaining: INITIAL_TIME }));

        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        timerRef.current = setInterval(() => {
            setQuizState(prev => {
                if (prev.timeRemaining <= 0) {
                    clearInterval(timerRef.current!);
                    handleTimeout();
                    return prev;
                }
                return { ...prev, timeRemaining: prev.timeRemaining - 1 };
            });
        }, 1000);
    }, []);

    const handleTimeout = async () => {
        try {
            await apiClient.post('/quiz/send-answer', {
                quiz_type: 'VocabQuiz',
                user_answer: '',
                question_id: quizState.currentQuestionId,
                time_remaining: 0,
                streak: 0,
                timeout: true
            });

            setUiState(prev => ({
                ...prev,
                resultMessage: "Time's up! ⏰",
                showNextButton: true,
                showHintButton: false
            }));
        } catch (error) {
            console.error('Error handling timeout:', error);
        }
    };

    const checkAnswer = async () => {
        if (uiState.isSubmitting || quizState.timeRemaining === 0) return;

        if (!quizState.currentAnswer?.trim()) {
            setUiState(prev => ({ ...prev, resultMessage: ERROR_MESSAGES.NO_ANSWER }));
            return;
        }

        try {
            setUiState(prev => ({ ...prev, isSubmitting: true }));
            if (timerRef.current) clearInterval(timerRef.current);

            const response = await apiClient.post('/quiz/send-answer', {
                quiz_type: 'VocabQuiz',
                user_answer: quizState.currentAnswer.trim().toLowerCase(),
                question_id: quizState.currentQuestionId,
                time_remaining: quizState.timeRemaining,
                streak: quizState.streak,
            });

            if (response.answer_response && response.points) {
                setQuizState(prev => ({
                    ...prev,
                    points: prev.points + response.points,
                    streak: prev.streak + 1,
                }));
                setUiState(prev => ({
                    ...prev,
                    resultMessage: `Correct! 🎉 +${response.points} points`,
                    showNextButton: true,
                    showHintButton: false,
                }));
            } else {
                setQuizState(prev => ({
                    ...prev,
                    streak: 0,
                    points: prev.points + response.points,
                }));
                setUiState(prev => ({
                    ...prev,
                    resultMessage: `Incorrect! ${response.points}`,
                    showNextButton: true,
                }));
            }
        } catch (error) {
            setUiState(prev => ({
                ...prev,
                error: ERROR_MESSAGES.NETWORK_ERROR,
            }));
        } finally {
            setUiState(prev => ({ ...prev, isSubmitting: false }));
        }
    };

    const getNextQuestion = async () => {
        try {
            setUiState(prev => ({ ...prev, loading: true, error: null }));

            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                })
            ]).start();

            const response = await apiClient.post('/quiz/get-next-question', {
                quiz_type: 'VocabQuiz',
                quiz_id: quizId
            });

            if (response.all_answered) {
                setUiState(prev => ({
                    ...prev,
                    showResultsPage: true,
                    loading: false
                }));
                return;
            }

            setQuizState(prev => ({
                ...prev,
                currentQuestionId: response.question.question_id,
                currentQuestion: response.question.english,
                hint: response.hint,
                currentAnswer: "",
                timeRemaining: INITIAL_TIME,
            }));

            setUiState(prev => ({
                ...prev,
                loading: false,
                resultMessage: "",
                showHintButton: true,
                revealAnswer: false,
                showNextButton: false,
                isSubmitting: false,
                error: null
            }));

            startTimer();
        } catch (error) {
            setUiState(prev => ({
                ...prev,
                loading: false,
                error: ERROR_MESSAGES.LOAD_ERROR,
                showHintButton: false,
                showNextButton: false
            }));
        }
    };

    useEffect(() => {
        getNextQuestion();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    if (uiState.loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    if (uiState.showResultsPage) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.resultTitle}>Quiz Complete! 🎉</Text>
                <Text style={styles.resultScore}>Final Score: {quizState.points}</Text>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#6200ee" />
                    <Text style={styles.backButtonText}>Back to Categories</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <Ionicons name="arrow-back" size={24} color="#6200ee" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {categoryName ? capitaliseWords(categoryName) : 'Vocabulary Quiz'}
                </Text>
            </View>

            <View style={styles.scoreContainer}>
                <Text style={styles.scoreText}>Points: {quizState.points}</Text>
                <View style={styles.timerContainer}>
                    <View style={[
                        styles.timerBar,
                        { width: `${(quizState.timeRemaining / INITIAL_TIME) * 100}%` },
                        quizState.timeRemaining <= 5 && styles.timerWarning
                    ]} />
                </View>
                <Text style={styles.scoreText}>Streak: {quizState.streak}</Text>
            </View>

            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                <View style={styles.cardHeader}>
                    <Ionicons name="book-outline" size={24} color="#6200ee" />
                    <Text style={styles.cardHeaderText}>Current Question</Text>
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.questionText}>
                        {capitaliseWords(quizState.currentQuestion ?? '')}
                    </Text>

                    <TextInput
                        style={styles.input}
                        value={quizState.currentAnswer}
                        onChangeText={(text) => setQuizState(prev => ({ ...prev, currentAnswer: text }))}
                        placeholder="Type your answer here..."
                        placeholderTextColor="#666"
                    />

                    <View style={styles.buttonContainer}>
                        {uiState.showNextButton ? (
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={getNextQuestion}
                                disabled={uiState.isSubmitting}
                            >
                                <Text style={styles.buttonText}>Next Question</Text>
                                <Ionicons name="arrow-forward" size={20} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={checkAnswer}
                                disabled={uiState.isSubmitting}
                            >
                                <Text style={styles.buttonText}>Check Answer</Text>
                                <Ionicons name="checkmark-circle" size={20} color="white" />
                            </TouchableOpacity>
                        )}

                        {uiState.showHintButton && (
                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={() => setUiState(prev => ({ ...prev, revealAnswer: !prev.revealAnswer }))}
                            >
                                <Ionicons name="help-circle" size={20} color="#6200ee" />
                                <Text style={styles.secondaryButtonText}>
                                    {uiState.revealAnswer ? 'Hide Answer' : 'Show Answer'}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {uiState.resultMessage && (
                        <View style={[
                            styles.resultContainer,
                            {
                                backgroundColor: uiState.resultMessage.includes("Correct")
                                    ? "rgba(34, 197, 94, 0.2)"
                                    : "rgba(239, 68, 68, 0.2)"
                            }
                        ]}>
                            <Text style={[
                                styles.resultText,
                                {
                                    color: uiState.resultMessage.includes("Correct")
                                        ? "#22c55e"
                                        : "#ef4444"
                                }
                            ]}>
                                {uiState.resultMessage}
                            </Text>
                        </View>
                    )}

                    {uiState.revealAnswer && (
                        <View style={styles.hintContainer}>
                            <Text style={styles.hintLabel}>Answer: </Text>
                            <Text style={styles.hintText}>{quizState.hint}</Text>
                        </View>
                    )}
                </View>
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        marginRight: 10,
    },
    backButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#6200ee',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    scoreText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    timerContainer: {
        flex: 1,
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginHorizontal: 12,
        overflow: 'hidden',
    },
    timerBar: {
        height: '100%',
        backgroundColor: '#6200ee',
        borderRadius: 4,
    },
    timerWarning: {
        backgroundColor: '#ef4444',
    },
    card: {
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
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    cardHeaderText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    cardContent: {
        padding: 20,
        alignItems: 'center',
    },
    questionText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        gap: 12,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#6200ee',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#6200ee',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#6200ee',
        fontSize: 16,
        fontWeight: '600',
    },
    resultContainer: {
        width: '100%',
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    resultText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    hintContainer: {
        width: '100%',
        marginTop: 20,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        alignItems: 'center',
    },
    hintLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    hintText: {
        fontSize: 20,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    resultScore: {
        fontSize: 20,
        color: '#6200ee',
        marginBottom: 24,
    },
});