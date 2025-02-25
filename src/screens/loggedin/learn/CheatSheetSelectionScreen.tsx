import React from 'react';
import {
    View,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CheatSheetStackParamList } from '../../../types/navigation';
import { ClashText } from '../../../components/customComponents/ClashTexts';
import { Colours, Typography, ComponentStyles } from '../../../styles/shared';
import MainPageLayout from '../../../components/customComponents/MainPageLayout';

type CheatSheetScreenNavigationProp = NativeStackNavigationProp<CheatSheetStackParamList>;

export default function CheatSheetSelectionScreen() {
    const navigation = useNavigation<CheatSheetScreenNavigationProp>();

    return (
        <MainPageLayout>
            <View style={styles.container}>
                <View style={styles.contentSection}>
                    <ClashText style={styles.title}>
                        cheat sheets
                    </ClashText>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('VerbCheatSheet')}
                    >
                        <MaterialCommunityIcons name="book-open-variant" size={24} color={Colours.text.secondary} />
                        <ClashText style={styles.buttonText}>verb conjugation</ClashText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('SentenceConstruction')}
                    >
                        <MaterialCommunityIcons name="format-text" size={24} color={Colours.text.secondary} />
                        <ClashText style={styles.buttonText}>sentence construction</ClashText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('PossessiveEndings')}
                    >
                        <MaterialCommunityIcons name="card-text-outline" size={24} color={Colours.text.secondary} />
                        <ClashText style={styles.buttonText}>possessive endings</ClashText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Negation')}
                    >
                        <MaterialCommunityIcons name="text-box-remove-outline" size={24} color={Colours.text.secondary} />
                        <ClashText style={styles.buttonText}>negation</ClashText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => navigation.navigate('Pluralisation')}
                    >
                        <MaterialCommunityIcons name="text-box-multiple-outline" size={24} color={Colours.text.secondary} />
                        <ClashText style={styles.buttonText}>pluralisation</ClashText>
                    </TouchableOpacity>
                </View>
            </View>
        </MainPageLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: 'transparent',
    },
    contentSection: {
        marginBottom: 30,
    },
    title: {
        ...Typography.headingMedium,
        color: Colours.decorative.gold,
        fontSize: 28,
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        marginBottom: 30,
    },
    button: {
        backgroundColor: Colours.surface,
        borderColor: Colours.secondary,
        borderWidth: 1,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        ...Typography.body,
        color: Colours.text.secondary,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});