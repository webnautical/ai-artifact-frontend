
import { apiBaseURL, auth } from "../Utility";
import axios from 'axios'

export const axiosInstance = axios.create({
    baseURL: apiBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (config.data instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
function getAuthToken() {
    return auth('customer')?.token || auth('admin')?.token
}

export const APICALL = async (endPoint = '', method = 'GET',value = null) => {
    try {
        const response = await axiosInstance({
            method: method,
            url: endPoint,
            data: value
        });
        return response.data;
    } catch (error) {
        return Promise.reject(error);
    }
}