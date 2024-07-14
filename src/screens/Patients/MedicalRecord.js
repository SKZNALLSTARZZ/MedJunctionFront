import React, { useEffect, useState } from 'react';
import { Button } from '../../components/Form';
import { BiPlus } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import MedicalRecodModal from '../../components/Modals/MedicalRecodModal';
import { useNavigate } from 'react-router-dom';

function MedicalRecord({ data }) {
  const [isOpen, setIsOpen] = useState(false);
  const [datas, setDatas] = useState({});

  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user.role;
  const isUserAuthorized = userRole === 'admin' || userRole === 'receptionist';
  const navigate = useNavigate();

  if (!data || data.length === 0) {
    return <div>No consultations available.</div>;
  }

  return (
    <>
      {
        // Modal
        isOpen && (
          <MedicalRecodModal
            closeModal={() => {
              setIsOpen(false);
              setDatas({});
            }}
            isOpen={isOpen}
            datas={datas}
          />
        )}
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-4">
          <h1 className="text-sm font-medium sm:block hidden">Consultations</h1>
          <div className="sm:w-1/4 w-full">
            {['admin', 'receptionist','doctor'].includes(userRole) && (
              <Button
                label="New Record"
                Icon={BiPlus}
                onClick={() => {
                  navigate(`/patients/visiting/2`);
                }}
              />
            )}
          </div>
        </div>
        {data.map((consultation, index) => {
          const totalPrescriptionAmount = consultation.Prescription && consultation.Prescription.length > 0
            ? consultation.Prescription.reduce((total, item) => {
              return total + parseFloat(item.amount.replace(/,/g, ''));
            }, 0)
            : 0;

          const totalTreatmentPrice = consultation.Treatment ? parseFloat(consultation.Treatment.price) : 0;

          const consultationPrice = totalPrescriptionAmount + totalTreatmentPrice;

          return (
            <div
              key={index}
              className="bg-dry items-start grid grid-cols-12 gap-4 rounded-xl border-[1px] border-border p-6"
            >
              <div className="col-span-12 md:col-span-2">
                <p className="text-xs text-textGray font-medium">{consultation.Date}</p>
              </div>
              <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
                {/* Displaying complaints */}
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Complaints:</span> {consultation.Complains}
                </p>

                {/* Displaying diagnosis */}
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Diagnosis:</span> {consultation.Diagnosis}
                </p>

                {/* Displaying treatment */}
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Treatment:</span> {consultation.Treatment?.name}
                </p>

                {/* Displaying prescriptions */}
                {consultation.Prescription.length > 0 && (
                  <p className="text-xs text-main font-light">
                    <span className="font-medium">Prescription:</span> {consultation.Prescription.map(prescription => prescription.name).join(', ')}
                  </p>
                )}
              </div>
              {/* price */}
              <div className="col-span-12 md:col-span-2">
                <p className="text-xs text-subMain font-semibold">
                  <span className="font-light text-main">($)</span> {consultationPrice.toFixed(2)}
                </p>
              </div>
              {/* actions */}
              <div className="col-span-12 md:col-span-2 flex-rows gap-2">
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setDatas(consultation);
                  }}
                  className="text-sm flex-colo bg-white text-subMain border border-border rounded-md w-2/4 md:w-10 h-10"
                >
                  <FiEye />
                </button>
                {isUserAuthorized && (
                  <button
                    onClick={() => {
                      toast.error('This feature is not available yet');
                    }}
                    className="text-sm flex-colo bg-white text-red-600 border border-border rounded-md w-2/4 md:w-10 h-10"
                  >
                    <RiDeleteBin6Line />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MedicalRecord;
