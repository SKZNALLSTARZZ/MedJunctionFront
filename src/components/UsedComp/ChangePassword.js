import React, { useState } from 'react';
import { Button, Input } from '../Form';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../api/axios';

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateForm = () => {
    const newErrors = {};

    if (!oldPassword) {
      newErrors.oldPassword = 'Old password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (!strongPasswordRegex.test(newPassword)) {
      newErrors.newPassword = 'Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.put('v1/change_password', {
        old_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      });

      toast.success('Password changed successfully');
    } catch (error) {
      if (error.response && error.response.data.error) {
        setErrors({ oldPassword: error.response.data.error });
      } else {
        toast.error('An error occurred while changing the password');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-colo gap-4">
      {/* old password */}
      <Input
        label="Old Password"
        color={true}
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      {errors.oldPassword && <div style={{ color: 'red' }}>{errors.oldPassword}</div>}
      
      {/* new password */}
      <Input
        label="New Password"
        color={true}
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      {errors.newPassword && <div style={{ color: 'red' }}>{errors.newPassword}</div>}
      
      {/* confirm password */}
      <Input
        label="Confirm Password"
        color={true}
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {errors.confirmPassword && <div style={{ color: 'red' }}>{errors.confirmPassword}</div>}
      
      {/* submit */}
      <Button
        label={loading ? 'Saving...' : 'Save Changes'}
        Icon={HiOutlineCheckCircle}
        onClick={handleSubmit}
        disabled={loading}
      />
    </div>
  );
}

export default ChangePassword;
