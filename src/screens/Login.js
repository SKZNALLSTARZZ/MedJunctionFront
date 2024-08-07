import React, { useState } from 'react';
import { Button, Checkbox, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { navigateBasedOnRole } from '../services/navigationService';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChecked, setIsChecked] = useState('');

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosInstance.post('/login', {
        email,
        password,
        isChecked,
      });

      if (response.status === 200) {
        const token = response.data.token;
        const role = response.data.role;
        const name = response.data.name;
        const image = response.data.image;
        const phone = response.data.phone;
        const email = response.data.email;
        const address = response.data.address;
        const patientId = response.data.patientId;

        localStorage.setItem('user', JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          role: role,
          token: token,
          image: image,
          address: address,
          patientId: patientId,
        }));

        console.log("Token : " + token + " Role : " + role);
        navigateBasedOnRole(navigate, role);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
      setError('An unexpected error occurred');
    }
  };

  return (
    <div className="w-full h-screen flex-colo bg-dry">
      <form className="w-2/5 p-8 rounded-2xl mx-auto bg-white flex-colo" onSubmit={handleLogin}>
        <img
          src="/images/logo.png"
          alt="logo"
          className="w-128 h-36 object-contain"
        />
        <div className="flex flex-col gap-4 w-full mb-6">
          <Input
            label="Email"
            type="email"
            color={true}
            placeholder={'admin@gmail.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={true}
          />
          <Input
            label="Password"
            type="password"
            color={true}
            placeholder={'*********'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={true}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
        <Checkbox
          label="Remember me!"
          name="rememberMeCB"
          checked={isChecked}
          onChange={handleChange}
        />
        <br/>
        <Button
          type="Submit"
          label="Login"
          Icon={BiLogInCircle}
        />
      </form>
    </div>
  );
}

export default Login;
