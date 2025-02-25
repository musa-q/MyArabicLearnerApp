import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { LearnStackParamList } from '../../../types/navigation';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';
import { Colours, Typography } from '../../../styles/shared';
import { ClashText } from '../../../components/customComponents/ClashTexts';

const { width } = Dimensions.get('window');

type LearnScreenNavigationProp = NativeStackNavigationProp<LearnStackParamList>;

export default function LearnScreen() {
    const navigation = useNavigation<LearnScreenNavigationProp>();

    return (
        <MainPageLayout>
            <View style={styles.headerSection}>
                <ClashText style={[styles.arabicTitle, { lineHeight: 120, }]}>تعلّم</ClashText>
                <ClashText style={styles.subtitle}>choose your learning path</ClashText>
            </View>

            <View style={styles.contentSection}>
                <ClashText style={styles.sectionTitle}>learning modules</ClashText>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colours.decorative.purple }]}
                    onPress={() => navigation.navigate('Flashcards')}
                >
                    <MaterialCommunityIcons name="card-text" size={24} color="white" />
                    <ClashText style={styles.actionButtonText}>flashcards</ClashText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colours.decorative.teal }]}
                    onPress={() => navigation.navigate('VocabTable')}
                >
                    <Ionicons name="book-outline" size={24} color="white" />
                    <ClashText style={styles.actionButtonText}>vocabulary table</ClashText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colours.decorative.copper }]}
                    onPress={() => navigation.navigate('VerbConjugationTable')}
                >
                    <MaterialCommunityIcons name="table" size={24} color="white" />
                    <ClashText style={styles.actionButtonText}>verb conjugation</ClashText>
                </TouchableOpacity>
            </View>

            <View style={styles.resourcesSection}>
                <ClashText style={styles.sectionTitle}>learning resources</ClashText>

                <TouchableOpacity
                    style={styles.resourceCard}
                    onPress={() => navigation.navigate('CheatSheetScreen')}
                >
                    <View style={styles.resourceHeader}>
                        <MaterialCommunityIcons
                            name="notebook-outline"
                            size={24}
                            color={Colours.decorative.gold}
                        />
                        <ClashText style={styles.resourceTitle}>cheatsheets</ClashText>
                    </View>
                    <ClashText style={styles.resourceDescription}>
                        quick reference guides for grammar rules, common phrases, and essential vocabulary
                    </ClashText>
                </TouchableOpacity>

                <TouchableOpacity style={styles.resourceCard}>
                    <View style={styles.resourceHeader}>
                        <MaterialCommunityIcons
                            name="school-outline"
                            size={24}
                            color={Colours.decorative.gold}
                        />
                        <ClashText style={styles.resourceTitle}>study tips</ClashText>
                    </View>
                    <ClashText style={styles.resourceDescription}>
                        effective strategies and methods for mastering arabic language learning
                    </ClashText>
                </TouchableOpacity>
            </View>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    headerSection: {
        // paddingVertical: 20,
        alignItems: 'center',
    },
    arabicTitle: {
        ...Typography.arabicRuqaaBold,
        fontSize: 60,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.copper,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 16,
    },
    contentSection: {
        padding: 20,
    },
    sectionTitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        marginBottom: 15,
    },
    actionButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    actionButtonText: {
        ...Typography.body,
        color: Colours.text.inverse,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    resourcesSection: {
        padding: 20,
    },
    resourceCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    resourceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    resourceTitle: {
        ...Typography.headingMedium,
        fontSize: 20,
        marginLeft: 10,
        color: Colours.decorative.gold,
    },
    resourceDescription: {
        ...Typography.body,
        color: Colours.text.secondary,
    },
});