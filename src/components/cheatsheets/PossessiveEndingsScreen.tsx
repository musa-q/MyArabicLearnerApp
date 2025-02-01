import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PossessiveEnding {
    pronoun: string;
    ending: string;
    example: string;
}

export default function PossessiveEndingsScreen() {
    const endings: PossessiveEnding[] = [
        { pronoun: "My", ending: "ي", example: "كتابي (kitabi) - my book" },
        { pronoun: "Your (M)", ending: "كَ", example: "كتابكَ (kitabuka) - your book (M)" },
        { pronoun: "Your (F)", ending: "كِ", example: "كتابكِ (kitabuki) - your book (F)" },
        { pronoun: "His", ending: "ه", example: "كتابُه (kitabuhu) - his book" },
        { pronoun: "Her", ending: "ها", example: "كتابُها (kitabuha) - her book" },
        { pronoun: "Their", ending: "هم", example: "كتابُهم (kitabuhum) - their book" },
        { pronoun: "Our", ending: "نا", example: "كتابُنا (kitabuna) - our book" },
    ];

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Possessive Endings in Arabic</Text>
            <Text style={styles.subtitle}>Master the art of showing possession in Levantine Arabic</Text>

            {endings.map((item, index) => (
                <View key={index} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.pronounContainer}>
                            <Ionicons name="person-outline" size={20} color="#6200ee" />
                            <Text style={styles.pronounText}>{item.pronoun}</Text>
                        </View>
                        <Text style={styles.endingText}>{item.ending}</Text>
                    </View>
                    <View style={styles.cardContent}>
                        <Text style={styles.exampleText}>{item.example}</Text>
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
                        In Jordanian Arabic, possessive endings are attached to nouns to show ownership or belonging.
                        These endings change based on who owns the item.
                    </Text>
                    <Text style={styles.guideText}>
                        For example, "كتابي" (kitābī) means "my book", where the ending "ي" (ī) indicates possession by the speaker.
                        The word "كتابُه" (kitābuhu) means "his book", with the ending "ه" (hu) showing possession by a male.
                    </Text>
                    <Text style={styles.guideText}>
                        Notice how the endings change based on gender - "كتابكَ" (kitābuka) for males and "كتابكِ" (kitābuki) for females.
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    pronounContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pronounText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    endingText: {
        fontSize: 24,
        color: '#6200ee',
        fontWeight: '600',
    },
    cardContent: {
        padding: 16,
    },
    exampleText: {
        fontSize: 16,
        color: '#666',
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
        marginBottom: 12,
        lineHeight: 20,
    },
});