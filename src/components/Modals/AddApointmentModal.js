import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import {
  Button,
  Checkbox,
  DatePickerComp,
  Input,
  Select,
  Textarea,
  TimePickerComp,
} from '../Form';
import { BiChevronDown, BiPlus } from 'react-icons/bi';
import { memberData, servicesData, sortsDatas } from '../Datas';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import PatientMedicineServiceModal from './PatientMedicineServiceModal';
import { parse } from 'date-fns';

const doctorsData = memberData.map((item) => {
  return {
    id: item.id,
    name: item.title,
  };
});

function AddAppointmentModal({ closeModal, isOpen, datas, mode }) {
  const [services, setServices] = useState(servicesData[0]);
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [status, setStatus] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [shares, setShares] = useState({
    email: false,
    sms: false,
    whatsapp: false,
  });
  const [open, setOpen] = useState(false);

  const onChangeShare = (e) => {
    setShares({ ...shares, [e.target.name]: e.target.checked });
  };

  //dummy date only used to format time values
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (datas[0]?.Patient.name) {
      //setServices(datas?.service);
      setPatients(datas[0]?.Patient.name)
      setStartDate(parse(datas[0]?.Date, 'MMM d, yyyy', new Date()));
      setStartTime(new Date(`${today}T${datas[0].Start_time}`));
      setEndTime(new Date(`${today}T${datas[0].End_time}`));
      setStatus(datas[0]?.Status);
      setDoctors(datas[0]?.Doctor.name);
      setDescriptions(datas[0]?.Description);
      //setShares(datas?.shareData);
    }
  }, [datas]);

  const isPreview = mode === 'preview';

  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={isPreview ? 'Appointment Details :' : 'New Appointment'}
      width={'max-w-3xl'}
    >
      {open && (
        <PatientMedicineServiceModal
          closeModal={() => setOpen(!isOpen)}
          isOpen={open}
          patient={true}
        />
      )}
      <div className="flex-colo gap-6">
        <div className="grid sm:grid-cols-12 gap-4 w-full items-center">
          <div className="sm:col-span-10">
            <Input
              label="Patient Name"
              color={true}
              placeholder={
                patients
                  ? patients
                  : 'Select Patient and patient name will appear here'
              }
              readOnly={isPreview}
            />
          </div>
          {!isPreview && (
            <button
              onClick={() => setOpen(!open)}
              className="text-subMain flex-rows border border-dashed border-subMain text-sm py-3.5 sm:mt-6 sm:col-span-2 rounded"
            >
              <BiPlus /> Add
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Purpose of visit</p>
            <Select
              selectedPerson={services}
              setSelectedPerson={setServices}
              datas={servicesData}
              disabled={isPreview}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {services.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          <DatePickerComp
            label="Date of visit"
            startDate={startDate}
            onChange={(date) => setStartDate(date)}
            disabled={isPreview}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <TimePickerComp
            label="Start time"
            startDate={startTime}
            onChange={(date) => setStartTime(date)}
            disabled={isPreview}
          />
          <TimePickerComp
            label="End time"
            startDate={endTime}
            onChange={(date) => setEndTime(date)}
            disabled={isPreview}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Doctor</p>
            <Select
              selectedPerson={doctors}
              setSelectedPerson={setDoctors}
              datas={doctors}
              disabled={isPreview}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {doctors} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Status</p>
            <Select
              selectedPerson={status}
              setSelectedPerson={setStatus}
              datas={status}
              disabled={isPreview}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {status} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </div>

        <Textarea
          label="Description"
          placeholder={
            descriptions
              ? descriptions
              : 'No descriptions given.'
          }
          color={true}
          rows={5}
          readOnly={isPreview}
        />
        {!isPreview && (
          <div className="flex-col flex gap-8 w-full">
            <p className="text-black text-sm">Share with patient via</p>
            <div className="flex flex-wrap sm:flex-nowrap gap-4">
              <Checkbox
                name="email"
                checked={shares.email}
                onChange={(e) => setShares({ ...shares, email: e.target.checked })}
                label="Email"
                disabled={isPreview}
              />
              <Checkbox
                name="sms"
                checked={shares.sms}
                onChange={(e) => setShares({ ...shares, sms: e.target.checked })}
                label="SMS"
                disabled={isPreview}
              />
              <Checkbox
                name="whatsapp"
                checked={shares.whatsapp}
                onChange={(e) => setShares({ ...shares, whatsapp: e.target.checked })}
                label="WhatsApp"
                disabled={isPreview}
              />
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4 w-full">
          <button
            onClick={closeModal}
            className="bg-red-600 bg-opacity-5 text-red-600 text-sm p-4 rounded-lg font-light"
          >
            {datas?.title ? 'Discard' : 'Cancel'}
          </button>
          {!isPreview && (
            <Button
              label="Save"
              Icon={HiOutlineCheckCircle}
              onClick={() => {
                toast.error('This feature is not available yet');
              }}
            />
          )}
        </div>
      </div>
    </Modal>
  );
}

export default AddAppointmentModal;
