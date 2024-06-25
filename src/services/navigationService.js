export const navigateBasedOnRole = (navigate, role) => {
    switch (role) {
      case 'nurse':
        navigate('/patients');
        break;
      case 'pharmacist':
        navigate('/medicine');
        break;
      case 'receptionist':
        navigate('/dashboard');
        break;
      case 'admin':
        navigate('/dashboard');
        break;
      case 'doctor':
        navigate('/patients');
        break;
      case 'patient':
        navigate('/settings');
        break;
      default:
        navigate('/dashboard');
    }
  };