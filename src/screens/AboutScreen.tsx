import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions,
    Animated,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ClashText } from '../components/customComponents/ClashTexts';

type AboutScreenNavigationProp = NativeStackNavigationProp<any>;

const { width } = Dimensions.get('window');

const features = [
    {
        icon: 'book-outline' as const,
        title: "Comprehensive Resources",
        description: "Access cheat sheets and flashcards covering essential grammar and vocabulary",
        color: '#6200ee'
    },
    {
        icon: 'brain' as const,
        title: "Interactive Learning",
        description: "Practice with quizzes and track your progress over time",
        color: '#03dac6'
    },
    {
        icon: 'chatbubble-ellipses-outline' as const,
        title: "AI Conversation Partner",
        description: "Coming soon: Practice conversations with our AI chatbot",
        color: '#FFD700'
    },
    {
        icon: 'people-outline' as const,
        title: "Community Focus",
        description: "Learn the Levantine dialect used across Jordan, Lebanon, Palestine, and Syria",
        color: '#FF6B6B'
    }
];

export default function AboutScreen() {
    const navigation = useNavigation<AboutScreenNavigationProp>();
    const { user } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <Animated.View style={[
                    styles.headerSection,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY }]
                    }
                ]}>
                    <ClashText style={styles.title}>About My Arabic Learner</ClashText>
                    <ClashText style={styles.subtitle}>
                        Your journey to mastering Levantine Arabic starts here
                    </ClashText>
                </Animated.View>

                {/* Description Section */}
                <View style={styles.descriptionSection}>
                    <ClashText style={styles.description}>
                        Whether you're just starting out or want to level up your Arabic conversations,
                        we're here to make learning Levantine Arabic easy, fun, and practical. Our platform
                        combines modern learning techniques with traditional language education to create
                        an effective learning experience.
                    </ClashText>
                </View>

                {/* Features Section */}
                <View style={styles.featuresSection}>
                    {features.map((feature, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.featureCard, { borderLeftColor: feature.color }]}
                            activeOpacity={0.7}
                        >
                            {feature.icon === 'brain' ? (
                                <MaterialCommunityIcons
                                    name={feature.icon}
                                    size={32}
                                    color={feature.color}
                                    style={styles.featureIcon}
                                />
                            ) : (
                                <Ionicons
                                    name={feature.icon}
                                    size={32}
                                    color={feature.color}
                                    style={styles.featureIcon}
                                />
                            )}
                            <View style={styles.featureContent}>
                                <ClashText style={styles.featureTitle}>{feature.title}</ClashText>
                                <ClashText style={styles.featureDescription}>
                                    {feature.description}
                                </ClashText>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* CTA Section */}
                <View style={styles.ctaSection}>
                    <ClashText style={styles.ctaTitle}>Ready to Begin?</ClashText>
                    <ClashText style={styles.ctaDescription}>
                        Start your journey into the beautiful world of Levantine Arabic today!
                    </ClashText>
                    <TouchableOpacity
                        style={styles.ctaButton}
                        onPress={() => {
                            if (user) {
                                navigation.navigate('MainTabs');
                            } else {
                                navigation.navigate('LoginScreen');
                            }
                        }}
                    >
                        <ClashText style={styles.ctaButtonText}>Get Started</ClashText>
                        <Ionicons name="arrow-forward" size={20} color="white" style={styles.buttonIcon} />
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
    scrollView: {
        flex: 1,
    },
    headerSection: {
        padding: 20,
        backgroundColor: '#6200ee',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#ffffff',
        textAlign: 'center',
        opacity: 0.9,
    },
    descriptionSection: {
        padding: 20,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        textAlign: 'center',
    },
    featuresSection: {
        padding: 20,
    },
    featureCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    featureIcon: {
        marginRight: 15,
        width: 32,
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
        lineHeight: 20,
    },
    ctaSection: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#ffffff',
        margin: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    ctaTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    ctaDescription: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    ctaButton: {
        backgroundColor: '#6200ee',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: width - 80,
    },
    ctaButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 5,
    }
});