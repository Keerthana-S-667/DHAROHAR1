import React from 'react';
import { useParams } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';
import { DashboardView } from '../components/admin/DashboardView';
import { ReportsLedgerView } from '../components/admin/ReportsLedgerView';
import { ReportDetailsView } from '../components/admin/ReportDetailsView';
import { RiskMonitorView } from '../components/admin/RiskMonitorView';
import { ContributionsView } from '../components/admin/ContributionsView';
import { AnalyticsView } from '../components/admin/AnalyticsView';
import { ActivityLogView } from '../components/admin/ActivityLogView';

interface AdminPageProps {
  subview: 'dashboard' | 'reports' | 'report-details' | 'risk-monitor' | 'contributions' | 'analytics' | 'activity';
  onNavigate: (route: string) => void;
  language: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({ subview, onNavigate }) => {
  const { reportId } = useParams<{ reportId: string }>();

  // Determine breadcrumbs list
  const getBreadcrumbs = () => {
    switch (subview) {
      case 'reports':
        return [{ label: 'Preservation Reports' }];
      case 'report-details':
        return [
          { label: 'Preservation Reports', route: 'admin/reports' },
          { label: `Case Details` }
        ];
      case 'risk-monitor':
        return [{ label: 'Risk Monitor' }];
      case 'contributions':
        return [{ label: 'Contributions Moderation' }];
      case 'analytics':
        return [{ label: 'Preservation Analytics' }];
      case 'activity':
        return [{ label: 'Audit Logs' }];
      case 'dashboard':
      default:
        return [];
    }
  };

  // Render correct subview workspace
  const renderSubview = () => {
    switch (subview) {
      case 'reports':
        return <ReportsLedgerView onNavigate={onNavigate} />;
      case 'report-details':
        return <ReportDetailsView reportId={reportId || ''} onNavigate={onNavigate} />;
      case 'risk-monitor':
        return <RiskMonitorView onNavigate={onNavigate} />;
      case 'contributions':
        return <ContributionsView onNavigate={onNavigate} />;
      case 'analytics':
        return <AnalyticsView />;
      case 'activity':
        return <ActivityLogView onNavigate={onNavigate} />;
      case 'dashboard':
      default:
        return <DashboardView onNavigate={onNavigate} />;
    }
  };

  return (
    <AdminLayout
      currentSubview={subview}
      onNavigate={onNavigate}
      breadcrumbs={getBreadcrumbs()}
      notificationsCount={2} // Sample notification warnings for high severity alert
    >
      {renderSubview()}
    </AdminLayout>
  );
};
