import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ApplicationGuardProps {
  children: React.ReactNode;
  requireCompleted?: boolean;
}

/**
 * ApplicationGuard component to protect routes based on application completion status
 * - If requireCompleted is true, redirects to upload-details if application is not completed
 * - If requireCompleted is false (for upload-details route), allows access only if application is not completed
 */
const ApplicationGuard: React.FC<ApplicationGuardProps> = ({
  children,
  requireCompleted = true
}) => {
  const { application } = useAuth();

  const isApplicationCompleted = application?.isCompleted ?? false;

  // If route requires completed application but it's not completed
  if (requireCompleted && !isApplicationCompleted) {
    return <Navigate to="/dashboard/member-type/principal-member/upload-details" replace />;
  }

  // If route is upload-details but application is already completed, redirect to dashboard
  if (!requireCompleted && isApplicationCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ApplicationGuard;
