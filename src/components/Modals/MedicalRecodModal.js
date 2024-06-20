import React from 'react';
import Modal from './Modal';
import { Button } from '../Form';
import { FiEye } from 'react-icons/fi';
import { MedicineDosageTable } from '../Tables';
import { medicineData } from '../Datas';
import { useNavigate } from 'react-router-dom';

function MedicalRecodModal({ closeModal, isOpen, datas }) {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const isUserAuthorized = userRole === 'admin' || userRole === 'receptionist';
  const vitalSignsArray = datas?.Vital_signs ? Object.entries(datas.Vital_signs) : [];
  const picturesArray = datas?.Pictures ? JSON.parse(datas.Pictures) : [];
  const specificKeys = ["Complains", "Diagnosis", "Treatments"];
  return (
    <Modal
      closeModal={closeModal}
      isOpen={isOpen}
      title={datas.Date}
      width={'max-w-4xl'}
    >
      <div className="flex-colo gap-6">
        {Object.entries(datas)
          .filter(([key]) => specificKeys.includes(key))
          .map(([key, value]) => (
            <div key={key} className="grid grid-cols-12 gap-4 w-full">
              <div className="col-span-12 md:col-span-3">
                <p className="text-sm font-medium">{key}:</p>
              </div>
              <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
                <p className="text-xs text-main font-light leading-5">
                  {value}
                </p>
              </div>
            </div>
          ))}
        {/* visual sign */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Vital Signs:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6">
            <p className="text-xs text-main font-light leading-5">
              {vitalSignsArray.map(([key, value]) => (
                <span key={key} className="mr-1">
                  {key}: {value},
                </span>
              ))}
            </p>
          </div>
        </div>
        {/* medicine */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Prescriptions</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl overflow-hidden p-4">
            <MedicineDosageTable
              data={datas.Prescription?.slice(0, 3)}
              functions={{}}
              button={false}
            />
          </div>
        </div>
        {/* attachments */}
        <div className="grid grid-cols-12 gap-4 w-full">
          <div className="col-span-12 md:col-span-3">
            <p className="text-sm font-medium">Attachments:</p>
          </div>
          <div className="col-span-12 md:col-span-9 border-[1px] border-border rounded-xl p-6 xs:grid-cols-2 md:grid-cols-4 grid gap-4">
            {
              picturesArray.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt="attachment"
                  className="w-full md:h-32 object-cover rounded-md"
                />
              ))
            }
          </div>
        </div>

        {/* view Invoice */}
        {isUserAuthorized && (
          <div className="flex justify-end items-center w-full">
            <div className="md:w-3/4 w-full">
              <Button
                label="View Invoice"
                Icon={FiEye}
                onClick={() => {
                  closeModal();
                  navigate(`/invoices/preview/198772`);
                }}
              />
            </div>
          </div>)}
      </div>
    </Modal >
  );
}

export default MedicalRecodModal;
