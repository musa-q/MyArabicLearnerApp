import React from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ClashText } from '../customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../styles/shared';
import MainPageLayout from '../../components/customComponents/MainPageLayout';

interface NegationExample {
    pattern: string;
    arabic: string;
    transliteration: string;
    english: string;
}

export default function NegationScreen() {
    const negationExamples: NegationExample[] = [
        { pattern: "ما + verb", arabic: "ما بحكي", transliteration: "ma bəhki", english: "i don't speak" },
        { pattern: "مش + adjective", arabic: "مش تعبان", transliteration: "mish taʿban", english: "not tired" },
        { pattern: " رح + ما + verb (future)", arabic: "ما رح أروح", transliteration: "ma raḥ arūḥ", english: "i will not go" },
        { pattern: "ولا + noun", arabic: "ما عندي ولا كتاب", transliteration: "ma ʿindi wala kitab", english: "i don't have a single book" },
    ];

    const tips = [
        "use 'ما' (ma) before verbs to negate actions.",
        "for negating adjectives, use 'مش' (mish).",
        "future tense negation combines 'ما' (ma) with 'رح' (raḥ).",
        "'ولا' (wala) is used for emphatic negation, meaning 'not a single'."
    ];

    return (
        <MainPageLayout>
            <ScrollView style={styles.container}>
                <ClashText style={styles.title}>negation in arabic</ClashText>
                <ClashText style={styles.subtitle}>learn how to negate sentences and phrases in levantine arabic</ClashText>

                <View style={styles.tableCard}>
                    <View style={styles.tableHeader}>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>pattern</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>arabic</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>english</ClashText>
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
                                <ClashText style={styles.patternText}>{example.pattern}</ClashText>
                            </View>
                            <View style={styles.cell}>
                                <ClashText style={styles.arabicText}>{example.arabic}</ClashText>
                                <ClashText style={styles.translitText}>{example.transliteration}</ClashText>
                            </View>
                            <View style={styles.cell}>
                                <ClashText style={styles.englishText}>{example.english}</ClashText>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.guideCard}>
                    <View style={styles.guideHeader}>
                        <MaterialCommunityIcons name="book-outline" size={20} color={Colours.decorative.purple} />
                        <ClashText style={styles.guideHeaderText}>quick guide</ClashText>
                    </View>
                    <View style={styles.guideContent}>
                        {tips.map((tip, index) => (
                            <View key={index} style={styles.tipContainer}>
                                <MaterialCommunityIcons name="chevron-right" size={16} color={Colours.decorative.purple} />
                                <ClashText style={styles.tipText}>{tip}</ClashText>
                            </View>
                        ))}
                        <ClashText style={styles.guideText}>
                            negation is a fundamental part of constructing sentences in arabic.
                            by mastering the different negation patterns, you can express ideas clearly
                            and effectively in levantine arabic.
                        </ClashText>
                    </View>
                </View>
            </ScrollView>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: 20,
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        ...Typography.body,
        color: Colours.decorative.copper,
        textAlign: 'center',
        marginBottom: 20,
    },
    tableCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
        overflow: 'hidden',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colours.decorative.teal,
        paddingVertical: 12,
        paddingHorizontal: 8,
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        color: Colours.text.inverse,
        fontSize: 14,
        fontWeight: '600',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
    },
    evenRow: {
        backgroundColor: 'rgba(245, 240, 230, 0.5)', // Slightly tinted background
    },
    oddRow: {
        backgroundColor: Colours.surface,
    },
    cell: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    patternText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.primary,
        textAlign: 'center',
    },
    arabicText: {
        ...Typography.arabic,
        fontSize: 16,
        color: Colours.text.primary,
        textAlign: 'center',
        marginBottom: 4,
    },
    translitText: {
        ...Typography.body,
        fontSize: 12,
        color: Colours.decorative.copper,
        textAlign: 'center',
    },
    englishText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.primary,
        textAlign: 'center',
    },
    guideCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 20,
        overflow: 'hidden',
    },
    guideHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
    },
    guideHeaderText: {
        ...Typography.headingMedium,
        marginLeft: 8,
        fontSize: 18,
        color: Colours.text.primary,
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
        ...Typography.body,
        flex: 1,
        fontSize: 14,
        color: Colours.text.secondary,
        marginLeft: 8,
    },
    guideText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.secondary,
        marginTop: 8,
        lineHeight: 20,
    },
});