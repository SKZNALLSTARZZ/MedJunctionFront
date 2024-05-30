// ********* Delight - Dentist Website is created by Zpunet ******************
// ********* If you get an error please contact us ******
// ******** Email:info@codemarketi.com *********
// ********* Website:www.codemarketi.com *********
// ********* Phone:+255 762 352 746 *********
// ********* Youtub Channel: https://www.youtube.com/channel/UCOYwYO-LEsrjqBs6xXSfq1w *********

// ******** Support my work with *********
// ********* https://www.patreon.com/zpunet *********
// ********* https://www.buymeacoffee.com/zpunet *********

// ********* This is the main component of the website *********

import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Aos from 'aos';
import Dashboard from './screens/Dashboard';
import Toast from './components/Notifications/Toast';
import Payments from './screens/Payments/Payments';
import Appointments from './screens/Appointments';
import Patients from './screens/Patients/Patients';
import Campaings from './screens/Campaings';
import Services from './screens/Services';
import Invoices from './screens/Invoices/Invoices';
import Settings from './screens/Settings';
import CreateInvoice from './screens/Invoices/CreateInvoice';
import EditInvoice from './screens/Invoices/EditInvoice';
import PreviewInvoice from './screens/Invoices/PreviewInvoice';
import EditPayment from './screens/Payments/EditPayment';
import PreviewPayment from './screens/Payments/PreviewPayment';
import Medicine from './screens/Medicine';
import PatientProfile from './screens/Patients/PatientProfile';
import CreatePatient from './screens/Patients/CreatePatient';
import Doctors from './screens/Doctors/Doctors';
import DoctorProfile from './screens/Doctors/DoctorProfile';
import Receptions from './screens/Receptions';
import NewMedicalRecode from './screens/Patients/NewMedicalRecode';
import NotFound from './screens/NotFound';
import Login from './screens/Login';
import Unauthorized from './screens/Unauthorized';
import ProtectedRoute from './components/protectedRoute';
import ProtectedLayout from './components/protectedLayout';
//import Register from './screens/Register';

function App() {
  Aos.init();

  return (
    <>
      {/* Toaster */}
      <Toast />
      {/* Routes */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<ProtectedRoute allowedRoles={['admin', 'receptionist']}><Dashboard /></ProtectedRoute>} />

          {/* invoce */}
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
              }
          >
              <Route index element={<Invoices />} />
              <Route path="create" element={<CreateInvoice />} />
              <Route path="edit/:id" element={<EditInvoice />} />
              <Route path="preview/:id" element={<PreviewInvoice />} />
          </Route>

          {/* payments */}
          <Route
            path="/payments"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
              }
          >
              <Route index element={<Payments />} />
              <Route path="edit/:id" element={<EditPayment />} />
              <Route path="preview/:id" element={<PreviewPayment />} />
          </Route>

          {/* patient */}
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
              }
          >
              <Route index element={<Patients />} />
              <Route path="create" element={<CreatePatient />} />
              <Route path="visiting/:id" element={<NewMedicalRecode />} />
              <Route path="preview/:id" element={<PatientProfile />} />
          </Route>

          {/* doctors */}
          <Route
            path="/doctors"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
              }
          >
              <Route index element={<Doctors />} />
              <Route path="preview/:id" element={<DoctorProfile />} />
          </Route>

          {/* reception */}
          <Route
            path="/receptions"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
              }
          >
              <Route index element={<Receptions />} />
          </Route>

          {/* others */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/Register" element={<Register />} /> */}
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/campaigns" element={<Campaings />} />
          <Route path="/medicine" element={<Medicine />} />
          <Route path="/services" element={<Services />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
