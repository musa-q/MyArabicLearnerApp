import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Conjugation {
    pronoun: string;
    past: string;
    present: string;
    future: string;
}

export default function VerbCheatsheetScreen() {
    const conjugations: Conjugation[] = [
        { pronoun: "أنا", past: "نمتُ", present: "أنام", future: "رح أنام" },
        { pronoun: "إنتَ", past: "نمتَ", present: "تنام", future: "رح تنام" },
        { pronoun: "إنتِ", past: "نمتي", present: "تنامي", future: "رح تنامي" },
        { pronoun: "هو", past: "نام", present: "ينام", future: "رح ينام" },
        { pronoun: "هي", past: "نامت", present: "تنام", future: "رح تنام" },
        { pronoun: "هم", past: "ناموا", present: "يناموا", future: "رح يناموا" },
        { pronoun: "إحنا", past: "نمنا", present: "ننام", future: "رح ننام" },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Verb Conjugation in Arabic</Text>
            <Text style={styles.subtitle}>Master verb tenses in Levantine Arabic</Text>

            <View style={styles.tableCard}>
                <View style={styles.tableHeader}>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Pronoun</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Past</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Present</Text>
                    </View>
                    <View style={styles.headerCell}>
                        <Text style={styles.headerText}>Future</Text>
                    </View>
                </View>

                {conjugations.map((row, index) => (
                    <View
                        key={index}
                        style={[
                            styles.tableRow,
                            index % 2 === 0 ? styles.evenRow : styles.oddRow
                        ]}
                    >
                        <View style={styles.cell}>
                            <Text style={styles.arabicText}>{row.pronoun}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.arabicText}>{row.past}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.arabicText}>{row.present}</Text>
                        </View>
                        <View style={styles.cell}>
                            <Text style={styles.arabicText}>{row.future}</Text>
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
                    <Text style={styles.guideText}>
                        In Levantine Arabic, verbs are conjugated differently based on the pronoun and tense.
                        The examples above show the conjugation of the verb "نام" (nama) meaning "to sleep" in the past, present, and future tenses.
                    </Text>
                    <Text style={styles.guideText}>
                        For the present tense, Levantine Arabic typically uses the prefix "بـ" (b-) attached to the verb. For example,
                        "بنام" (banam) means "I sleep" or "I am sleeping".
                    </Text>
                    <Text style={styles.guideText}>
                        The future tense is formed by adding the particle "رح" (rah) before the present tense verb. For instance,
                        "رح أنام" (rah anam) means "I will sleep".
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
    arabicText: {
        fontSize: 16,
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
    guideText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
    },
});