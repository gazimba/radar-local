import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.data?.code === 'TOKEN_EXPIRED') {
            window.location.href = '/';
            alert("Sessão expirada! Por favor, faça login novamente.");
        }

        return Promise.reject(error);
    }
);