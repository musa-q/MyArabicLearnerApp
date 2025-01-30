import axios, { AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { authManager } from './authManager';

interface ApiResponse<T> {
    data: T;
    message?: string;
}

class ApiClient {
    private static instance: ApiClient;
    private baseURL: string;

    private constructor() {
        this.baseURL = API_URL;
    }

    public static getInstance(): ApiClient {
        if (!ApiClient.instance) {
            ApiClient.instance = new ApiClient();
        }
        return ApiClient.instance;
    }

    private async getHeaders(): Promise<Record<string, string>> {
        const deviceId = await authManager.getDeviceId();
        const token = await AsyncStorage.getItem(`authToken_${deviceId}`);

        return {
            'Authorization': `Bearer ${token}`,
            'X-Device-ID': deviceId,
        };
    }

    async get<T>(endpoint: string, config: AxiosRequestConfig = {}) {
        const headers = await this.getHeaders();
        const response = await axios.get(`${this.baseURL}${endpoint}`, {
            ...config,
            headers: {
                ...headers,
                ...config.headers,
            },
        });
        return response.data;
    }

    async post<T>(
        endpoint: string,
        data: any = {},
        config: AxiosRequestConfig = {}
    ) {
        const headers = await this.getHeaders();
        const response = await axios.post(`${this.baseURL}${endpoint}`, data, {
            ...config,
            headers: {
                ...headers,
                ...config.headers,
            },
        });
        return response.data;
    }

    async put<T>(
        endpoint: string,
        data: any = {},
        config: AxiosRequestConfig = {}
    ) {
        const headers = await this.getHeaders();
        const response = await axios.put(`${this.baseURL}${endpoint}`, data, {
            ...config,
            headers: {
                ...headers,
                ...config.headers,
            },
        });
        return response.data;
    }

    async delete<T>(endpoint: string, config: AxiosRequestConfig = {}) {
        const headers = await this.getHeaders();
        const response = await axios.delete(`${this.baseURL}${endpoint}`, {
            ...config,
            headers: {
                ...headers,
                ...config.headers,
            },
        });
        return response.data;
    }
}

export const apiClient = ApiClient.getInstance();