import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { apiClient } from '../utils/apiClient';

const { width } = Dimensions.get('window');

interface QuickPhrase {
    arabic: string;
    transliteration: string;
    english: string;
    context: string;
}

export default function HomeScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<any>>();
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ee" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Welcome Header */}
                <View style={styles.headerSection}>
                    <Text style={styles.welcomeText}>
                        مرحباً {user?.username}!
                    </Text>
                    <Text style={styles.subtitle}>
                        Ready for today's Arabic learning?
                    </Text>
                </View>

                {/* Stats Section */}
                {/* {stats && (
                    <View style={styles.statsSection}>
                        <View style={styles.statsRow}>
                            <View style={styles.statCard}>
                                <Ionicons name="book-outline" size={24} color="#6200ee" />
                                <Text style={styles.statNumber}>{stats.completedLessons}</Text>
                                <Text style={styles.statLabel}>Lessons</Text>
                            </View>
                            <View style={styles.statCard}>
                                <Ionicons name="time-outline" size={24} color="#03dac6" />
                                <Text style={styles.statNumber}>{stats.totalMinutesLearned}</Text>
                                <Text style={styles.statLabel}>Minutes</Text>
                            </View>
                            <View style={styles.statCard}>
                                <MaterialCommunityIcons name="fire" size={24} color="#FFD700" />
                                <Text style={styles.statNumber}>{stats.currentStreak}</Text>
                                <Text style={styles.statLabel}>Day Streak</Text>
                            </View>
                        </View>
                    </View>
                )} */}

                {/* Quick Actions */}
                <View style={styles.quickActionsSection}>
                    <Text style={styles.sectionTitle}>Continue Learning</Text>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Flashcards')}
                    >
                        <MaterialCommunityIcons name="card-text" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Flashcards</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.actionButtonSecondary]}
                        onPress={() => navigation.navigate('VocabTable')}
                    >
                        <Ionicons name="book-outline" size={24} color="white" />
                        <Text style={styles.actionButtonText}>Vocabulary Table</Text>
                    </TouchableOpacity>
                </View>

                {/* Daily Phrases */}
                <View style={styles.phrasesSection}>
                    <Text style={styles.sectionTitle}>Today's Phrases</Text>
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
                                    color="#6200ee"
                                    style={styles.soundIcon}
                                />
                                <Text style={styles.arabicText}>{phrase.arabic}</Text>
                                <Text style={styles.transliteration}>{phrase.transliteration}</Text>
                                <Text style={styles.englishText}>{phrase.english}</Text>
                                <Text style={styles.contextLabel}>{phrase.context}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    headerSection: {
        padding: 20,
        backgroundColor: '#6200ee',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#ffffff',
        opacity: 0.9,
    },
    statsSection: {
        padding: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        width: '30%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    quickActionsSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    actionButton: {
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    actionButtonSecondary: {
        backgroundColor: '#03dac6',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    phrasesSection: {
        padding: 20,
    },
    phraseCard: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        marginRight: 15,
        width: width * 0.7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    soundIcon: {
        marginBottom: 10,
    },
    arabicText: {
        fontSize: 24,
        color: '#333',
        marginBottom: 5,
        textAlign: 'right',
    },
    transliteration: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    englishText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        marginBottom: 5,
    },
    contextLabel: {
        fontSize: 12,
        color: '#6200ee',
        fontWeight: '500',
    },
});