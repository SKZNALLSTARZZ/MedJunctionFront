import { useState, useEffect } from 'react';
import { appointmentsData } from '../Datas';
import AddAppointmentModal from '../Modals/AddApointmentModal';
import { AppointmentTable } from '../Tables';
import { fecthDoctorAppointmentsForPAtient } from '../../services/authService';
import Loader from '../Notifications/Loader';

function AppointmentsUsed({ doctor, patientId }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [appointment, setAppointment] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchAppointments = async () => {
    try {
      const response = await fecthDoctorAppointmentsForPAtient(token, patientId);
      setAppointment(response.data);
      setLoading(false);
    }
    catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (event) => {
    setData(event);
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(!open);
    setData({});
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  return (
    <div className="w-full">
      {open && (
        <AddAppointmentModal
          datas={appointment}
          mode="preview"
          isOpen={open}
          closeModal={() => {
            handleClose();
          }}
        />
      )}
      <h1 className="text-sm font-medium mb-6">Appointments</h1>
      <div className="w-full overflow-x-scroll">
        <AppointmentTable
          data={appointment}
          doctor={doctor}
          functions={{
            preview: handleEventClick,
          }}
        />
      </div>
    </div>
  );
}

export default AppointmentsUsed;
