// src/screens/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Alert,
    Text,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { API_URL } from '../config/api';
import { useAuth } from '../contexts/AuthContext';
import { authManager } from '../utils/authManager';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
                console.error('Error checking stored email:', error);
            }
        };

        checkStoredEmail();
    }, []);

    const handleLogin = async () => {
        if (!state.email.trim()) {
            Alert.alert('Error', 'Please enter an email address');
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
                message: response.data.message,
            }));
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    setState(prev => ({
                        ...prev,
                        isNewUser: true,
                        message: 'User not found. Please enter a username to create an account.',
                    }));
                } else {
                    Alert.alert(
                        'Error',
                        error.response?.data?.error || 'An error occurred'
                    );
                }
            }
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleVerify = async () => {
        if (!state.token.trim()) {
            Alert.alert('Error', 'Please enter the token');
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

            // Login successful - navigation is now handled by auth state
        } catch (error) {
            if (axios.isAxiosError(error)) {
                Alert.alert(
                    'Error',
                    error.response?.data?.error || 'Failed to verify token'
                );
            }
        } finally {
            setState(prev => ({ ...prev, isLoading: false }));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Arabic Learner</Text>

            {state.message && (
                <Text style={styles.message}>{state.message}</Text>
            )}

            {!state.showToken ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter email"
                        value={state.email}
                        onChangeText={(text) =>
                            setState(prev => ({ ...prev, email: text }))}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        editable={!state.isLoading}
                    />

                    {state.isNewUser && (
                        <TextInput
                            style={styles.input}
                            placeholder="Enter username"
                            value={state.username}
                            onChangeText={(text) =>
                                setState(prev => ({ ...prev, username: text }))}
                            autoCapitalize="none"
                            editable={!state.isLoading}
                        />
                    )}

                    <TouchableOpacity
                        style={[styles.button, state.isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {state.isNewUser ? 'Create Account' : 'Send Login Token'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter token"
                        value={state.token}
                        onChangeText={(text) =>
                            setState(prev => ({ ...prev, token: text }))}
                        editable={!state.isLoading}
                    />

                    <TouchableOpacity
                        style={[styles.button, state.isLoading && styles.buttonDisabled]}
                        onPress={handleVerify}
                        disabled={state.isLoading}
                    >
                        {state.isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Verify Token</Text>
                        )}
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        color: '#6200ee',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        marginBottom: 20,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6200ee',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
    },
    buttonDisabled: {
        backgroundColor: '#9b7bb3',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    message: {
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        textAlign: 'center',
    },
});