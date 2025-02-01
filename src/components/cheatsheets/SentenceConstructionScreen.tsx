import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Pattern {
    pattern: string;
    arabic: string;
    transliteration: string;
    english: string;
}

export default function SentenceConstructionScreen() {
    const patterns: Pattern[] = [
        {
            pattern: "Subject + Verb + Object",
            arabic: "أنا بشرب قهوة",
            transliteration: "ana bashrab qahwa",
            english: "I drink coffee"
        },
        {
            pattern: "Subject + Verb + Location",
            arabic: "هو بروح عالسوق",
            transliteration: "huwe biruh 'al-souq",
            english: "He goes to the market"
        },
        {
            pattern: "Verb + Object + Time",
            arabic: "أكلت الغدا الساعة تنتين",
            transliteration: "akalt el-ghada el-sa'a tintayn",
            english: "I ate lunch at 2 o'clock"
        },
        {
            pattern: "Subject + Adjective + Noun",
            arabic: "عندي سيارة حمرا",
            transliteration: "'indi sayara hamra",
            english: "I have a red car"
        }
    ];

    const tips = [
        "Unlike English, Arabic verbs usually come before the subject in formal speech",
        "Adjectives come after the noun they describe",
        "Time expressions usually come at the end of the sentence",
        "In Levantine Arabic, we often start with the subject followed by the verb"
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Sentence Construction in Arabic</Text>
            <Text style={styles.subtitle}>Learn how to build basic sentences in Levantine Arabic</Text>

            {patterns.map((item, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="construct-outline" size={20} color="#6200ee" />
                        <Text style={styles.patternText}>{item.pattern}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <View style={styles.exampleContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>English:</Text>
                                <Text style={styles.textContent}>{item.english}</Text>
                            </View>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Arabic:</Text>
                                <Text style={styles.arabicText}>{item.arabic}</Text>
                            </View>
                            <View style={styles.labelContainer}>
                                <Text style={styles.label}>Transliteration:</Text>
                                <Text style={styles.textContent}>{item.transliteration}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            ))}

            <View style={styles.guideCard}>
                <View style={styles.guideHeader}>
                    <Ionicons name="book-outline" size={20} color="#6200ee" />
                    <Text style={styles.guideHeaderText}>Quick Guide</Text>
                </View>
                <View style={styles.guideContent}>
                    <Text style={styles.guideText}>
                        Levantine Arabic sentence structure is relatively flexible, but there are some common patterns
                        that can help you construct basic sentences.
                    </Text>
                    {tips.map((tip, index) => (
                        <View key={index} style={styles.tipContainer}>
                            <Ionicons name="chevron-forward" size={16} color="#6200ee" />
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ee',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    patternText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 12,
    },
    cardContent: {
        padding: 16,
    },
    exampleContainer: {
        gap: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        color: '#6200ee',
        width: 100,
        fontWeight: '600',
        paddingEnd: 20
    },
    textContent: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    arabicText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        textAlign: 'left',
    },
    guideCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 8,
        marginBottom: 20,
        overflow: 'hidden',
    },
    guideHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    guideHeaderText: {
        marginLeft: 8,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    guideContent: {
        padding: 16,
    },
    guideText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 16,
        lineHeight: 20,
    },
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingLeft: 4,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        lineHeight: 20,
    },
});