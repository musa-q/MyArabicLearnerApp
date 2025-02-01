import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface NegationExample {
    pattern: string;
    arabic: string;
    transliteration: string;
    english: string;
}

export default function NegationScreen() {
    const negationExamples: NegationExample[] = [
        { pattern: "ما + Verb", arabic: "ما بحكي", transliteration: "ma bəhki", english: "I don't speak" },
        { pattern: "مش + Adjective", arabic: "مش تعبان", transliteration: "mish taʿban", english: "Not tired" },
        { pattern: " رح + ما + Verb (Future)", arabic: "ما رح أروح", transliteration: "ma raḥ arūḥ", english: "I will not go" },
        { pattern: "ولا + Noun", arabic: "ما عندي ولا كتاب", transliteration: "ma ʿindi wala kitab", english: "I don't have a single book" },
    ];

    const tips = [
        "Use 'ما' (ma) before verbs to negate actions.",
        "For negating adjectives, use 'مش' (mish).",
        "Future tense negation combines 'ما' (ma) with 'رح' (raḥ).",
        "'ولا' (wala) is used for emphatic negation, meaning 'not a single'."
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Negation in Arabic</Text>
            <Text style={styles.subtitle}>Learn how to negate sentences and phrases in Levantine Arabic</Text>

            <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Pattern</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Arabic</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>English</Text>
                    </View>
                </View>

                {negationExamples.map((example, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tableRow,
                            index % 2 === 0 ? styles.evenRow : styles.oddRow
                        ]}
                    >
                        <View style={styles.cell}>
                            <Text style={styles.patternText}>{example.pattern}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.arabicText}>{example.arabic}</Text>
                            <Text style={styles.translitText}>{example.transliteration}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.englishText}>{example.english}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={styles.guideCard}>
                <View style={styles.guideHeader}>
                    <Ionicons name="book-outline" size={20} color="#6200ee" />
                    <Text style={styles.guideHeaderText}>Quick Guide</Text>
                </View>
                <View style={styles.guideContent}>
                    {tips.map((tip, index) => (
                        <View key={index} style={styles.tipContainer}>
                            <Ionicons name="chevron-forward" size={16} color="#6200ee" />
                            <Text style={styles.tipText}>{tip}</Text>
                        </View>
                    ))}
                    <Text style={styles.guideText}>
                        Negation is a fundamental part of constructing sentences in Arabic.
                        By mastering the different negation patterns, you can express ideas clearly
                        and effectively in Levantine Arabic.
                    </Text>
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
    tableCard: {
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
        marginBottom: 20,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    evenRow: {
        backgroundColor: '#f8f9fa',
    },
    oddRow: {
        backgroundColor: '#fff',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    patternText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    arabicText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 4,
    },
    translitText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
    englishText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
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
    tipContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    guideText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        lineHeight: 20,
    },
});