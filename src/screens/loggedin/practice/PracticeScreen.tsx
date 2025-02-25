import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { PracticeStackParamList } from '../../../types/navigation';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';
import { Colours, Typography } from '../../../styles/shared';
import { ClashText } from '../../../components/customComponents/ClashTexts';

const { width } = Dimensions.get('window');

type PracticeScreenNavigationProp = NativeStackNavigationProp<PracticeStackParamList>;

export default function PracticeScreen() {
    const navigation = useNavigation<PracticeScreenNavigationProp>();

    return (
        <MainPageLayout>
            <View style={styles.headerSection}>
                <ClashText style={styles.arabicTitle}>تدرب</ClashText>
                <ClashText style={styles.subtitle}>test your knowledge</ClashText>
            </View>

            <View style={styles.quizSection}>
                <ClashText style={styles.sectionTitle}>available quizzes</ClashText>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colours.decorative.purple }]}
                    onPress={() => navigation.navigate('VocabQuiz')}
                >
                    <MaterialCommunityIcons name="clipboard-list" size={24} color="white" />
                    <ClashText style={styles.actionButtonText}>vocabulary quiz</ClashText>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: Colours.decorative.teal }]}
                    onPress={() => navigation.navigate('VerbConjugationQuiz')}
                >
                    <MaterialCommunityIcons name="format-text-variant" size={24} color="white" />
                    <ClashText style={styles.actionButtonText}>verb conjugation quiz</ClashText>
                </TouchableOpacity>
            </View>

            <View style={styles.statsSection}>
                <ClashText style={styles.sectionTitle}>your progress</ClashText>

                <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                        <MaterialCommunityIcons
                            name="star"
                            size={24}
                            color={Colours.decorative.gold}
                        />
                        <View style={styles.statContent}>
                            <ClashText style={styles.statTitle}>quiz accuracy</ClashText>
                            <ClashText style={styles.statValue}>85%</ClashText>
                        </View>
                    </View>

                    <View style={styles.statItem}>
                        <MaterialCommunityIcons
                            name="clock-outline"
                            size={24}
                            color={Colours.decorative.gold}
                        />
                        <View style={styles.statContent}>
                            <ClashText style={styles.statTitle}>practice streak</ClashText>
                            <ClashText style={styles.statValue}>7 days</ClashText>
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.challengeSection}>
                <ClashText style={styles.sectionTitle}>daily challenge</ClashText>

                <TouchableOpacity style={styles.challengeCard}>
                    <View style={styles.challengeHeader}>
                        <MaterialCommunityIcons
                            name="trophy"
                            size={24}
                            color={Colours.decorative.gold}
                        />
                        <ClashText style={styles.challengeTitle}>today's challenge</ClashText>
                    </View>
                    <ClashText style={styles.challengeDescription}>
                        Complete 3 quizzes with 90% accuracy to earn bonus points!
                    </ClashText>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: '66%' }]} />
                    </View>
                    <ClashText style={styles.progressText}>2/3 completed</ClashText>
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
        fontSize: 70,
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
    quizSection: {
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
    statsSection: {
        padding: 20,
    },
    statsCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    statContent: {
        marginLeft: 10,
    },
    statTitle: {
        ...Typography.body,
        color: Colours.text.secondary,
    },
    statValue: {
        ...Typography.headingMedium,
        fontSize: 20,
        color: Colours.decorative.gold,
    },
    challengeSection: {
        padding: 20,
    },
    challengeCard: {
        backgroundColor: Colours.surface,
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: Colours.secondary,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    challengeTitle: {
        ...Typography.headingMedium,
        fontSize: 20,
        marginLeft: 10,
        color: Colours.decorative.gold,
    },
    challengeDescription: {
        ...Typography.body,
        color: Colours.text.secondary,
        marginBottom: 15,
    },
    progressBar: {
        height: 8,
        backgroundColor: Colours.background,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        backgroundColor: Colours.decorative.teal,
        borderRadius: 4,
    },
    progressText: {
        ...Typography.body,
        color: Colours.text.secondary,
        textAlign: 'center',
    },
});