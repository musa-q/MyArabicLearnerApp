import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../../utils/apiClient';
import { capitaliseWords } from '../../../utils/textUtils';
import { ClashText, ClashTextInput } from '../../../components/customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../../styles/shared';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';

const INITIAL_TIME = 15;
const ERROR_MESSAGES = {
    NO_ANSWER: "please provide an answer!",
    NETWORK_ERROR: "network error occurred. please try again.",
    LOAD_ERROR: "error loading question. please try again.",
    UNAUTHORIZED: "your session has expired. please login again.",
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
                resultMessage: "time's up! ⏰",
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
                    resultMessage: `correct! 🎉 +${response.points} points`,
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
                    resultMessage: `incorrect! ${response.points}`,
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
                <ActivityIndicator size="large" color={Colours.decorative.purple} />
            </View>
        );
    }

    if (uiState.showResultsPage) {
        return (
            <View style={styles.centerContainer}>
                <ClashText style={styles.resultTitle}>quiz complete!</ClashText>
                <ClashText style={styles.resultScore}>final score: {quizState.points}</ClashText>
            </View>
        );
    }

    return (
        <MainPageLayout>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ClashText style={styles.title}>verb conjugation practice</ClashText>
                    <ClashText style={styles.subtitle}>
                        conjugate the verb correctly based on the pronoun and tense
                    </ClashText>
                </View>

                <View style={styles.scoreContainer}>
                    <ClashText style={styles.scoreText}>points: {quizState.points}</ClashText>
                    <View style={styles.timerContainer}>
                        <View style={[
                            styles.timerBar,
                            { width: `${(quizState.timeRemaining / INITIAL_TIME) * 100}%` },
                            quizState.timeRemaining <= 5 && styles.timerWarning
                        ]} />
                    </View>
                    <ClashText style={styles.scoreText}>streak: {quizState.streak}</ClashText>
                </View>

                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="book-open-variant" size={24} color={Colours.decorative.purple} />
                        <ClashText style={styles.cardHeaderText}>current question</ClashText>
                    </View>

                    <View style={styles.cardContent}>
                        {quizState.currentConjugation && (
                            <>
                                <ClashText style={styles.verbText}>
                                    {capitaliseWords(quizState.currentConjugation.word.english)}
                                    {" "}
                                    (<ClashText style={styles.arabicVerbText}>{quizState.currentConjugation.word.arabic}</ClashText>)
                                </ClashText>
                                <ClashText style={styles.contextText}>
                                    pronoun: <ClashText style={styles.boldText}>{quizState.currentConjugation.pronoun}</ClashText>
                                    {" | "}
                                    tense: <ClashText style={styles.boldText}>{quizState.currentConjugation.tense}</ClashText>
                                </ClashText>

                                <ClashTextInput
                                    style={styles.input}
                                    value={quizState.currentAnswer}
                                    onChangeText={(text) => setQuizState(prev => ({ ...prev, currentAnswer: text }))}
                                    placeholder="type your answer here..."
                                    placeholderTextColor={Colours.text.secondary}
                                />

                                <View style={styles.buttonContainer}>
                                    {uiState.showNextButton ? (
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={getNextQuestion}
                                            disabled={uiState.isSubmitting}
                                        >
                                            <ClashText style={styles.buttonText}>next question</ClashText>
                                            <MaterialCommunityIcons name="arrow-right" size={20} color={Colours.text.inverse} />
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.primaryButton}
                                            onPress={checkAnswer}
                                            disabled={uiState.isSubmitting}
                                        >
                                            <ClashText style={styles.buttonText}>check answer</ClashText>
                                            <MaterialCommunityIcons name="check-circle" size={20} color={Colours.text.inverse} />
                                        </TouchableOpacity>
                                    )}

                                    {uiState.showHintButton && (
                                        <TouchableOpacity
                                            style={styles.secondaryButton}
                                            onPress={() => setUiState(prev => ({ ...prev, revealAnswer: !prev.revealAnswer }))}
                                        >
                                            <MaterialCommunityIcons name="help-circle" size={20} color={Colours.decorative.purple} />
                                            <ClashText style={styles.secondaryButtonText}>
                                                {uiState.revealAnswer ? 'hide answer' : 'show answer'}
                                            </ClashText>
                                        </TouchableOpacity>
                                    )}
                                </View>

                                {uiState.resultMessage && (
                                    <View style={[
                                        styles.resultContainer,
                                        {
                                            backgroundColor: uiState.resultMessage.includes("correct")
                                                ? "rgba(69, 166, 163, 0.2)" // Teal with opacity
                                                : "rgba(184, 115, 51, 0.2)" // Copper with opacity
                                        }
                                    ]}>
                                        <ClashText style={[
                                            styles.resultText,
                                            {
                                                color: uiState.resultMessage.includes("correct")
                                                    ? Colours.decorative.teal
                                                    : Colours.decorative.copper
                                            }
                                        ]}>
                                            {uiState.resultMessage}
                                        </ClashText>
                                    </View>
                                )}

                                {uiState.revealAnswer && (
                                    <View style={styles.hintContainer}>
                                        <ClashText style={styles.hintText}>
                                            answer: <ClashText style={styles.arabicHintText}>{quizState.hint}</ClashText>
                                        </ClashText>
                                    </View>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </View>
        </MainPageLayout>
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
    header: {
        marginBottom: 20,
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        ...Typography.body,
        color: Colours.decorative.copper,
        textAlign: 'center',
    },
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    scoreText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
    },
    timerContainer: {
        flex: 1,
        height: 8,
        backgroundColor: Colours.secondary,
        borderRadius: 4,
        marginHorizontal: 12,
        overflow: 'hidden',
        opacity: 0.3,
    },
    timerBar: {
        height: '100%',
        backgroundColor: Colours.decorative.purple,
        borderRadius: 4,
        opacity: 1,
    },
    timerWarning: {
        backgroundColor: Colours.decorative.copper,
    },
    card: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
        backgroundColor: 'rgba(245, 240, 230, 0.5)', // Slightly tinted background
    },
    cardHeaderText: {
        ...Typography.headingMedium,
        fontSize: 18,
        color: Colours.text.primary,
        marginLeft: 12,
    },
    cardContent: {
        padding: 20,
        alignItems: 'center',
    },
    verbText: {
        ...Typography.headingMedium,
        fontSize: 24,
        color: Colours.text.primary,
        textAlign: 'center',
        marginBottom: 12,
    },
    arabicVerbText: {
        ...Typography.arabic,
        fontSize: 24,
    },
    contextText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.secondary,
        textAlign: 'center',
        marginBottom: 20,
    },
    boldText: {
        fontWeight: '600',
        color: Colours.decorative.purple,
    },
    input: {
        ...ComponentStyles.input,
        width: '100%',
        height: 50,
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
        backgroundColor: Colours.decorative.purple,
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: 'transparent',
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: Colours.decorative.purple,
    },
    buttonText: {
        ...Typography.body,
        color: Colours.text.inverse,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        ...Typography.body,
        color: Colours.decorative.purple,
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
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    hintContainer: {
        width: '100%',
        marginTop: 20,
        padding: 12,
        backgroundColor: 'rgba(245, 240, 230, 0.7)',
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colours.secondary,
        borderOpacity: 0.3,
    },
    hintText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.primary,
        textAlign: 'center',
    },
    arabicHintText: {
        ...Typography.arabic,
        fontSize: 18,
        color: Colours.decorative.purple,
    },
    resultTitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        fontSize: 28,
        marginBottom: 20,
    },
    resultScore: {
        ...Typography.body,
        color: Colours.decorative.purple,
        fontSize: 20,
    }
});