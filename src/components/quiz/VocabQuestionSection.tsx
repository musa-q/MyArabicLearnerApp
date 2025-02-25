import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../utils/apiClient';
import { capitaliseWords } from '../../utils/textUtils';
import { ClashText, ClashTextInput } from '../../components/customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../styles/shared';

const INITIAL_TIME = 15;
const ERROR_MESSAGES = {
    NO_ANSWER: "please provide an answer!",
    NETWORK_ERROR: "network error occurred. please try again.",
    LOAD_ERROR: "error loading question. please try again.",
    UNAUTHORIZED: "your session has expired. please login again.",
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
                <ActivityIndicator size="large" color={Colours.decorative.purple} />
            </View>
        );
    }

    if (uiState.showResultsPage) {
        return (
            <View style={styles.centerContainer}>
                <ClashText style={styles.resultTitle}>quiz complete! 🎉</ClashText>
                <ClashText style={styles.resultScore}>final score: {quizState.points}</ClashText>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={Colours.decorative.purple} />
                    <ClashText style={styles.backButtonText}>back to categories</ClashText>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={Colours.decorative.purple} />
                </TouchableOpacity>
                <ClashText style={styles.title}>
                    {categoryName ? capitaliseWords(categoryName) : 'vocabulary quiz'}
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

            <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
                <View style={styles.cardHeader}>
                    <MaterialCommunityIcons name="book-open-variant" size={24} color={Colours.decorative.purple} />
                    <ClashText style={styles.cardHeaderText}>current question</ClashText>
                </View>

                <View style={styles.cardContent}>
                    <ClashText style={styles.questionText}>
                        {capitaliseWords(quizState.currentQuestion ?? '')}
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
                                    ? "rgba(69, 166, 163, 0.2)"
                                    : "rgba(184, 115, 51, 0.2)"
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
                            <ClashText style={styles.hintLabel}>answer: </ClashText>
                            <ClashText style={styles.hintText}>{quizState.hint}</ClashText>
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
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        ...Typography.body,
        marginLeft: 10,
        fontSize: 16,
        color: Colours.decorative.purple,
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        flex: 1,
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
        fontWeight: '600',
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
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
        backgroundColor: 'rgba(245, 240, 230, 0.5)',
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
    questionText: {
        ...Typography.headingMedium,
        fontSize: 24,
        color: Colours.text.primary,
        textAlign: 'center',
        marginBottom: 20,
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
    hintLabel: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.secondary,
        marginBottom: 4,
    },
    hintText: {
        ...Typography.arabic,
        fontSize: 20,
        color: Colours.decorative.purple,
        fontWeight: '600',
        textAlign: 'center',
    },
    resultTitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        fontSize: 28,
        marginBottom: 12,
    },
    resultScore: {
        ...Typography.body,
        color: Colours.decorative.purple,
        fontSize: 20,
        marginBottom: 24,
    },
});