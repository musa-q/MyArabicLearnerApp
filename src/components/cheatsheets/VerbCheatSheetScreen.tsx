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
        <MainPageLayout>
            <ScrollView style={styles.container}>
                <ClashText style={styles.title}>verb conjugation in arabic</ClashText>
                <ClashText style={styles.subtitle}>master verb tenses in levantine arabic</ClashText>

                <View style={styles.tableCard}>
                    <View style={styles.tableHeader}>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>pronoun</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>past</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>present</ClashText>
                        </View>
                        <View style={styles.headerCell}>
                            <ClashText style={styles.headerText}>future</ClashText>
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
                                <ClashText style={styles.arabicText}>{row.pronoun}</ClashText>
                            </View>
                            <View style={styles.cell}>
                                <ClashText style={styles.arabicText}>{row.past}</ClashText>
                            </View>
                            <View style={styles.cell}>
                                <ClashText style={styles.arabicText}>{row.present}</ClashText>
                            </View>
                            <View style={styles.cell}>
                                <ClashText style={styles.arabicText}>{row.future}</ClashText>
                            </View>
                        </View>
                    ))}
                </View>

                <View style={styles.guideCard}>
                    <View style={styles.guideHeader}>
                        <MaterialCommunityIcons name="book-open-variant" size={20} color={Colours.decorative.purple} />
                        <ClashText style={styles.guideHeaderText}>quick guide</ClashText>
                    </View>
                    <View style={styles.guideContent}>
                        <ClashText style={styles.guideText}>
                            in levantine arabic, verbs are conjugated differently based on the pronoun and tense.
                            the examples above show the conjugation of the verb "نام" (nama) meaning "to sleep" in the past, present, and future tenses.
                        </ClashText>
                        <ClashText style={styles.guideText}>
                            for the present tense, levantine arabic typically uses the prefix "بـ" (b-) attached to the verb. for example,
                            "بنام" (banam) means "i sleep" or "i am sleeping".
                        </ClashText>
                        <ClashText style={styles.guideText}>
                            the future tense is formed by adding the particle "رح" (rah) before the present tense verb. for instance,
                            "رح أنام" (rah anam) means "i will sleep".
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
    arabicText: {
        ...Typography.arabic,
        fontSize: 16,
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
    guideText: {
        ...Typography.body,
        fontSize: 14,
        color: Colours.text.secondary,
        marginBottom: 12,
        lineHeight: 20,
    },
});