import React from 'react';
import { Button } from '../../components/Form';
import { BiPlus } from 'react-icons/bi';
import { FiEye } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { medicalRecodData } from '../../components/Datas';
import MedicalRecodModal from '../../components/Modals/MedicalRecodModal';
import { useNavigate } from 'react-router-dom';

function MedicalRecord({ data }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [datas, setDatas] = React.useState({});
  const userRole = localStorage.getItem('role');
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
        )
      }
      <div className="flex flex-col gap-6">
        <div className="flex-btn gap-4">
          <h1 className="text-sm font-medium sm:block hidden">
            Visits :
          </h1>
          <div className="sm:w-1/4 w-full">
            {['admin', 'receptionist'].includes(userRole) && (
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
        {data.map((data, index) => (
          <div
            key={index}
            className="bg-dry items-start grid grid-cols-12 gap-4 rounded-xl border-[1px] border-border p-6"
          >
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-textGray font-medium">{data.Date}</p>
            </div>
            <div className="col-span-12 md:col-span-6 flex flex-col gap-2">
              {/* Displaying complaints */}
              <p className="text-xs text-main font-light">
                <span className="font-medium">Complaints:</span>{' '}
                {data.Complains}
              </p>

              {/* Displaying diagnosis */}
              <p className="text-xs text-main font-light">
                <span className="font-medium">Diagnosis:</span>{' '}
                {data.Diagnosis}
              </p>

              {/* Displaying treatment */}
              <p className="text-xs text-main font-light">
                <span className="font-medium">Treatment:</span>{' '}
                {data.Treatments}
              </p>

              {/* Displaying prescriptions */}
              {data.Prescription.length > 0 && (
                <p className="text-xs text-main font-light">
                  <span className="font-medium">Prescription:</span>{' '}
                  {data.Prescription.map(prescription => prescription.name).join(', ')}
                </p>
              )}
            </div>
            {/* price */}
            <div className="col-span-12 md:col-span-2">
              <p className="text-xs text-subMain font-semibold">
                <span className="font-light text-main">($)</span>{' '}
                {data?.Price}
              </p>
            </div>
            {/* actions */}
            <div className="col-span-12 md:col-span-2 flex-rows gap-2">
              <button
                onClick={() => {
                  setIsOpen(true);
                  setDatas(data);
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
                </button>)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default MedicalRecord;
