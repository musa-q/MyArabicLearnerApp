import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Image,
    Dimensions,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LoginStackParamList } from '../types/navigation';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type LandingScreenNavigationProp = NativeStackNavigationProp<LoginStackParamList>;

const { width } = Dimensions.get('window');

const learningFeatures = [
    {
        icon: 'flash' as const,
        title: "Quick Lessons",
        description: "Learn in just 5 minutes a day",
        color: '#6200ee'
    },
    {
        icon: 'game-controller' as const,
        title: "Learn by Playing",
        description: "Fun quizzes and challenges",
        color: '#03dac6'
    },
    {
        icon: 'trophy' as const,
        title: "Track Progress",
        description: "Earn badges and rewards",
        color: '#FFD700'
    }
];

const quickPhrases = [
    {
        arabic: "مرحبا",
        transliteration: "Marhaba",
        english: "Hello",
    },
    {
        arabic: "شكراً",
        transliteration: "Shukran",
        english: "Thank you",
    },
    {
        arabic: "نعم",
        transliteration: "Na'am",
        english: "Yes",
    },
    {
        arabic: "شو بتعمل؟",
        transliteration: "Shu bta3mel?",
        english: "What are you doing?",
    }
];

export default function LandingScreen() {
    const navigation = useNavigation<LandingScreenNavigationProp>();

    return (
        <SafeAreaView style={styles.container} >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Section */}
                < View style={styles.heroSection} >
                    <View style={styles.logoContainer}>
                        {/* <Image
                            source={require('../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        /> */}
                    </View>
                    < Text style={styles.heroTitle} >
                        Learn Arabic{'\n'}
                        <Text style={styles.heroHighlight}> The Fun Way! </Text>
                    </Text>
                </View>

                {/* Quick Start Phrases */}
                <View style={styles.quickPhrasesSection}>
                    <Text style={styles.sectionTitle}> Start Speaking Now! </Text>
                    < ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.phrasesScrollContent}
                    >
                        {
                            quickPhrases.map((phrase, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.phraseCard}
                                    onPress={() => { console.log('playing sound') }}
                                >
                                    <MaterialCommunityIcons
                                        name="volume-high"
                                        size={24}
                                        color="#6200ee"
                                        style={styles.soundIcon}
                                    />
                                    <Text style={styles.arabicText}> {phrase.arabic} </Text>
                                    < Text style={styles.transliteration} > {phrase.transliteration} </Text>
                                    < Text style={styles.englishText} > {phrase.english} </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>

                {/* Features Grid */}
                <View style={styles.featuresSection}>
                    {
                        learningFeatures.map((feature, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.featureCard, { borderLeftColor: feature.color }]}
                            >
                                <Ionicons
                                    name={feature.icon}
                                    size={32}
                                    color={feature.color}
                                    style={styles.featureIcon}
                                />
                                <View style={styles.featureContent} >
                                    <Text style={styles.featureTitle} > {feature.title} </Text>
                                    < Text style={styles.featureDescription} > {feature.description} </Text>
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                </View>

                {/* Stats Section */}
                <View style={styles.statsSection}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}> 1000 + </Text>
                        < Text style={styles.statLabel} > Active Learners </Text>
                    </View>
                    < View style={styles.statCard} >
                        <Text style={styles.statNumber}> 4.8★</Text>
                        < Text style={styles.statLabel} > User Rating </Text>
                    </View>
                </View>

                {/* CTA Section */}
                <View style={styles.ctaSection}>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => navigation.navigate('LoginScreen')}
                    >
                        <Text style={styles.primaryButtonText}> Start Learning </Text>
                        < Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>

                    < TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => navigation.navigate('About')}
                    >
                        <Text style={styles.secondaryButtonText}> Learn More </Text>
                    </TouchableOpacity>
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
    scrollContent: {
        paddingBottom: 40,
    },
    heroSection: {
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    logoContainer: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        lineHeight: 40,
    },
    heroHighlight: {
        color: '#6200ee',
    },
    quickPhrasesSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    phrasesScrollContent: {
        paddingRight: 20,
    },
    phraseCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginRight: 15,
        width: width * 0.4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    soundIcon: {
        marginBottom: 10,
    },
    arabicText: {
        fontSize: 24,
        color: '#333',
        marginBottom: 5,
        fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
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
    },
    featuresSection: {
        padding: 20,
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    featureIcon: {
        marginRight: 15,
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    featureDescription: {
        fontSize: 14,
        color: '#666',
    },
    statsSection: {
        flexDirection: 'row',
        padding: 20,
        justifyContent: 'space-around',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        width: '45%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ee',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    ctaSection: {
        padding: 20,
    },
    primaryButton: {
        backgroundColor: '#6200ee',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 10,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#6200ee',
        fontSize: 16,
        fontWeight: '500',
    },
});