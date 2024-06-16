import { Navigate } from 'react-router-dom';
import { useUserContext } from '../../hooks/useUserContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
