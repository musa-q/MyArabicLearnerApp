import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PluralExample {
    pattern: string;
    arabic: string;
    transliteration: string;
    english: string;
}

export default function PluralisationScreen() {
    const pluralExamples: PluralExample[] = [
        { pattern: "Sound Masculine", arabic: "معلّم -> معلّمون", transliteration: "muʿallim -> muʿallimūn", english: "Teacher -> Teachers (m)" },
        { pattern: "Sound Feminine", arabic: "معلّمة -> معلّمات", transliteration: "muʿallima -> muʿallimāt", english: "Teacher -> Teachers (f)" },
        { pattern: "Broken Plural 1", arabic: "كتاب -> كتب", transliteration: "kitāb -> kutub", english: "Book -> Books" },
        { pattern: "Broken Plural 2", arabic: "مدينة -> مدن", transliteration: "madīna -> mudun", english: "City -> Cities" },
    ];

    const tips = [
        "Sound plurals add endings based on gender: '-ūn' (masculine) or '-āt' (feminine).",
        "Broken plurals involve changing the structure of the singular word.",
        "Master common broken plural patterns to improve fluency.",
        "Pay attention to context, as some words might use irregular plurals."
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Pluralisation in Arabic</Text>
            <Text style={styles.subtitle}>Learn how to form plurals in Levantine Arabic</Text>

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

                {pluralExamples.map((example, index) => (
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
                    <Ionicons name="layers-outline" size={20} color="#6200ee" />
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
                        Pluralisation in Arabic is a mix of patterns and structures. While sound plurals
                        follow predictable rules, broken plurals require memorization of specific forms.
                        Practice with real-world examples to master this important skill!
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
        paddingLeft: 4,
    },
    tipText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        lineHeight: 20,
    },
    guideText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        lineHeight: 20,
        paddingHorizontal: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#ef4444',
        textAlign: 'center',
        marginTop: 8,
    },
});