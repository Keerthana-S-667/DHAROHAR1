import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface RouteGuardProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<RouteGuardProps> = ({ children }) => {
  const { session, loading, initialized } = useAuthStore();
  const location = useLocation();

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 border-2 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4b2f23]/60">
            Checking Credentials...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    const path = location.pathname;
    let redirectPath = '/auth/traveller';
    
    if (path.startsWith('/research')) {
      redirectPath = '/auth/researcher';
    } else if (path.startsWith('/admin')) {
      redirectPath = '/admin/login';
    }

    const searchParams = new URLSearchParams();
    searchParams.set('redirect', path);

    return <Navigate to={`${redirectPath}?${searchParams.toString()}`} replace />;
  }

  return <>{children}</>;
};

interface RoleProtectedRouteProps extends RouteGuardProps {
  allowedRoles: ('traveller' | 'researcher' | 'admin')[];
}

export const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { session, role, loading, initialized } = useAuthStore();
  const location = useLocation();

  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f0e6]">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 border-2 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#4b2f23]/60">
            Verifying Access...
          </p>
        </div>
      </div>
    );
  }

  if (!session) {
    const path = location.pathname;
    let redirectPath = '/auth/traveller';
    
    if (path.startsWith('/research')) {
      redirectPath = '/auth/researcher';
    } else if (path.startsWith('/admin')) {
      redirectPath = '/admin/login';
    }

    const searchParams = new URLSearchParams();
    searchParams.set('redirect', path);

    return <Navigate to={`${redirectPath}?${searchParams.toString()}`} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    console.warn(`Access Denied: User role "${role}" is not in allowed roles:`, allowedRoles);
    
    // Deny access and redirect to the correct home portal
    if (role === 'traveller') {
      return <Navigate to="/traveller" replace />;
    } else if (role === 'researcher') {
      return <Navigate to="/research" replace />;
    } else if (role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    
    // Default to main landing
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
