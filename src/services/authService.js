import axios from '../api/axios';

export const login = async (email, password, remember) => {
    try {
        const response = await axios.post('/login', { email, password, remember });
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

export const getPatientData = async () => {
    try {
        const response = await axios.get('/patient');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getDoctorData = async () => {
    try {
        const response = await axios.get('/doctor');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getPharmacistData = async () => {
    try {
        const response = await axios.get('/pharmacist');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getReceptionistData = async () => {
    try {
        const response = await axios.get('/receptionist');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getAdminData = async () => {
    try {
        const response = await axios.get('/admin');
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
