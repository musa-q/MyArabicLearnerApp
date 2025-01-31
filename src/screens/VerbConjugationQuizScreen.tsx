import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../utils/apiClient';
import { capitaliseWords } from '../utils/textUtils';

const INITIAL_TIME = 15;
const ERROR_MESSAGES = {
    NO_ANSWER: "Please provide an answer!",
    NETWORK_ERROR: "Network error occurred. Please try again.",
    LOAD_ERROR: "Error loading question. Please try again.",
    UNAUTHORIZED: "Your session has expired. Please login again.",
};

interface QuizState {
    currentQuestionId: string | null;
    currentConjugation: {
        word: {
            english: string;
            arabic: string;
        };
        tense: string;
        pronoun: string;
    } | null;
    currentAnswer: string;
    hint: string | null;
    points: number;
    streak: number;
    timeRemaining: number;
}

interface UIState {
    loading: boolean;
    isSubmitting: boolean;
    showHintButton: boolean;
    showNextButton: boolean;
    showResultsPage: boolean;
    revealAnswer: boolean;
    resultMessage: string;
    error: string | null;
}

export default function VerbConjugationQuizScreen() {
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestionId: null,
        currentConjugation: null,
        currentAnswer: "",
        hint: null,
        points: 0,
        streak: 0,
        timeRemaining: INITIAL_TIME,
    });

    const [uiState, setUiState] = useState<UIState>({
        loading: true,
        isSubmitting: false,
        showHintButton: true,
        showNextButton: false,
        showResultsPage: false,
        revealAnswer: false,
        resultMessage: "",
        error: null,
    });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        createQuiz();
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const createQuiz = async () => {
        try {
            const response = await apiClient.post('/quiz/create-verb-conjugation-quiz', {});
            if (response.quiz_id) {
                getNextQuestion();
            }
        } catch (error) {
            setUiState(prev => ({
                ...prev,
                loading: false,
                error: ERROR_MESSAGES.LOAD_ERROR
            }));
        }
    };

    const startTimer = () => {
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
    };

    const handleTimeout = async () => {
        try {
            await apiClient.post('/quiz/send-answer', {
                quiz_type: 'VerbConjugationQuiz',
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
                quiz_type: 'VerbConjugationQuiz',
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

            const response = await apiClient.post('/quiz/get-next-question', {
                quiz_type: 'VerbConjugationQuiz'
            });

            if (response.all_answered) {
                setUiState(prev => ({
                    ...prev,
                    showResultsPage: true,
                    loading: false
                }));
                return;
            }

            const { question, hint } = response;
            const { english_verb, arabic_verb, tense, pronoun, question_id } = question;

            setQuizState(prev => ({
                ...prev,
                currentQuestionId: question_id,
                currentConjugation: {
                    word: { english: english_verb, arabic: arabic_verb },
                    tense,
                    pronoun,
                },
                hint,
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

    if (uiState.loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    if (uiState.showResultsPage) {
        // Navigate to results page or show results component
        return (
            <View style={styles.centerContainer}>
                <Text>Quiz Complete!</Text>
                <Text>Final Score: {quizState.points}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Verb Conjugation Practice</Text>
                <Text style={styles.subtitle}>
                    Conjugate the verb correctly based on the pronoun and tense
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

            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="book-outline" size={24} color="#6200ee" />
                    <Text style={styles.cardHeaderText}>Current Question</Text>
                </View>

                <View style={styles.cardContent}>
                    {quizState.currentConjugation && (
                        <>
                            <Text style={styles.verbText}>
                                {capitaliseWords(quizState.currentConjugation.word.english)}
                                {" "}
                                ({quizState.currentConjugation.word.arabic})
                            </Text>
                            <Text style={styles.contextText}>
                                Pronoun: <Text style={styles.boldText}>{quizState.currentConjugation.pronoun}</Text>
                                {" | "}
                                Tense: <Text style={styles.boldText}>{quizState.currentConjugation.tense}</Text>
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
                                    <Text style={styles.hintText}>
                                        Answer: {quizState.hint}
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ee',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
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
    verbText: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
        marginBottom: 12,
    },
    contextText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    boldText: {
        fontWeight: '600',
        color: '#333',
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
    hintText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
});