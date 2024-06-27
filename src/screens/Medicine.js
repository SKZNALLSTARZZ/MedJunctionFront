import React from 'react';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import Layout from '../Layout';
import { Button, Select } from '../components/Form';
import { MedicineTable } from '../components/Tables';
import { sortsDatas } from '../components/Datas';
import AddEditMedicineModal from '../components/Modals/AddEditMedicine';
import { fetchAllMedicines } from '../services/authService';
import Loader from '../components/Notifications/Loader';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Medicine() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState([]);
  const [filteredData, setFilteredData] = React.useState([]);
  const [status, setStatus] = React.useState(sortsDatas.stocks[0]);
  const [searchText, setSearchText] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;
  const userRole = user.role;

  const fetchMedicines = async () => {
    try {
      const response = await fetchAllMedicines(token);
      setData(response.data);
      setLoading(false);
    }
    catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const onCloseModal = () => {
    setIsOpen(false);
    setData([]);
  };

  const onEdit = (datas) => {
    setIsOpen(true);
    setData(datas);
  };

  React.useEffect(() => {
    fetchMedicines();
  }, []);

  React.useEffect(() => {
    const filtered = data.filter(item => {
      const matchesText = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus = status.name === 'All' || item.status === status.name;
      return matchesText && matchesStatus;
    });
    setFilteredData(filtered);
  }, [data, searchText, status]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Name", "Status", "Price", "Measure", "In Stock"];
    const tableRows = [];

    filteredData.forEach(item => {
      const itemData = [
        item.name,
        item.status,
        item.price,
        item.measure,
        item.instock,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'striped',
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.text("Medicine Inventory", 14, 15);
    doc.save(`medicine_inventory_${new Date().toISOString().slice(0, 10)}.pdf`);
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
      {isOpen && (
        <AddEditMedicineModal
          datas={data}
          isOpen={isOpen}
          closeModal={onCloseModal}
        />
      )}
      {/* add button */}
      {['admin', 'pharmacist'].includes(userRole) && (
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      )}
      {/*  */}
      <h1 className="text-xl font-semibold">Medicine</h1>
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="100"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* datas */}

        <div className="grid md:grid-cols-6 grid-cols-1 gap-2">
          <div className="md:col-span-5 grid lg:grid-cols-4 xs:grid-cols-2 items-center gap-2">
            <input
              type="text"
              placeholder='Search "paracetamol"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={sortsDatas.stocks}
            >
              <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {status.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          {/* export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={exportToPDF}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <MedicineTable data={filteredData} onEdit={onEdit} userRole={userRole}/>
        </div>
      </div>
    </Layout>
  );
}

export default Medicine;
