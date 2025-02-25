import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    ActivityIndicator,
    PanResponder,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { apiClient } from '../../utils/apiClient';
import { capitaliseWords } from '../../utils/textUtils';
import { ClashText } from '../customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../styles/shared';
import MainPageLayout from '../customComponents/MainPageLayout';

interface FlashCard {
    arabic: string;
    english: string;
    transliteration: string;
}

interface ApiResponse {
    id: number;
    category_id: number;
    arabic: string;
    english: string;
    transliteration: string;
}

interface Props {
    wordsList: string;
    categoryName: string | null;
    onBack: () => void;
}

const SWIPE_THRESHOLD = 100;
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FlashCardsSection({ wordsList, categoryName, onBack }: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentIndexRef = useRef(0);

    const [isLoading, setIsLoading] = useState(true);
    const [showTranslit, setShowTranslit] = useState(true);
    const [isArabic, setIsArabic] = useState(true);

    const position = useRef(new Animated.ValueXY()).current;
    const flashcardsRef = useRef<FlashCard[]>([]);

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: Animated.event(
                [null, { dx: position.x }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx < -SWIPE_THRESHOLD && currentIndexRef.current < flashcardsRef.current.length - 1) {
                    swipeLeft();
                } else if (gesture.dx > SWIPE_THRESHOLD && currentIndexRef.current > 0) {
                    swipeRight();
                } else {
                    resetPosition();
                }
            },

            onPanResponderTerminate: () => {
                resetPosition();
            },
        })
    ).current;

    useEffect(() => {
        fetchFlashcards();
    }, [wordsList]);

    const fetchFlashcards = async () => {
        try {
            const response = await apiClient.post<ApiResponse[]>(
                '/flashcards/get-category-flashcards',
                { category_id: wordsList }
            );

            let newFlashcards: FlashCard[] = [];
            if (Array.isArray(response)) {
                newFlashcards = response;
            } else if (response && response.words && Array.isArray(response.words)) {
                newFlashcards = response.words;
            }

            flashcardsRef.current = newFlashcards;

        } catch (error) {
            console.error('Error fetching flashcards:', error);
            flashcardsRef.current = [];
        } finally {
            setIsLoading(false);
        }
    };

    const swipeLeft = () => {
        Animated.timing(position, {
            toValue: { x: -windowWidth, y: 0 },
            duration: 250,
            useNativeDriver: false
        }).start(() => {
            setCurrentIndex(prev => {
                const newIndex = Math.min(prev + 1, flashcardsRef.current.length - 1);
                currentIndexRef.current = newIndex;
                return newIndex;
            });

            position.setValue({ x: 0, y: 0 });
        });
    };

    const swipeRight = () => {
        Animated.timing(position, {
            toValue: { x: windowWidth, y: 0 },
            duration: 250,
            useNativeDriver: false
        }).start(() => {
            setCurrentIndex(prev => {
                const newIndex = Math.max(0, prev - 1);
                currentIndexRef.current = newIndex;
                return newIndex;
            });

            position.setValue({ x: 0, y: 0 });
        });
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            bounciness: 10,
            useNativeDriver: false
        }).start();
    };

    const getCardStyle = () => {
        const rotate = position.x.interpolate({
            inputRange: [-windowWidth * 1.5, 0, windowWidth * 1.5],
            outputRange: ['-15deg', '0deg', '15deg']
        });

        return {
            transform: [
                { translateX: position.x },
                { rotate }
            ]
        };
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={Colours.decorative.purple} />
            </View>
        );
    }

    if (!flashcardsRef.current.length) {
        return (
            <View style={styles.centerContainer}>
                <ClashText style={Typography.body}>No flashcards available</ClashText>
            </View>
        );
    }

    const currentCard = flashcardsRef.current[currentIndex];
    if (!currentCard) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={Colours.decorative.purple} />
                </TouchableOpacity>
                <ClashText style={styles.title}>
                    {categoryName ? categoryName.toLowerCase() : 'flashcards'}
                </ClashText>

                <TouchableOpacity
                    style={[styles.controlButton, showTranslit && styles.activeButton]}
                    onPress={() => setShowTranslit(!showTranslit)}
                >
                    <ClashText style={[styles.controlText, ...(showTranslit ? [styles.activeText] : [])]}>
                        transliteration
                    </ClashText>
                </TouchableOpacity>
            </View>

            <View style={styles.cardContainer}>
                <Animated.View
                    style={[styles.flashcard, getCardStyle()]}
                    {...panResponder.panHandlers}
                >
                    <TouchableOpacity
                        style={styles.cardContent}
                        onPress={() => setIsArabic(!isArabic)}
                        activeOpacity={0.9}
                    >
                        <ClashText style={[styles.mainText, ...(isArabic ? [styles.arabicText] : [])]}>
                            {isArabic ? currentCard.arabic : currentCard.english}
                        </ClashText>
                        {showTranslit && isArabic && (
                            <ClashText style={styles.translitText}>
                                {currentCard.transliteration}
                            </ClashText>
                        )}
                        <ClashText style={styles.tapText}>tap to flip</ClashText>
                    </TouchableOpacity>
                </Animated.View>

                <View style={styles.footerInfo}>
                    <ClashText style={styles.cardCount}>
                        {currentIndex + 1} / {flashcardsRef.current.length}
                    </ClashText>
                    <ClashText style={styles.instructions}>
                        swipe left/right to navigate
                    </ClashText>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        paddingHorizontal: 20,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        flex: 1,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    controlButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: Colours.decorative.purple,
    },
    activeButton: {
        backgroundColor: Colours.decorative.purple,
    },
    controlText: {
        ...Typography.body,
        color: Colours.decorative.purple,
        fontSize: 16,
    },
    activeText: {
        color: Colours.text.inverse,
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flashcard: {
        width: windowWidth - 40,
        height: 400,
        backgroundColor: Colours.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    mainText: {
        ...Typography.headingMedium,
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 20,
    },
    arabicText: {
        ...Typography.arabic,
        fontSize: 40,
        textAlign: 'center',
    },
    translitText: {
        ...Typography.body,
        fontSize: 20,
        color: Colours.decorative.copper,
        textAlign: 'center',
        marginBottom: 20,
    },
    tapText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.secondary,
        position: 'absolute',
        bottom: 20,
    },
    cardCount: {
        ...Typography.body,
        textAlign: 'center',
        fontSize: 16,
        color: Colours.text.secondary,
        marginTop: 20,
    },
    instructions: {
        ...Typography.body,
        textAlign: 'center',
        fontSize: 14,
        color: Colours.text.secondary,
        marginTop: 10,
        marginBottom: 20,
    },
});