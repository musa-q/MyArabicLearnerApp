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

interface PossessiveEnding {
    pronoun: string;
    ending: string;
    example: string;
}

export default function PossessiveEndingsScreen() {
    const endings: PossessiveEnding[] = [
        { pronoun: "my", ending: "ي", example: "كتابي (kitabi) - my book" },
        { pronoun: "your (m)", ending: "كَ", example: "كتابكَ (kitabuka) - your book (M)" },
        { pronoun: "your (f)", ending: "كِ", example: "كتابكِ (kitabuki) - your book (F)" },
        { pronoun: "his", ending: "ه", example: "كتابُه (kitabuhu) - his book" },
        { pronoun: "her", ending: "ها", example: "كتابُها (kitabuha) - her book" },
        { pronoun: "their", ending: "هم", example: "كتابُهم (kitabuhum) - their book" },
        { pronoun: "our", ending: "نا", example: "كتابُنا (kitabuna) - our book" },
    ];

    return (
        <MainPageLayout>
            <ScrollView style={styles.container}>
                <ClashText style={styles.title}>possessive endings in arabic</ClashText>
                <ClashText style={styles.subtitle}>master the art of showing possession in levantine arabic</ClashText>

                {endings.map((item, index) => (
                    <View key={index} style={styles.card}>
                        <View style={styles.cardHeader}>
                            <View style={styles.pronounContainer}>
                                <MaterialCommunityIcons name="account-outline" size={20} color={Colours.decorative.purple} />
                                <ClashText style={styles.pronounText}>{item.pronoun}</ClashText>
                            </View>
                            <ClashText style={styles.endingText}>{item.ending}</ClashText>
                        </View>
                        <View style={styles.cardContent}>
                            <ClashText style={styles.exampleText}>{item.example}</ClashText>
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
                            in jordanian arabic, possessive endings are attached to nouns to show ownership or belonging.
                            these endings change based on who owns the item.
                        </ClashText>
                        <ClashText style={styles.guideText}>
                            for example, "كتابي" (kitābī) means "my book", where the ending "ي" (ī) indicates possession by the speaker.
                            the word "كتابُه" (kitābuhu) means "his book", with the ending "ه" (hu) showing possession by a male.
                        </ClashText>
                        <ClashText style={styles.guideText}>
                            notice how the endings change based on gender - "كتابكَ" (kitābuka) for males and "كتابكِ" (kitābuki) for females.
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colours.secondary,
        borderBottomOpacity: 0.2,
        backgroundColor: 'rgba(245, 240, 230, 0.5)',
    },
    pronounContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    pronounText: {
        ...Typography.headingMedium,
        fontSize: 18,
        color: Colours.text.primary,
        marginLeft: 8,
    },
    endingText: {
        ...Typography.arabic,
        fontSize: 24,
        color: Colours.decorative.purple,
        fontWeight: '600',
    },
    cardContent: {
        padding: 16,
    },
    exampleText: {
        ...Typography.body,
        fontSize: 16,
        color: Colours.text.secondary,
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
        marginBottom: 12,
        lineHeight: 20,
    },
});