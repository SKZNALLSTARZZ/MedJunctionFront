import axios from '../api/axios';

const fetchPatientConsultations = async (id, token) => {
    return axios.get(`v1/patientconsultations/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fetchPatientInvoices = async (id, token) => {
    return axios.get(`v1/patientinvoices/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fetchInvoiceDetails = async (id, token) => {
    return axios.get(`v1/invoicedetails/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fetchInvoices = async (token) => {
    return axios.get('v1/invoices', {
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

const fetchPatientAppointments = async (token, id) => {
    return axios.get(`v1/patientappointments/${id}`, {
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

const fecthLastFivePatient = async (token) => {
    return axios.get('v1/get_Last_Five_Patients', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fecthTodayAppointments = async (token) => {
    return axios.get('v1/Today_Appointments', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

const fetchLastFivePayment = async (token) => {
    return axios.get('v1/get_Last_Five_Payments', {
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
const fetchDoctors = async (token) => {
    return axios.get('v1/doctor', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
const fetchReceptionists = async (token) => {
    return axios.get('v1/receptionist', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
const fetchPayments = async (token) => {
    return axios.get('v1/get_All_Payments', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
const fetchPatientsCount = async (token) => {
    return axios.get('v1/Count', {
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
};
const fetchDashboardDataCount = async (token) => {
        // Array of requests
        return  [
            axios.get('v1/Count_All_Patient', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get('v1/Count_All_Appointment', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get('v1/Count_All_Prescription', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
            axios.get('v1/Count_All_Payment', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        ];
    };



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
            return fetchPatientsCount;
        case 'receptionist':
            return fetchPatientsCount;
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
const fetchAllTreatments = async (token) => {
    return axios.get('v1/treatment', {
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
    fetchLastFivePayment,
    fetchDashboardDataCount,
    fecthLastFivePatient,
    fecthTodayAppointments,
    fetchAllTreatments,
    fetchPatientAppointments,
    fetchPatientInvoices,
    fetchInvoices,
    fetchInvoiceDetails,
    fetchDoctors,
    fetchReceptionists,
    fetchPayments,
};
