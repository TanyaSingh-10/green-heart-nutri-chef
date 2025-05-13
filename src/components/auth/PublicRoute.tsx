
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-nutrition-600"></div>
      </div>
    );
  }

  const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
  
  return !user ? <>{children}</> : <Navigate to={redirectPath} replace />;
};

export default PublicRoute;
