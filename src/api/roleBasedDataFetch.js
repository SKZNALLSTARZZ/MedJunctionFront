import { getPatientData, getDoctorData, getPharmacistData, getReceptionistData, getAdminData} from '../services/authService';

export const getUserDataBasedOnRole = async () => {
    const role = localStorage.getItem('role');

    switch (role) {
        case 'Patient':
            return await getPatientData();
        case 'Doctor':
            return await getDoctorData();
        case 'Pharmacist':
            return await getPharmacistData();
        case 'Receptionist':
            return await getReceptionistData();
        case 'Admin':
            return await getAdminData();
        default:
            throw new Error('Invalid role');
    }
};
