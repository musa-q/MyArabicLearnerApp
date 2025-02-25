import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Platform,
    StatusBar,
    Dimensions,
    Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../utils/apiClient';
import { Colours, Typography, ComponentStyles } from '../../styles/shared';
import MainPageLayout from '../../components/customComponents/MainPageLayout';
import LoadingComp from '../../components/customComponents/LoadingComp';
import { ClashText } from '../../components/customComponents/ClashTexts';
import { HomeStackParamList } from '../../types/navigation';

const { width } = Dimensions.get('window');

interface QuickPhrase {
    arabic: string;
    transliteration: string;
    english: string;
    context: string;
}

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { user, updateUser } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [quickPhrases, setQuickPhrases] = useState<QuickPhrase[]>([]);

    const fetchUserData = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.post('/homepage');
            if (response?.username) {
                await updateUser({ username: response.username });
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.email && !user?.username) {
            fetchUserData();
        }
    }, [user?.email]);

    if (isLoading) {
        return (
            <LoadingComp />
        );
    }

    return (
        <MainPageLayout>
            <View style={styles.headerSection}>
                <ClashText style={styles.welcomeText}>
                    <ClashText style={[styles.arabicWelcomeText, styles.welcomeText]}>
                        أهلا وسهلا{'\n'}
                    </ClashText>
                    {user?.username}
                </ClashText>
                <ClashText style={styles.subtitle}>
                    ready for today's arabic learning?
                </ClashText>
            </View>

            <View style={styles.quickActionsSection}>
                <ClashText style={styles.sectionTitle}>continue Learning</ClashText>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('Flashcards')}
                >
                    <MaterialCommunityIcons name="card-text" size={24} color="white" />
                    <ClashText style={styles.actionButtonText}>flashcards</ClashText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.actionButtonSecondary]}
                    onPress={() => navigation.navigate('VocabTable')}
                >
                    <Ionicons name="book-outline" size={24} color="white" />
                    <ClashText style={styles.actionButtonText}>vocabulary table</ClashText>
                </TouchableOpacity>
            </View>

            <View style={styles.phrasesSection}>
                <ClashText style={styles.sectionTitle}>today's phrases</ClashText>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {quickPhrases.map((phrase, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.phraseCard}
                            onPress={() => {/* Add audio playback here */ }}
                        >
                            <MaterialCommunityIcons
                                name="volume-high"
                                size={24}
                                color={Colours.decorative.purple}
                                style={styles.soundIcon}
                            />
                            <ClashText style={styles.arabicText}>{phrase.arabic}</ClashText>
                            <ClashText style={styles.transliteration}>{phrase.transliteration}</ClashText>
                            <ClashText style={styles.englishText}>{phrase.english}</ClashText>
                            <ClashText style={styles.contextLabel}>{phrase.context}</ClashText>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colours.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body,
        marginTop: 16,
    },
    scrollView: {
        flex: 1,
    },
    arabesque: {
        width: width,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    bottomArabesque: {
        marginTop: 20,
    },
    headerSection: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    welcomeText: {
        fontSize: 60,
        color: Colours.decorative.gold,
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        textAlign: 'center',
        lineHeight: 80,
    },
    arabicWelcomeText: {
        ...Typography.arabicRuqaaBold,
    },
    subtitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.copper,
        fontSize: 24,
        textAlign: 'center',
    },
    quickActionsSection: {
        padding: 20,
    },
    sectionTitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        marginBottom: 15,
    },
    actionButton: {
        backgroundColor: Colours.decorative.purple,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonSecondary: {
        backgroundColor: Colours.decorative.teal,
    },
    actionButtonText: {
        ...Typography.body,
        color: Colours.text.inverse,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    phrasesSection: {
        padding: 20,
    },
    phraseCard: {
        backgroundColor: Colours.surface,
        borderRadius: 12,
        padding: 15,
        marginRight: 15,
        width: width * 0.7,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    soundIcon: {
        marginBottom: 10,
    },
    arabicText: {
        ...Typography.arabic,
        marginBottom: 5,
    },
    transliteration: {
        ...Typography.body,
        marginBottom: 5,
    },
    englishText: {
        ...Typography.headingMedium,
        marginBottom: 5,
    },
    contextLabel: {
        ...Typography.body,
        color: Colours.decorative.purple,
        fontWeight: '500',
    },
});