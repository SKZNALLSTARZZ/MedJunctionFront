import React from 'react';
import Layout from '../../Layout';
import { Button } from '../../components/Form';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { InvoiceTable } from '../../components/Tables';
import { BiPlus } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { fetchPatientInvoices, fetchInvoices } from '../../services/authService';
import Loader from '../../components/Notifications/Loader';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Invoices() {
  const [loading, setLoading] = React.useState(true);
  const [invoices, setInvoices] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const [filteredData, setFilteredData] = React.useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;
  const userRole = user.role;
  const patientId = user.patientId;

  const isPatient = userRole === 'patient';

  console.log('isPatient:', isPatient);

  const fetchAllInvoices = async () => {
    try {
      const response = await fetchInvoices(token);
      setInvoices(response.data);
      setLoading(false);
    }
    catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchConnectedPatientInvoices = async () => {
    try {
      const response = await fetchPatientInvoices(patientId, token);
      setInvoices(response.data);
      setLoading(false);
    }
    catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isPatient) {
      fetchConnectedPatientInvoices();
    } else {
      fetchAllInvoices();
    }
  }, [isPatient]);

  React.useEffect(() => {
    const filteredInvoices = invoices.filter((invoice) =>
      invoice.patient.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredData(filteredInvoices);
  }, [invoices, search]);

  const handleExport = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Invoice ID', 'Patient Name', 'Created at', 'Due Date', 'Amount']],
      body: filteredData.map(invoice => [
        invoice.id,
        invoice.patient.name,
        invoice.created_at,
        invoice.due_date,
        invoice.payment.amount,
      ])
    });
    doc.save('invoices.pdf');
    toast.success('Invoices exported successfully!');
  };

  if (loading) {
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
      {/* add button */}
      {!isPatient && (
        <Link
          to="/invoices/create"
          className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
        >
          <BiPlus className="text-2xl" />
        </Link>)}
      {/*  */}
      <h1 className="text-xl font-semibold">Invoices</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* datas */}

        <div className="grid md:grid-cols-6 sm:grid-cols-2 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 items-center gap-6">
            <input
              type="text"
              placeholder='Search "patient name"'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
            />
          </div>

          {/* export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={handleExport}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <InvoiceTable data={filteredData} isPatient={isPatient}/>
        </div>
      </div>
    </Layout>
  );
}

export default Invoices;
