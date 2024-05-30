import React from 'react';
import Uploder from '../Uploader';
import { sortsDatas } from '../Datas';
import { Button, DatePickerComp, Input, Select, Textarea} from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { LuPaintbrush2 } from "react-icons/lu";
import axios from 'axios';

function PersonalInfo({ titles}) {
  const [title, setTitle] = React.useState(sortsDatas.title[0]);
  const [date, setDate] = React.useState(new Date());
  const [birthdate, setBirthdate] = React.useState('');
  const [gender, setGender] = React.useState(sortsDatas.genderFilter[0]);
  const [bloodgrp, setBloodgrp] = React.useState(sortsDatas.bloodTypeFilter[0]);
  const [file, setFile] = React.useState(null);

  //Validation error control
  const [nameError, setNameError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [addressError, setAddressError] = React.useState('');
  const [genderError, setGenderError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

 //Inputs control
  const [nameValue, setNameValue] = React.useState('');
  const [phoneValue, setPhoneValue] = React.useState('');
  const [addressValue, setAddressValue] = React.useState('');
  const [emailValue, setEmailValue] = React.useState('');
  const [allergiesValue, setAllergiesValue] = React.useState('');
  const [habitsValue, setHabitsValue] = React.useState('');
  const [mhValue, setMhValue] = React.useState('');
  const [weightValue, setWeightValue] = React.useState('');
  const [heightValue, setHeightValue] = React.useState('');

  // format Date value -- DD-MM-YY
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate Age from birthdate value
  const calculateAge = (birthdate) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    // If the user's birthday hasn't occurred yet this year, subtract one year from age
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  };

  // Handle date input change
  const handleDateChange = (date) => {
    setDate(date);
    const formattedDate = formatDate(date);
    setBirthdate(formattedDate);
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('File uploaded successfully:', response.data);
      
      return response.data.img_url || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      return null;
    }
  };

  const onClickButton = (event) => {
    event.preventDefault();
    resetForm();
  }

  const resetForm = () => {
    setAllergiesValue('');
    setHabitsValue('');
    setMhValue('');
    setHeightValue('');
    setWeightValue('');
    setNameValue('');
    setPhoneValue('');
    setAddressValue('');
    setEmailValue('');
    setTitle(sortsDatas.title[0]);
    setDate(new Date());
    setBirthdate('');
    setGender(sortsDatas.genderFilter[0]);
    setBloodgrp(sortsDatas.bloodTypeFilter[0]);
    setFile(null);
  };
  
  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault(); //prevent page reload
    const form = document.getElementById('form') 
    const formData = new FormData(form);
    //formData.append('title', title?.name);
    formData.append('gender', gender?.name);
    formData.append('blood_group', bloodgrp?.name);
    formData.append('birthdate', birthdate);
    formData.append('age', calculateAge(birthdate));
    let imageUrl = null;
    if (file) {
      try {
        imageUrl = await uploadFile(file);
        formData.append('img_url', imageUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        return; // Break submition
      }
    }
    
    let isValid = true;
    if (!nameValue.trim()) {
      setNameError('Please enter your full name');
      isValid = false;
    }else {
      setNameError('');
    }
    if (!phoneValue.trim()) {
      setPhoneError('Please enter your phone number');
      isValid = false;
    }else {
      setPhoneError('');
    }
    if (!addressValue.trim()) {
      setAddressError('Please enter your address');
      isValid = false;
    }else {
      setAddressError('');
    }
    if (!emailValue.trim()) {
      setEmailError('Please enter your E-mail');
      isValid = false;
    }else {
      setEmailError('');
    }
    if (gender === sortsDatas.genderFilter[0]) {
      setGenderError('Please select your gender');
      isValid = false;
    }else {
      setGenderError('');
    }
    if (!isValid) {
      return;
    }

    console.log([...formData]);
      axios
        .post('http://127.0.0.1:8000/api/Patient/patients', formData)
        .then((response) => {
          console.log('Response:', response.data);
          resetForm();
          toast.success('Patient added succesfully!');
        })
        .catch((error) => {
          console.error('Error:', error);
          toast.error('Failed to submit data');
        });
  };

  return (
    <form onSubmit={handleSubmit} id='form'>
    <div className="flex-colo gap-4">
      {/* uploader */}
      <div className="flex gap-3 flex-col w-full col-span-6">
        <p className="text-sm">Profile Image</p>
        <Uploder setImage={setFile} />
      </div>
      {/* select  */}        
      {!titles && (
        <>
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Title</p>
            <Select
              selectedPerson={title}
              setSelectedPerson={setTitle}
              datas={sortsDatas.title}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {title?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </>
      )}

      {/* fullName */}
      <Input label="Full Name" name="name" color={true} type="text" value={nameValue} onChange={(e) => setNameValue(e.target.value)}/>
      {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
      {/* phone */}
      <Input label="Phone Number" name="phone" color={true} type="number" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)}/>
      {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
      {/* email */}
      <Input label="Email" name="email" color={true} type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)}/>
      {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
      {/* address */}
      <Input label="Address" name="address" color={true} type="text" value={addressValue} onChange={(e) => setAddressValue(e.target.value)}/>
      {addressError && <p style={{ color: 'red' }}>{addressError}</p>}
      {!titles && (
        <>
          {/* gender */}
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Gender</p>
            <Select
              selectedPerson={gender}
              setSelectedPerson={setGender}
              datas={sortsDatas.genderFilter}
              name="sex"
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {gender?.name} <BiChevronDown className="text-xl" />
              </div>
              {genderError && <p style={{ color: 'red' }}>{genderError}</p>}
            </Select>
          </div>
          {/* date */}
          <DatePickerComp
            label="Date of Birth"
            startDate={date}
            name="birthdate"
            onChange={handleDateChange}
          />
        </>
      )}

      {!titles && (
        <>
          {/* blood group */}
          <div className="flex w-full flex-col gap-3">
            <p className="text-black text-sm">Blood group</p>
            <Select
              selectedPerson={bloodgrp}
              setSelectedPerson={setBloodgrp}
              datas={sortsDatas.bloodTypeFilter}
            >
              <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                {bloodgrp?.name} <BiChevronDown className="text-xl" />
              </div>
            </Select>
          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Height */}
        <Input label="Height" name="height" color={true} type="number" placeholder={'1.75cm'} value={heightValue} onChange={(e) => setHeightValue(e.target.value)} />
        {/* Weight */}
        <Input label="Weight" name="weight" color={true} type="number" placeholder={'60kg'} value={weightValue} onChange={(e) => setWeightValue(e.target.value)} />
      </div>
      {/* Allergies */}
      <Textarea
          label="Allergies"
          name="allergies"
          color={true}
          rows={3}
          placeholder={'beans, nuts, etc'}
          value={allergiesValue}
          onChange={(e) => setAllergiesValue(e.target.value)}
        />
      {/* Habits */}
      <Textarea
          label="Habits"
          name="habits"
          color={true}
          rows={3}
          placeholder={'smoking, drinking, etc'}
          value={habitsValue}
          onChange={(e) => setHabitsValue(e.target.value)}
        />
        {/* Medical History */}
        <Textarea
          label="Medical History"
          name="medical_history"
          color={true}
          rows={3}
          placeholder={'diabetes,  malaria, glaucoma, etc'}
          value={mhValue}
          onChange={(e) => setMhValue(e.target.value)}
        />
      {/* submit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        <Button
          type="button"
          label={'Clear'}
          Icon={LuPaintbrush2}
          onClick={onClickButton}
        />
        <Button
          type='submit'
          label={'Save Changes'}
          Icon={HiOutlineCheckCircle}
        />
      </div>
    </div>
    </form>
  );
}

export default PersonalInfo;
