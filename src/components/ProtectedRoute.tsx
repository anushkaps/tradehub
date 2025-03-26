import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { UserType } from '../services/authService';
import { isEmailVerified } from '../services/emailService';
import { toast } from 'react-toastify';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: UserType;
  requireEmailVerification?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredUserType,
  requireEmailVerification = true,
  redirectTo,
}) => {
  const { isAuthenticated, userType, loading, user } = useUser();
  const location = useLocation();
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationChecked, setVerificationChecked] = useState(false);

  const defaultRedirect =
    requiredUserType === 'homeowner'
      ? '/homeowner/login'
      : requiredUserType === 'professional'
      ? '/professional/login'
      : '/login';

  useEffect(() => {
    const checkEmailVerification = async () => {
      if (user?.id && requireEmailVerification) {
        try {
          const verified = await isEmailVerified(user.id);
          setEmailVerified(verified);
        } catch (error) {
          console.error('Error checking email verification:', error);
        }
        setVerificationChecked(true);
      }
    };

    if (user?.id) {
      checkEmailVerification();
    } else {
      setVerificationChecked(true);
    }
  }, [user?.id, requireEmailVerification]);

  if (loading || (requireEmailVerification && !verificationChecked)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo || defaultRedirect} state={{ from: location }} replace />;
  }

  if (requireEmailVerification && !emailVerified) {
    toast.error('Please verify your email to access this page');
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (requiredUserType && userType !== requiredUserType) {
    toast.error(`Access denied. This page is for ${requiredUserType}s only.`);
    return <Navigate to={`/${userType}/dashboard`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
