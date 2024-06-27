import React, { useEffect, useState } from 'react';
import { sortsDatas } from '../../components/Datas';
import { Button, Input, Select, Textarea } from '../../components/Form';
import { BiChevronDown } from 'react-icons/bi';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';

function HealthInfomation({ mode, data }) {
  const [bloodType, setBloodType] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [allergies, setAllergies] = useState([]);
  const [habits, setHabits] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);

  const isPreview = mode === 'preview';

  useEffect(() => {
    if (isPreview && data) {
      setBloodType(data.blood_group);
      setWeight(data.weight);
      setHeight(data.height);
      setAllergies(data.allergies.map(a => a.name).join(', ') || '');
      setHabits(data.habits.map(h => h.type).join(', ') || '');
      setMedicalHistory(data.medical_histories.map(mh => mh.medical_condition).join(', ') || '');
    } else if (!isPreview) {
      setBloodType(sortsDatas.bloodTypeFilter[0].name);
    }

    console.log(isPreview);
  }, [isPreview, data]);

  return (
    <div className="flex-colo gap-4">
      {/* uploader */}
      <div className="flex gap-3 flex-col w-full col-span-6">
        {/* select  */}
        <div className="flex w-full flex-col gap-3">
          <p className="text-black text-sm">Blood Group</p>
          <Select
            selectedPerson={bloodType}
            setSelectedPerson={setBloodType}
            datas={sortsDatas.bloodTypeFilter}
            disabled={isPreview}
          >
            <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
              {bloodType} <BiChevronDown className="text-xl" />
            </div>
          </Select>
        </div>

        <Input
          label="Weight"
          color={true}
          type="text"
          value={weight}
          readOnly={isPreview}
        />

        <Input
          label="Height"
          color={true}
          type="text"
          value={height}
          readOnly={isPreview}
        />

          <Textarea
            label="Allergies"
            color={true}
            rows={3}
            value={allergies}
            readOnly={isPreview}
          />

          <Textarea
            label="Habits"
            color={true}
            rows={3}
            value={habits}
            readOnly={isPreview}
          />

          <Textarea
            label="Medical History"
            color={true}
            rows={3}
            value={medicalHistory}
            readOnly={isPreview}
          />

        {!isPreview && (
          <Button
            label={'Save Changes'}
            Icon={HiOutlineCheckCircle}
            onClick={() => {
              toast.error('This feature is not available yet');
            }}
          />
        )}
      </div>
    </div>
  );
}

export default HealthInfomation;
