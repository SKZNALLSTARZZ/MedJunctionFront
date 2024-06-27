import React from 'react';
import axiosInstance from '../../api/axios';
import Layout from '../../Layout';
import { patientTab } from '../../components/Datas';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import MedicalRecord from './MedicalRecord';
import AppointmentsUsed from '../../components/UsedComp/AppointmentsUsed';
import InvoiceUsed from '../../components/UsedComp/InvoiceUsed';
import PaymentsUsed from '../../components/UsedComp/PaymentUsed';
import PersonalInfo from '../../components/UsedComp/PersonalInfo';
import HealthInfomation from './HealthInfomation';
import Loader from '../../components/Notifications/Loader';
import { fetchPatientConsultations } from '../../services/authService';

function PatientProfile() {
  const [activeTab, setActiveTab] = React.useState(1);
  const { id } = useParams();
  const [patient, setPatient] = React.useState([]);
  const [patientEmail, setPatientEmail] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [consultation, setConsultation] = React.useState([]);
  const [consultationLoading, setConsultationLoading] = React.useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;
  const userRole = user.role;

  const accessibleTabs = {
    doctor: [1, 2, 5, 6],
    nurse: [1, 2, 5, 6],
    patient: [1, 2, 3, 4, 5, 6],
    receptionist: [1, 2, 3, 4, 5, 6],
    admin: [1, 2, 3, 4, 5, 6],
  };

  const userHasAccessToTab = (role, tabId) => {
    return accessibleTabs[role]?.includes(tabId);
  };

  const fetchPatientVisits = async () => {
    try {
      const response = await fetchPatientConsultations(id, token);
      setConsultation(response.data.data);
      setConsultationLoading(false);
    }
    catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setConsultationLoading(false);
    }
  };

  const fetchPatientData = async () => {
    try {
      const response = await axiosInstance.get(`v1/patient/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatient(response.data);
      setPatientEmail(response.data.user.email);
      setLoading(false);

    } catch (error) {
      console.error('Error fetching patient data:', error);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPatientData();
    fetchPatientVisits();
  }, []);

  const tabPanel = () => {
    switch (activeTab) {
      case 1:
        if (userHasAccessToTab(userRole, 1)) return <MedicalRecord data={consultation} />;
        break;
      case 2:
        if (userHasAccessToTab(userRole, 2)) return <AppointmentsUsed doctor={true} patientId={id} />;
        break;
      case 3:
        if (userHasAccessToTab(userRole, 3)) return <InvoiceUsed />;
        break;
      case 4:
        if (userHasAccessToTab(userRole, 4)) return <PaymentsUsed doctor={false} />;
        break;
      case 5:
        if (userHasAccessToTab(userRole, 5)) return <PersonalInfo titles={false} mode="preview" data={patient}/>;
        break;
      case 6:
        if (userHasAccessToTab(userRole, 6)) return <HealthInfomation mode="preview" data={patient}/>;
        break;
      default:
        return null;
    }
  };

  if (loading || consultationLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="flex items-center gap-4">
        <Link
          to="/patients"
          className="bg-white border border-subMain border-dashed rounded-lg py-3 px-4 text-md"
        >
          <IoArrowBackOutline />
        </Link>
        <h1 className="text-xl font-semibold">{patient.name}</h1>
      </div>
      <div className=" grid grid-cols-12 gap-6 my-8 items-start">
        <div
          data-aos="fade-right"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="col-span-12 flex-colo gap-6 lg:col-span-4 bg-white rounded-xl border-[1px] border-border p-6 lg:sticky top-28"
        >
          <img
            src={`data:image/jpeg;base64,${patient.img_data}`}
            alt="Patient Image"
            className="w-40 h-40 rounded-full object-cover border border-dashed border-subMain"
          />
          <div className="gap-2 flex-colo">
            <h2 className="text-sm font-semibold">{patient.name}</h2>
            <p className="text-xs text-textGray">{patientEmail}</p>
            <p className="text-xs">{patient.phone}</p>
          </div>
          {/* tabs */}
          <div className="flex-colo gap-3 px-2 xl:px-12 w-full">
            {patientTab.filter(tab => userHasAccessToTab(userRole, tab.id)).map((tab, index) => (
              <button
                onClick={() => setActiveTab(tab.id)}
                key={index}
                className={`
                ${activeTab === tab.id
                    ? 'bg-text text-subMain'
                    : 'bg-dry text-main hover:bg-text hover:text-subMain'
                  }
                text-xs gap-4 flex items-center w-full p-4 rounded`}
              >
                <tab.icon className="text-lg" /> {tab.title}
              </button>
            ))}
          </div>
        </div>
        {/* tab panel */}
        <div
          data-aos="fade-left"
          data-aos-duration="1000"
          data-aos-delay="100"
          data-aos-offset="200"
          className="col-span-12 lg:col-span-8 bg-white rounded-xl border-[1px] border-border p-6"
        >
          {tabPanel()}
        </div>
      </div>
    </Layout>
  );
}

export default PatientProfile;
