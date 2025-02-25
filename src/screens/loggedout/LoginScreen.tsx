import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    Dimensions,
    Image,
    Platform,
    StatusBar,
} from 'react-native';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { API_URL } from '../../config/api';
import { useAuth } from '../../contexts/AuthContext';
import { authManager } from '../../utils/authManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colours, Typography, ComponentStyles } from '../../styles/shared';
import { logoStrip, arabesque } from '../../utils/assetUtils';
import SharedBackground from '../../components/customComponents/SharedBackground';
import { ClashText, ClashTextInput } from '../../components/customComponents/ClashTexts';

const { width, height } = Dimensions.get('window');

interface LoginState {
    email: string;
    username: string;
    token: string;
    isLoading: boolean;
    showToken: boolean;
    isNewUser: boolean;
    message: string;
}

export default function LoginScreen() {
    const [state, setState] = useState<LoginState>({
        email: '',
        username: '',
        token: '',
        isLoading: false,
        showToken: false,
        isNewUser: false,
        message: '',
    });
    const { login } = useAuth();

    useEffect(() => {
        const checkStoredEmail = async () => {
            try {
                const storedEmail = await AsyncStorage.getItem('email');
                if (storedEmail) {
                    setState(prev => ({ ...prev, email: storedEmail }));
                }
            } catch (error) {
                console.error('error checking stored email:', error);
            }
        };

        checkStoredEmail();
    }, []);

    const handleLogin = async () => {
        if (!state.email.trim()) {
            Alert.alert('Error', 'please enter an email address');
            return;
        }

        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const deviceId = await authManager.getDeviceId();
            const payload = {
                email: state.email,
                username: state.isNewUser ? state.username : undefined,
                device_id: deviceId,
            };

            const response = await axios.post(`${API_URL}/auth/login`, payload);
            setState(prev => ({
                ...prev,
                showToken: true,
                message: response.data.message.toLowerCase(),
            }));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setState(prev => ({
                        ...prev,
                        isNewUser: true,
                        message: 'user not found. please enter a username to create an account.',
                    }));
                } else {
                    Alert.alert(
                        'Error',
                        error.response?.data?.error || 'an error occurred'
                    );
                }
            }
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleVerify = async () => {
        if (!state.token.trim()) {
            Alert.alert('Error', 'please enter the token');
            return;
        }

        setState(prev => ({ ...prev, isLoading: true }));
        try {
            const deviceId = await authManager.getDeviceId();
            const response = await axios.post(`${API_URL}/auth/verify`, {
                email: state.email,
                token: state.token,
                device_id: deviceId,
            });

            await login(
                response.data.token,
                response.data.refresh_token,
                state.email
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert(
                    'Error',
                    error.response?.data?.error.toLowerCase() || 'failed to verify token'
                );
            }
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

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
                        source={logoStrip}
                        style={styles.arabesque}
                        resizeMode="contain"
                    />

                    {/* <ClashText style={styles.arabicTitle}>تسجيل الدخول / التسجيل</ClashText> */}
                    <ClashText style={styles.subtitle}>login / signup</ClashText>

                    <View style={styles.formContainer}>
                        {!state.showToken ? (
                            <>
                                <ClashTextInput
                                    style={styles.input}
                                    placeholder="enter email"
                                    value={state.email}
                                    onChangeText={(text) =>
                                        setState(prev => ({ ...prev, email: text }))}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                    editable={!state.isLoading}
                                    placeholderTextColor={Colours.text.secondary}
                                />

                                {state.isNewUser && (
                                    <ClashTextInput
                                        style={styles.input}
                                        placeholder="enter username"
                                        value={state.username}
                                        onChangeText={(text) =>
                                            setState(prev => ({ ...prev, username: text }))}
                                        autoCapitalize="none"
                                        editable={!state.isLoading}
                                        placeholderTextColor={Colours.text.secondary}
                                    />
                                )}

                                <TouchableOpacity
                                    style={[styles.button, state.isLoading && styles.buttonDisabled]}
                                    onPress={handleLogin}
                                    disabled={state.isLoading}
                                >
                                    {state.isLoading ? (
                                        <ActivityIndicator color={Colours.text.inverse} />
                                    ) : (
                                        <ClashText style={styles.buttonText}>
                                            {state.isNewUser ? 'create Account' : 'send login token'}
                                        </ClashText>
                                    )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <ClashTextInput
                                    style={styles.input}
                                    placeholder="enter token"
                                    value={state.token}
                                    onChangeText={(text) =>
                                        setState(prev => ({ ...prev, token: text }))}
                                    editable={!state.isLoading}
                                    placeholderTextColor={Colours.text.secondary}
                                />

                                <TouchableOpacity
                                    style={[styles.button, state.isLoading && styles.buttonDisabled]}
                                    onPress={handleVerify}
                                    disabled={state.isLoading}
                                >
                                    {state.isLoading ? (
                                        <ActivityIndicator color={Colours.text.inverse} />
                                    ) : (
                                        <ClashText style={styles.buttonText}>verify token</ClashText>
                                    )}
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {state.message && (
                        <ClashText style={styles.message}>{state.message}</ClashText>
                    )}

                    <Image
                        source={arabesque}
                        style={[styles.arabesque, styles.bottomArabesque]}
                        resizeMode="contain"
                    />
                </View>
            </SharedBackground >
        </View >
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
    bottomArabesque: {
        position: 'absolute',
        bottom: 20,
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
        color: Colours.decorative.gold,
        fontSize: 32,
        textAlign: 'center',
        marginBottom: 30,
    },
    formContainer: {
        width: width * 0.85,
        alignItems: 'center',
    },
    input: {
        ...ComponentStyles.input,
        width: '100%',
        marginBottom: 16,
        backgroundColor: Colours.surface,
        color: Colours.text.primary,
        fontWeight: 100,
    },
    button: {
        backgroundColor: Colours.decorative.purple,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        width: '100%',
        alignItems: 'center',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: Colours.decorative.purple,
        opacity: 0.7,
    },
    buttonText: {
        ...Typography.body,
        color: Colours.text.inverse,
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        backgroundColor: Colours.decorative.teal,
        color: Colours.text.inverse,
        borderColor: Colours.decorative.teal,
        textAlign: 'center',
        padding: 16,
        borderRadius: 12,
        marginTop: 30,
        width: width * 0.85,
        // shadowColor: 'rgb(0, 0, 0)',
        // shadowOffset: { width: 2, height: 2 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
        // elevation: 4,
        borderWidth: 1,
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
    },
});