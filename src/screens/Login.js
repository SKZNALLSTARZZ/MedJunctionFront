import React, { useState } from 'react';
import { Button, Input } from '../components/Form';
import { BiLogInCircle } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import Axios

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.token;
        localStorage.setItem('token', token); 
        console.log(token);
        navigate('/');
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
          className="w-48 h-16 object-contain"
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
