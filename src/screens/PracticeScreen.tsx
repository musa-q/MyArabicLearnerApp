import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PracticeStackParamList } from '../types/navigation';

type PracticeScreenNavigationProp = NativeStackNavigationProp<PracticeStackParamList>;

export default function ScreenName() {
    const navigation = useNavigation<PracticeScreenNavigationProp>();

    const handleButtonPress = (buttonType: string) => {
        Alert.alert(`Button ${buttonType} pressed`);
        // Add your button press logic here
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentSection}>
                    <Text style={styles.title}>Learning</Text>
                    <Text style={styles.description}>
                        This is a sample screen with scrollable content and interactive buttons.
                        Scroll down to see more content and try out the buttons below.
                    </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('VocabQuiz')}
                    >
                        <MaterialCommunityIcons name="card-text" size={24} color="white" />
                        <Text style={styles.buttonText}>Vocab Quiz</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.buttonMiddle]}
                        onPress={() => navigation.navigate('VerbConjugationQuiz')}
                    >
                        <Ionicons name="book-outline" size={24} color="white" />
                        <Text style={styles.buttonText}>Verb Conjugation Quiz</Text>
                    </TouchableOpacity>
                </View>

                {/* Additional scrollable content */}
                <View style={styles.additionalContent}>
                    <Text style={styles.subtitle}>Additional Content</Text>
                    <Text style={styles.paragraph}>
                        This is additional content that you can scroll through. Add more content
                        here to demonstrate the scrolling functionality of the screen.
                    </Text>
                    <Text style={styles.paragraph}>
                        You can keep adding more text, components, or any other content here.
                        The ScrollView will make sure everything is accessible through scrolling.
                    </Text>
                    {/* Add more content as needed */}
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
        padding: 20,
    },
    contentSection: {
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    buttonContainer: {
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonMiddle: {
        backgroundColor: '#03dac6',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    additionalContent: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 10,
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    paragraph: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
        marginBottom: 15,
    },
});