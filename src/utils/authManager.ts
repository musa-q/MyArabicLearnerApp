import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform, Dimensions } from 'react-native';
import * as Device from 'expo-device';
import { API_URL } from '../config/api';

// const REFRESH_INTERVAL = 55 * 60 * 1000;
const REFRESH_INTERVAL = 1 * 60 * 1000;

const createAuthManager = () => {
    let refreshTokenTimeout: NodeJS.Timeout | null = null;
    let isRefreshing = false;
    let failedRequests: ((token: string | null) => void)[] = [];
    let requestInterceptor: number | null = null;
    let responseInterceptor: number | null = null;

    const getDeviceId = async (): Promise<string> => {
        try {
            let deviceId = await AsyncStorage.getItem('deviceId');
            if (!deviceId) {
                const { width, height } = Dimensions.get('window');
                deviceId = `mobile-${Platform.OS}-${Device.modelName}-${width}x${height}-${Date.now()}`;
                await AsyncStorage.setItem('deviceId', deviceId);
            }
            return deviceId;
        } catch (error) {
            console.error('Error getting deviceId:', error);
            return `mobile-${Date.now()}`;
        }
    };

    const setTokens = async (authToken: string, refreshToken: string, email: string) => {
        if (!authToken || !refreshToken || !email) return;

        try {
            const deviceId = await getDeviceId();
            await AsyncStorage.multiSet([
                [`authToken_${deviceId}`, authToken],
                [`refreshToken_${deviceId}`, refreshToken],
                ['email', email],
                [`tokenCreatedAt_${deviceId}`, Date.now().toString()],
            ]);
            setupRefreshTimer();
        } catch (error) {
            console.error('Error setting tokens:', error);
        }
    };

    const clearTokens = async () => {
        try {
            const deviceId = await getDeviceId();
            await AsyncStorage.multiRemove([
                `authToken_${deviceId}`,
                `refreshToken_${deviceId}`,
                `tokenCreatedAt_${deviceId}`,
                'email',
                'sessionExpired'
            ]);
            if (refreshTokenTimeout) {
                clearTimeout(refreshTokenTimeout);
            }
        } catch (error) {
            console.error('Error clearing tokens:', error);
        }
    };

    const getTimeUntilRefresh = async (): Promise<number> => {
        try {
            const deviceId = await getDeviceId();
            const tokenCreatedAt = parseInt(await AsyncStorage.getItem(`tokenCreatedAt_${deviceId}`) || '0');
            const now = Date.now();
            const tokenAge = now - tokenCreatedAt;
            return Math.max(0, REFRESH_INTERVAL - tokenAge);
        } catch (error) {
            console.error('Error calculating refresh time:', error);
            return REFRESH_INTERVAL;
        }
    };

    const setupRefreshTimer = async () => {
        if (refreshTokenTimeout) {
            clearTimeout(refreshTokenTimeout);
        }

        const timeUntilRefresh = await getTimeUntilRefresh();
        refreshTokenTimeout = setTimeout(() => {
            refreshToken();
        }, timeUntilRefresh);
    };

    const refreshToken = async (): Promise<string | null> => {
        if (isRefreshing) {
            return new Promise((resolve) => {
                failedRequests.push(resolve);
            });
        }

        isRefreshing = true;
        try {
            const deviceId = await getDeviceId();
            const refreshToken = await AsyncStorage.getItem(`refreshToken_${deviceId}`);
            const email = await AsyncStorage.getItem('email');

            if (!refreshToken || !deviceId || !email) {
                throw new Error('Missing refresh data');
            }

            const response = await axios.post(`${API_URL}/auth/refresh-token`, {
                email,
                refresh_token: refreshToken,
                device_id: deviceId
            });

            if (response.data.token && response.data.refresh_token) {
                await setTokens(response.data.token, response.data.refresh_token, email);
                failedRequests.forEach(callback => callback(response.data.token));
                return response.data.token;
            }
            throw new Error('Invalid token response');
        } catch (error) {
            failedRequests.forEach(callback => callback(null));
            if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                await AsyncStorage.setItem('sessionExpired', 'true');
            }
            throw error;
        } finally {
            isRefreshing = false;
            failedRequests = [];
        }
    };

    const setupAxiosInterceptors = (onLogout: () => void) => {
        if (requestInterceptor !== null) {
            axios.interceptors.request.eject(requestInterceptor);
        }
        if (responseInterceptor !== null) {
            axios.interceptors.response.eject(responseInterceptor);
        }

        requestInterceptor = axios.interceptors.request.use(
            async (config) => {
                if (!config.url?.includes('/auth/login') && !config.url?.includes('/auth/refresh-token')) {
                    const deviceId = await getDeviceId();
                    const token = await AsyncStorage.getItem(`authToken_${deviceId}`);
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                        config.headers['X-Device-ID'] = deviceId;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                if (!originalRequest) return Promise.reject(error);

                const skipUrls = ['/auth/login', '/auth/refresh-token', '/auth/verify'];
                if (error.response?.status === 401 && !originalRequest._retry &&
                    !skipUrls.some(url => originalRequest.url.includes(url))) {

                    originalRequest._retry = true;
                    try {
                        const newToken = await refreshToken();
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        await clearTokens();
                        onLogout();
                        return Promise.reject(refreshError);
                    }
                }
                return Promise.reject(error);
            }
        );
    };

    const initializeFromStorage = async (): Promise<boolean> => {
        try {
            const deviceId = await getDeviceId();
            const authToken = await AsyncStorage.getItem(`authToken_${deviceId}`);
            const refreshToken = await AsyncStorage.getItem(`refreshToken_${deviceId}`);

            if (authToken && refreshToken) {
                await setupRefreshTimer();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error initializing from storage:', error);
            return false;
        }
    };

    return {
        setTokens,
        clearTokens,
        getTimeUntilRefresh,
        setupRefreshTimer,
        refreshToken,
        setupAxiosInterceptors,
        initializeFromStorage,
        getDeviceId
    };
};

export const authManager = createAuthManager();