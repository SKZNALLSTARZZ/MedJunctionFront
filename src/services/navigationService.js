export const navigateBasedOnRole = (navigate, role) => {
    switch (role) {
      case 'nurse':
        navigate('/patients');
        break;
      case 'pharmacist':
        navigate('/medicine');
        break;
      case 'receptionist':
        navigate('/');
        break;
      case 'admin':
        navigate('/');
        break;
      case 'doctor':
        navigate('/patients');
        break;
      case 'patient':
        navigate('/settings');
        break;
      default:
        navigate('/');
    }
  };