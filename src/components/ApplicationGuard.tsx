import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ApplicationGuardProps {
  children: React.ReactNode;
  requireApproved?: boolean;
}

/**
 * ApplicationGuard component to protect routes based on application approval status
 * - If requireApproved is true, redirects to upload-details if application status is not Approved (2)
 * - If requireApproved is false (for upload-details route), allows access when app is not approved OR rejected
 *
 * Application Status values:
 * - 0 = Pending
 * - 1 = Under Review
 * - 2 = Approved
 * - 3 = Rejected (user can access upload-details to resubmit)
 */
const ApplicationGuard: React.FC<ApplicationGuardProps> = ({
  children,
  requireApproved = true
}) => {
  const { application } = useAuth();

  const applicationStatus = application?.status;

  // Check if application status is Approved (status === 2)
  const isApplicationApproved = applicationStatus === 2;

  // If route requires approved application but it's not approved
  if (requireApproved && !isApplicationApproved) {
    return <Navigate to="/dashboard/member-type/principal-member/upload-details" replace />;
  }

  // If route is upload-details but application is already approved, redirect to dashboard
  // (Rejected applications can still access upload-details to resubmit)
  if (!requireApproved && isApplicationApproved) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ApplicationGuard;
