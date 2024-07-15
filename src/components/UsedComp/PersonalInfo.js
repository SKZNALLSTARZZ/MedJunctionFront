import React from 'react';
import Uploder from '../Uploader';
import { sortsDatas } from '../Datas';
import { Button, DatePickerComp, Input, Select, Textarea } from '../Form';
import { BiChevronDown } from 'react-icons/bi';
import { toast } from 'react-hot-toast';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { LuPaintbrush2 } from "react-icons/lu";
import axios from 'axios';
import { format, parseISO } from 'date-fns';

function PersonalInfo({ titles, mode, data }) {
  const [title, setTitle] = React.useState(sortsDatas.title[0]);
  const [birthdate, setBirthdate] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [bloodgrp, setBloodgrp] = React.useState(sortsDatas.bloodTypeFilter[0]);
  const [file, setFile] = React.useState(null);

  // Validation error control
  const [nameError, setNameError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [addressError, setAddressError] = React.useState('');
  const [genderError, setGenderError] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  // Inputs control
  const [nameValue, setNameValue] = React.useState('');
  const [phoneValue, setPhoneValue] = React.useState('');
  const [addressValue, setAddressValue] = React.useState('');
  const [emailValue, setEmailValue] = React.useState('');

  const isPreview = mode === 'preview';

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
    setBirthdate(date);
  };

  const uploadFile = async (file) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user.token;
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://127.0.0.1:8000/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization : `Bearer ${token}`
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
  };

  const resetForm = () => {
    setNameValue('');
    setPhoneValue('');
    setAddressValue('');
    setEmailValue('');
    setTitle(sortsDatas.title[0]);
    setBirthdate('');
    setGender('');
    setBloodgrp(sortsDatas.bloodTypeFilter[0]);
    setFile(null);
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent page reload
    const form = document.getElementById('form');
    const formData = new FormData(form);
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;

    // Format the birthdate before appending it to formData
    const formattedBirthdate = birthdate ? format(new Date(birthdate), 'yyyy-MM-dd') : '';

    formData.append('gender', gender?.name);
    formData.append('birthdate', formattedBirthdate);

    let imageUrl = null;
    if (file) {
      try {
        imageUrl = await uploadFile(file);
        formData.append('img_url', imageUrl);
      } catch (error) {
        console.error('Error uploading file:', error);
        return; // Break submission
      }
    }

    let isValid = true;
    if (!nameValue.trim()) {
      setNameError('Please enter your full name');
      isValid = false;
    } else {
      setNameError('');
    }
    if (!phoneValue.trim()) {
      setPhoneError('Please enter your phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }
    if (!addressValue.trim()) {
      setAddressError('Please enter your address');
      isValid = false;
    } else {
      setAddressError('');
    }
    if (!emailValue.trim()) {
      setEmailError('Please enter your E-mail');
      isValid = false;
    } else {
      setEmailError('');
    }
    if (gender === sortsDatas.genderFilter[0].name) {
      setGenderError('Please select your gender');
      isValid = false;
    } else {
      setGenderError('');
    }
    if (!isValid) {
      return;
    }

    console.log([...formData]);

    axios
      .post('http://127.0.0.1:8000/api/v1/patient', formData, {
        headers: {
          Authorization : `Bearer ${token}`
        }
      })
      .then((response) => {
        console.log('Response:', response.data);
        resetForm();
        toast.success('Patient added successfully!');
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Failed to submit data');
      });
  };

  React.useEffect(() => {
    if (isPreview && data) {
      setNameValue(data.name);
      setPhoneValue(data.phone);
      setEmailValue(data.user.email);
      setGender(data.gender);
      setAddressValue(data.address);
      setBirthdate(parseISO(data?.birthdate));
    } else if (!isPreview) {
      setGender(sortsDatas.genderFilter[0].name);
    }

    console.log(isPreview);
  }, [isPreview, data]);

  return (
    <form onSubmit={handleSubmit} id='form'>
      <div className="flex-colo gap-4">
        {/* uploader */}
        <div className="flex gap-3 flex-col w-full col-span-6">
          <p className="text-sm">Profile Image</p>
          {isPreview ? (
            file && <img src={file} alt="Profile" className="w-32 h-32 object-cover rounded-lg" />
          ) : (
            <Uploder setImage={setFile} />
          )}
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
        <Input label="Full Name" name="name" color={true} type="text" value={nameValue} onChange={(e) => setNameValue(e.target.value)} readOnly={isPreview} />
        {nameError && <p style={{ color: 'red' }}>{nameError}</p>}
        {/* phone */}
        <Input label="Phone Number" name="phone" color={true} type="text" value={phoneValue} onChange={(e) => setPhoneValue(e.target.value)} readOnly={isPreview} />
        {phoneError && <p style={{ color: 'red' }}>{phoneError}</p>}
        {/* email */}
        <Input label="Email" name="email" color={true} type="email" value={emailValue} onChange={(e) => setEmailValue(e.target.value)} readOnly={isPreview} />
        {emailError && <p style={{ color: 'red' }}>{emailError}</p>}
        {/* address */}
        <Input label="Address" name="address" color={true} type="text" value={addressValue} onChange={(e) => setAddressValue(e.target.value)} readOnly={isPreview} />
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
                disabled={isPreview}
              >
                <div className="w-full flex-btn text-textGray text-sm p-4 border border-border font-light rounded-lg focus:border focus:border-subMain">
                  {gender.name} <BiChevronDown className="text-xl" />
                </div>
                {genderError && <p style={{ color: 'red' }}>{genderError}</p>}
              </Select>
            </div>
            {/* date */}
            <DatePickerComp
              label="Date of Birth"
              startDate={birthdate}
              name="birthdate"
              onChange={handleDateChange}
              disabled={isPreview}
            />
          </>
        )}
        {/* submit */}
        {!isPreview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Button
              label={'Delete Account'}
              Icon={LuPaintbrush2}
              onClick={() => {
                onClickButton();
              }}
            />
            <Button
              label={'Save Changes'}
              Icon={HiOutlineCheckCircle}
              onClick={() => {
                toast.error('This feature is not available yet');
              }}
            />
          </div>
        )}
      </div>
    </form>
  );
}

export default PersonalInfo;
