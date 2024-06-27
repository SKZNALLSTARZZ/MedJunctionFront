import axios from '../api/axios';

const fetchPatientConsultations = async (id, token) => {
    return axios.get(`v1/patientconsultations/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fetchDoctorPatients = async (token) => {
    return axios.get('v1/consulted-patients', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fetchDoctorAppointments = async (token) => {
    return axios.get('v1/doctor-appointments', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fecthDoctorPatientsCount = async (token) => {
    return axios.get('v1/consulted-patient-counts', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fetchPatients = async (token) => {
    return axios.get('v1/patient', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fecthDoctorAppointmentsForPAtient = async (token, id) => {
    return axios.get(`v1/doctor-appointments-of-patient/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


const getFetchPatientsFunction = (role) => {
    switch (role) {
        case 'doctor':
            return fetchDoctorPatients;
        case 'admin':
            return fetchPatients;
        case 'receptionist':
            return fetchPatients;
        default:
            throw new Error('Role not recognized');
    }
};

const getFetchPatientsCountFunction = (role) => {
    switch (role) {
        case 'doctor':
            return fecthDoctorPatientsCount;
        case 'admin':
            return fetchPatients;
        case 'receptionist':
            return fetchPatients;
        default:
            throw new Error('Role not recognized');
    }
};

const fetchAllMedicines = async (token) => {
    return axios.get('v1/medicine', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

export {
    getFetchPatientsFunction,
    getFetchPatientsCountFunction,
    fetchPatientConsultations,
    fecthDoctorAppointmentsForPAtient,
    fetchDoctorAppointments,
    fetchAllMedicines,
};
