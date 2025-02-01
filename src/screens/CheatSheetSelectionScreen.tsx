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
import { CheatSheetStackParamList } from '../types/navigation';

type CheatSheetScreenNavigationProp = NativeStackNavigationProp<CheatSheetStackParamList>;

export default function ScreenName() {
    const navigation = useNavigation<CheatSheetScreenNavigationProp>();

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.contentSection}>
                    <Text style={styles.title}>Learn</Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('VerbCheatSheet')}
                    >
                        <MaterialCommunityIcons name="card-text" size={24} color="white" />
                        <Text style={styles.buttonText}>Verb Conjugation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('SentenceConstruction')}
                    >
                        <MaterialCommunityIcons name="card-text" size={24} color="white" />
                        <Text style={styles.buttonText}>Sentence Construction</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('PossessiveEndings')}
                    >
                        <MaterialCommunityIcons name="card-text" size={24} color="white" />
                        <Text style={styles.buttonText}>Possessive Endings</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Negation')}
                    >
                        <MaterialCommunityIcons name="card-text" size={24} color="white" />
                        <Text style={styles.buttonText}>Negation</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Pluralisation')}
                    >
                        <MaterialCommunityIcons name="card-text" size={24} color="white" />
                        <Text style={styles.buttonText}>Pluralisation</Text>
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