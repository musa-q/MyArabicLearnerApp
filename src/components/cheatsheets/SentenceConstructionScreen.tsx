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

interface Pattern {
    pattern: string;
    arabic: string;
    transliteration: string;
    english: string;
}

export default function SentenceConstructionScreen() {
    const patterns: Pattern[] = [
        {
            pattern: "subject + verb + object",
            arabic: "أنا بشرب قهوة",
            transliteration: "ana bashrab qahwa",
            english: "i drink coffee"
        },
        {
            pattern: "subject + verb + location",
            arabic: "هو بروح عالسوق",
            transliteration: "huwe biruh 'al-souq",
            english: "he goes to the market"
        },
        {
            pattern: "verb + object + time",
            arabic: "أكلت الغدا الساعة تنتين",
            transliteration: "akalt el-ghada el-sa'a tintayn",
            english: "i ate lunch at 2 o'clock"
        },
        {
            pattern: "subject + adjective + noun",
            arabic: "عندي سيارة حمرا",
            transliteration: "'indi sayara hamra",
            english: "i have a red car"
        }
    ];

    const tips = [
        "unlike english, arabic verbs usually come before the subject in formal speech",
        "adjectives come after the noun they describe",
        "time expressions usually come at the end of the sentence",
        "in levantine arabic, we often start with the subject followed by the verb"
    ];

    return (
        <MainPageLayout>
            <ScrollView style={styles.container}>
                <ClashText style={styles.title}>sentence construction in arabic</ClashText>
                <ClashText style={styles.subtitle}>learn how to build basic sentences in levantine arabic</ClashText>

                {patterns.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="format-paragraph" size={20} color={Colours.decorative.teal} />
                            <ClashText style={styles.patternText}>{item.pattern}</ClashText>
                        </View>
                        <View style={styles.cardContent}>
                            <View style={styles.exampleContainer}>
                                <View style={styles.labelContainer}>
                                    <ClashText style={styles.label}>english</ClashText>
                                    <ClashText style={styles.textContent}>{item.english}</ClashText>
                                </View>
                                <View style={styles.labelContainer}>
                                    <ClashText style={styles.label}>arabic</ClashText>
                                    <ClashText style={styles.arabicText}>{item.arabic}</ClashText>
                                </View>
                                <View style={styles.labelContainer}>
                                    <ClashText style={styles.label}>transliteration</ClashText>
                                    <ClashText style={styles.textContent}>{item.transliteration}</ClashText>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}

                <View style={styles.guideCard}>
                    <View style={styles.guideHeader}>
                        <MaterialCommunityIcons name="book-open-variant" size={20} color={Colours.decorative.purple} />
                        <ClashText style={styles.guideHeaderText}>quick guide</ClashText>
                    </View>
                    <View style={styles.guideContent}>
                        <ClashText style={styles.guideText}>
                            levantine arabic sentence structure is relatively flexible, but there are some common patterns
                            that can help you construct basic sentences.
                        </ClashText>
                        {tips.map((tip, index) => (
                            <View key={index} style={styles.tipContainer}>
                                <MaterialCommunityIcons name="chevron-right" size={16} color={Colours.decorative.purple} />
                                <ClashText style={styles.tipText}>{tip}</ClashText>
                            </View>
                        ))}
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
    card: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(245, 240, 230, 0.5)',
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
    },
    patternText: {
        ...Typography.headingMedium,
        fontSize: 16,
        color: Colours.text.primary,
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
        ...Typography.body,
        fontSize: 14,
        color: Colours.decorative.teal,
        width: 100,
        fontWeight: '600',
        paddingEnd: 20
    },
    textContent: {
        ...Typography.body,
        flex: 1,
        fontSize: 14,
        color: Colours.text.primary,
    },
    arabicText: {
        ...Typography.arabic,
        flex: 1,
        fontSize: 16,
        color: Colours.text.primary,
        textAlign: 'left',
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
        marginTop: 8,
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
        ...Typography.body,
        flex: 1,
        fontSize: 14,
        color: Colours.text.secondary,
        marginLeft: 8,
        lineHeight: 20,
    },
});