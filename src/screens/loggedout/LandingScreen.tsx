import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { Colours, Typography, ComponentStyles } from '../../styles/shared';
import { logoStrip, arabesque } from '../../utils/assetUtils';
import SharedBackground from '../../components/customComponents/SharedBackground';
import { ClashText } from '../../components/customComponents/ClashTexts';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 1500);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colours.decorative.purple} />
                <ClashText style={styles.loadingText}>Loading...</ClashText>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <SharedBackground>
                <BlurView
                    intensity={3}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                />

                <View style={styles.content}>
                    <Image
                        source={arabesque}
                        style={styles.arabesque}
                        resizeMode="contain"
                    />

                    <View style={styles.mainContent}>
                        <ClashText style={styles.arabicTitle}>متعلمو العربية</ClashText>
                        <ClashText style={styles.subtitle}>welcome to my arabic learner</ClashText>

                        <Image
                            source={logoStrip}
                            style={styles.arabesque}
                            resizeMode="contain"
                        />

                    </View>

                    <View style={styles.ctaContent}>
                        <TouchableOpacity
                            style={styles.ctaButton}
                            onPress={() => navigation.navigate('LoginScreen')}
                        >
                            <ClashText style={styles.ctaButtonText}>i want to learn arabic NOW</ClashText>
                        </TouchableOpacity>
                    </View>
                </View>
            </SharedBackground>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colours.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 30,
    },
    arabesque: {
        width: width,
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    mainContent: {
        flex: 1,
    },
    arabicTitle: {
        ...Typography.arabicRuqaaBold,
        fontSize: 80,
        color: Colours.decorative.gold,
        textAlign: 'center',
        marginBottom: 16,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        fontWeight: '700',
    },
    subtitle: {
        ...Typography.headingMedium,
        color: Colours.decorative.copper,
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 16,
    },
    ctaContent: {
        marginBottom: 30,
    },
    ctaButton: {
        backgroundColor: Colours.decorative.purple,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        width: width * 0.8,
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    ctaButtonText: {
        ...Typography.body,
        color: Colours.text.inverse,
        fontSize: 18,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: Colours.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        ...Typography.body,
        marginTop: 16,
    },
});
