import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Animated,
    ActivityIndicator,
    PanResponder,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiClient } from '../../utils/apiClient';
import { capitaliseWords } from '../../utils/textUtils';

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
                console.log('flashcards length:', flashcardsRef.current.length);
                console.log('left:', gesture.dx < -SWIPE_THRESHOLD);
                console.log('right:', gesture.dx > SWIPE_THRESHOLD);
                console.log('current:', currentIndexRef.current, 'length:', flashcardsRef.current.length);

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
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    if (!flashcardsRef.current.length) {
        return (
            <View style={styles.centerContainer}>
                <Text>No flashcards available</Text>
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
                    <Ionicons name="arrow-back" size={24} color="#6200ee" />
                </TouchableOpacity>
                <Text style={styles.title}>
                    {categoryName ? capitaliseWords(categoryName) : 'Flashcards'}
                </Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    style={[styles.controlButton, showTranslit && styles.activeButton]}
                    onPress={() => setShowTranslit(!showTranslit)}
                >
                    <Text style={[styles.controlText, showTranslit && styles.activeText]}>
                        Transliteration
                    </Text>
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
                        <Text style={styles.mainText}>
                            {isArabic ? currentCard.arabic : currentCard.english}
                        </Text>
                        {showTranslit && isArabic && (
                            <Text style={styles.translitText}>
                                {currentCard.transliteration}
                            </Text>
                        )}
                        <Text style={styles.tapText}>Tap to flip</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>

            <Text style={styles.cardCount}>
                {currentIndex + 1} / {flashcardsRef.current.length}
            </Text>

            <Text style={styles.instructions}>
                Swipe left or right to navigate through cards
            </Text>
        </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        padding: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
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
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#6200ee',
    },
    activeButton: {
        backgroundColor: '#6200ee',
    },
    controlText: {
        color: '#6200ee',
        fontSize: 16,
    },
    activeText: {
        color: 'white',
    },
    cardContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flashcard: {
        width: windowWidth - 40,
        height: 400,
        backgroundColor: 'white',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    mainText: {
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 20,
    },
    translitText: {
        fontSize: 20,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    tapText: {
        fontSize: 14,
        color: '#999',
        position: 'absolute',
        bottom: 20,
    },
    cardCount: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 20,
    },
    instructions: {
        textAlign: 'center',
        fontSize: 14,
        color: '#999',
        marginTop: 10,
        marginBottom: 20,
    },
});
