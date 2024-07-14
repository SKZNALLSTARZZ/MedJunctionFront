import React from 'react';
import { MdOutlineCloudDownload } from 'react-icons/md';
import { toast } from 'react-hot-toast';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import Layout from '../Layout';
import { Button, Select } from '../components/Form';
import { ServiceTable } from '../components/Tables';
import { servicesData, sortsDatas } from '../components/Datas';
import AddEditServiceModal from '../components/Modals/AddEditServiceModal';
import { fetchAllTreatments } from '../services/authService';
import Loader from '../components/Notifications/Loader';

function Services() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [data, setData] = React.useState({});
  const [selectedService, setSelectedService] = React.useState(sortsDatas.service[0]);
  const [selectedSpeciality, setSelectedSpeciality] = React.useState(sortsDatas.service[0]);
  const [treatment, setTreatment] = React.useState([]);
  const [service, setService] = React.useState([]);
  const [speciality, setSpeciality] = React.useState([]);
  const [treatmentLoading, setTreatmentLoading] = React.useState(true);
  const [searchText, setSearchText] = React.useState('');
  const [filteredData, setFilteredData] = React.useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = user.token;

  const fetchTreatment = async () => {
    try {
      const response = await fetchAllTreatments(token);
      setTreatment(response.data.treatments);
      setSpeciality(response.data.specialities);
      setService(response.data.services);
      setTreatmentLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    } finally {
      setTreatmentLoading(false);
    }
  };
  
  React.useEffect(() => {
    fetchTreatment();
  }, []);

  React.useEffect(() => {
    const filtered = treatment.filter(item => {
      const matchesText = item.name.toLowerCase().includes(searchText.toLowerCase());
      const matchesService = selectedService.name === 'All' || item.service === selectedService.name;
      const matchesSpecialty = selectedSpeciality.name === 'All' || item.speciality === selectedSpeciality.name;
      return matchesText && matchesService && matchesSpecialty;
    });
    setFilteredData(filtered);
  }, [treatment, searchText, selectedService,selectedSpeciality]);

  const onCloseModal = () => {
    setIsOpen(false);
    setData({});
  };

  const onEdit = (datas) => {
    setIsOpen(true);
    setData(datas);
  };
  if (treatmentLoading) {
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
        <AddEditServiceModal
          datas={data}
          isOpen={isOpen}
          closeModal={onCloseModal}
        />
      )}
      {/* add button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-16 animate-bounce h-16 border border-border z-50 bg-subMain text-white rounded-full flex-colo fixed bottom-8 right-12 button-fb"
      >
        <BiPlus className="text-2xl" />
      </button>
      {/*  */}
      <h1 className="text-xl font-semibold">Treatments</h1>
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
              placeholder='Search "teeth cleaning"'
              className="h-14 w-full text-sm text-main rounded-md bg-dry border border-border px-4"
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              selectedPerson={selectedService}
              setSelectedPerson={setSelectedService}
              datas={service}
            >
              <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {selectedService.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
            <Select
              selectedPerson={selectedSpeciality}
              setSelectedPerson={setSelectedSpeciality}
              datas={speciality}
            >
              <div className="w-full flex-btn text-main text-sm p-4 border bg-dry border-border font-light rounded-lg focus:border focus:border-subMain">
                {selectedSpeciality.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>

          {/* export */}
          <Button
            label="Export"
            Icon={MdOutlineCloudDownload}
            onClick={() => {
              toast.error('Exporting is not available yet');
            }}
          />
        </div>
        <div className="mt-8 w-full overflow-x-scroll">
          <ServiceTable data={filteredData} onEdit={onEdit} />
        </div>
      </div>
    </Layout>
  );
}

export default Services;
