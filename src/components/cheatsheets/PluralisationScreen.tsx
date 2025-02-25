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

interface PluralExample {
    pattern: string;
    arabic: string;
    transliteration: string;
    english: string;
}

export default function PluralisationScreen() {
    const pluralExamples: PluralExample[] = [
        { pattern: "sound masculine", arabic: "معلّم -> معلّمون", transliteration: "muʿallim -> muʿallimūn", english: "teacher -> teachers (m)" },
        { pattern: "sound feminine", arabic: "معلّمة -> معلّمات", transliteration: "muʿallima -> muʿallimāt", english: "teacher -> teachers (f)" },
        { pattern: "broken plural 1", arabic: "كتاب -> كتب", transliteration: "kitāb -> kutub", english: "book -> books" },
        { pattern: "broken plural 2", arabic: "مدينة -> مدن", transliteration: "madīna -> mudun", english: "city -> cities" },
    ];

    const tips = [
        "sound plurals add endings based on gender: '-ūn' (masculine) or '-āt' (feminine).",
        "broken plurals involve changing the structure of the singular word.",
        "master common broken plural patterns to improve fluency.",
        "pay attention to context, as some words might use irregular plurals."
    ];

    return (
        <MainPageLayout>
            <ScrollView style={styles.container}>
                <ClashText style={styles.title}>pluralisation in arabic</ClashText>
                <ClashText style={styles.subtitle}>learn how to form plurals in levantine arabic</ClashText>

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

                    {pluralExamples.map((example, index) => (
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
                        <MaterialCommunityIcons name="layers-outline" size={20} color={Colours.decorative.purple} />
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
                            pluralisation in arabic is a mix of patterns and structures. while sound plurals
                            follow predictable rules, broken plurals require memorization of specific forms.
                            practice with real-world examples to master this important skill!
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
        paddingLeft: 4,
    },
    tipText: {
        ...Typography.body,
        flex: 1,
        fontSize: 14,
        color: Colours.text.secondary,
        marginLeft: 8,
        lineHeight: 20,
    },
    guideText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.secondary,
        marginTop: 8,
        lineHeight: 20,
        paddingHorizontal: 4,
    },
});