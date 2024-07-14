import React, { useState, useEffect } from 'react';
import Layout from '../../Layout';
import { sortsDatas } from '../../components/Datas';
import { Link, useNavigate } from 'react-router-dom';
import { BiChevronDown, BiPlus, BiTime } from 'react-icons/bi';
import { BsCalendarMonth } from 'react-icons/bs';
import { MdFilterList, MdOutlineCalendarMonth } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { Button, FromToDate, Select } from '../../components/Form';
import { PatientTable } from '../../components/Tables';
import Loader from '../../components/Notifications/Loader';
import axiosInstance from '../../api/axios';
import { getFetchPatientsCountFunction, getFetchPatientsFunction } from '../../services/authService';

function Patients() {
  const [status, setStatus] = useState(sortsDatas.filterPatient[0]);
  const [gender, setGender] = useState(sortsDatas.genderFilter[0]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [patients, setPatients] = useState([]);
  const [patientsCount, setPatientsCount] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [startDate, endDate] = dateRange;
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  const user = JSON.parse(localStorage.getItem('user'));

  const userRole = user.role;
  const token = user.token;
  const fetchPatientsFunction = getFetchPatientsFunction(userRole);
  const fetchPatientsCountFunction = getFetchPatientsCountFunction(userRole);

  useEffect(() => {
    fetchPatients();
    const filtered = patients.filter(patient => patient.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredPatients(filtered);
  }, [patients, query]);

  const fetchPatients = async () => {
    try {
      const [patientsRes, countRes] = await Promise.all([
        fetchPatientsFunction(token),
        fetchPatientsCountFunction(token)
      ]);

      setPatients(patientsRes.data);
      setPatientsCount(countRes.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err.message);
      setLoading(false);
    }
  };
  const handleFilterButtonClick = () => {
    const filtered = patients.filter(patient => {
      const createdAt = new Date(patient.created_at);
      return patient.name.toLowerCase().includes(query.toLowerCase()) &&
        (!startDate || createdAt >= startDate) &&
        (!endDate || createdAt <= endDate) &&
        (!gender.name || patient.sex.toLowerCase() === gender.name.toLowerCase());
    });
    let sortedFiltered = [...filtered];

    if (status.name === "Newest Patients") {

      sortedFiltered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else {
      sortedFiltered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    }

    setFilteredPatients(sortedFiltered);
  };
 console.log('filtredpatient',filteredPatients);
  const deletePatient = async (id) => {
    try {
      await axiosInstance.delete(`v1/patient/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(patients.filter(patient => patient.id !== id));
      toast.success('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient. Please try again later.');
    }
  };

  // boxes
  const boxes = [
    {
      id: 1,
      title: 'Today Patients',
      value: patientsCount.daily,
      color: ['bg-subMain', 'text-subMain'],
      icon: BiTime,
    },
    {
      id: 2,
      title: 'Monthly Patients',
      value: patientsCount.monthly,
      color: ['bg-orange-500', 'text-orange-500'],
      icon: BsCalendarMonth,
    },
    {
      id: 3,
      title: 'Yearly Patients',
      value: patientsCount.yearly,
      color: ['bg-green-500', 'text-green-500'],
      icon: MdOutlineCalendarMonth,
    },
  ];

  // preview
  const previewPatient = (id) => {
    navigate(`/patients/preview/${id}`);
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
      {['admin', 'receptionist'].includes(userRole) && (
        <Link
          to="/patients/create"
          className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
        >
          <BiPlus className="text-2xl" />
        </Link>
      )}
      <h1 className="text-xl font-semibold">Patients</h1>
      {/* boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {boxes.map((box) => (
          <div
            key={box.id}
            className="bg-white flex-btn gap-4 rounded-xl border-[1px] border-border p-5"
          >
            <div className="w-3/4">
              <h2 className="text-sm font-medium">{box.title}</h2>
              <h2 className="text-xl my-6 font-medium">{box.value}</h2>
              <p className="text-xs text-textGray">
                Total Patients <span className={box.color[1]}>{box.value}</span>{' '}
                {box.title === 'Today Patients'
                  ? 'today'
                  : box.title === 'Monthly Patients'
                    ? 'this month'
                    : 'this year'}
              </p>
            </div>
            <div
              className={`w-10 h-10 flex-colo rounded-md text-white text-md ${box.color[0]}`}
            >
              <box.icon />
            </div>
          </div>
        ))}
      </div>
      {/* datas */}
      <div
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-delay="10"
        data-aos-offset="200"
        className="bg-white my-8 rounded-xl border-[1px] border-border p-5"
      >
        {/* Search input */}
        <div className="grid lg:grid-cols-5 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2">
          <input
            type="text"
            placeholder='Search "Patients"'
            className="h-14 text-sm text-main rounded-md bg-dry border border-border px-4"
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* sort  */}
          <Select
            selectedPerson={status}
            setSelectedPerson={setStatus}
            datas={sortsDatas.filterPatient}
          >
            <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
              <p>{status?.name}</p>
              <BiChevronDown className="text-xl" />
            </div>
          </Select>
          <Select
            selectedPerson={gender}
            setSelectedPerson={setGender}
            datas={sortsDatas.genderFilter}
          >
            <div className="h-14 w-full text-xs text-main rounded-md bg-dry border border-border px-4 flex items-center justify-between">
              <p>{gender?.name}</p>
              <BiChevronDown className="text-xl" />
            </div>
          </Select>
          {/* date */}
          <FromToDate
            startDate={startDate}
            endDate={endDate}
            bg="bg-dry"
            onChange={(update) => setDateRange(update)}
          />
          {/* export */}
          <Button
            label="Filter"
            Icon={MdFilterList}
            onClick={handleFilterButtonClick}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <PatientTable
            data={filteredPatients}
            functions={{
              preview: previewPatient,
              deletePatient: deletePatient,
            }}
            userRole={userRole}
            used={false}
          />
        </div>
      </div>
    </Layout>
  );
}

export default Patients;
