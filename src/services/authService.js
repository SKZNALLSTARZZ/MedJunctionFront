import axios from '../api/axios';

export const login = async (email, password) => {
    try {
        const response = await axios.post('/login', { email, password });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getUser = async () => {
    try {
        const response = await axios.get('/user');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = async () => {
    try {
        await axios.post('/logout');
    } catch (error) {
        throw error.response.data;
    }
};
