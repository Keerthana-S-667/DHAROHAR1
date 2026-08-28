import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  FileText, 
  ShieldAlert, 
  Users, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity,
  Clock,
  Sparkles,
  ClipboardList,
  ChevronRight
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { HeritageReport } from '../../types';
import { motion } from 'framer-motion';

interface DashboardViewProps {
  onNavigate: (route: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    highPriority: 0,
    assigned: 0,
    verification: 0,
    resolved: 0,
  });
  const [priorityAlerts, setPriorityAlerts] = useState<HeritageReport[]>([]);
  const [recentReports, setRecentReports] = useState<HeritageReport[]>([]);
  const [contributionsCount, setContributionsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        // Load stats
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);

        // Load all reports
        const reportsList = await adminService.getReports();
        
        // Filter high priority (score >= 80) and not resolved
        const highPriority = reportsList
          .filter(r => r.priorityScore >= 80 && r.status !== 'resolved')
          .slice(0, 3);
        setPriorityAlerts(highPriority);

        // Slice latest 5 for recent reports list
        setRecentReports(reportsList.slice(0, 5));

        // Load pending contributions count
        const pendingContribs = await adminService.getContributions('pending');
        setContributionsCount(pendingContribs.length);

        setLoading(false);
      } catch (err: any) {
        console.error('Error loading dashboard metrics:', err);
        setError(err.message || 'Failed to connect to database.');
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="w-10 h-10 border-4 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#4b2f23]/60 uppercase tracking-widest font-black">Syncing Command Database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center space-y-3 max-w-xl mx-auto">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h4 className="font-bold text-red-700">Connection Interrupted</h4>
        <p className="text-xs text-red-700/80 leading-relaxed">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      
      {/* ── HEADER ── */}
      <div className="border-b border-[#d5b990]/40 pb-6 text-left">
        <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#4b2f23]">
          HERITAGE CONSERVATION COMMAND CENTRE
        </h1>
        <p className="text-xs sm:text-sm text-[#4b2f23]/70 mt-2 max-w-2xl leading-relaxed font-body">
          Monitor structural threats, investigate preservation alerts, dispatch survey verification teams, and log resolution workflows for India's monuments.
        </p>
      </div>

      {/* ── ATTENTION BOARD & ALERTS ── */}
      {(stats.highPriority > 0 || stats.verification > 0 || contributionsCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.highPriority > 0 && (
            <div 
              onClick={() => onNavigate('admin/reports')}
              className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 hover:border-red-500 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 animate-bounce" />
                <span className="text-xs font-bold uppercase tracking-wider text-red-800">
                  {stats.highPriority} High Priority Cases Awaiting Action
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-red-700 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
          {stats.verification > 0 && (
            <div 
              onClick={() => onNavigate('admin/reports')}
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 hover:border-amber-500 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {stats.verification} Cases In Field Verification
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
          {contributionsCount > 0 && (
            <div 
              onClick={() => onNavigate('admin/contributions')}
              className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 hover:border-emerald-500 transition-all flex items-center justify-between cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  {contributionsCount} Contribution Moderations Pending
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
        </div>
      )}

      {/* ── STATS LEDGER METRICS ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Reports', value: stats.total, desc: 'Logged complaints', icon: FileText, color: 'text-[#b65a3a] bg-[#b65a3a]/10' },
          { label: 'Under Review', value: stats.underReview, desc: 'Initial screening', icon: Clock, color: 'text-blue-500 bg-blue-500/10' },
          { label: 'High Priority', value: stats.highPriority, desc: 'Risk rating >= 80', icon: AlertTriangle, color: 'text-red-500 bg-red-500/10' },
          { label: 'Assigned Cases', value: stats.assigned, desc: 'Active investigators', icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Field Survey', value: stats.verification, desc: 'Dispatched units', icon: ClipboardList, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Resolved Cases', value: stats.resolved, desc: 'Closed investigations', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-500/10' },
        ].map((card, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-[#ede3d1]/80 border border-[#d5b990] flex flex-col justify-between space-y-3 shadow-md hover:shadow-lg transition-all duration-200">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black text-[#4b2f23]/60 uppercase tracking-wider leading-snug">{card.label}</span>
              <div className={`p-1.5 rounded-lg shrink-0 ${card.color}`}>
                <card.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className="text-3xl font-black text-[#4b2f23]">{card.value}</span>
              <p className="text-[9px] text-[#4b2f23]/50 mt-1 leading-none">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── CORE PANEL SECTION: PRIORITY ALERTS & QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Priority Alerts (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#d5b990]/40">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              Priority Preservation Alerts
            </h3>
            <button 
              onClick={() => onNavigate('admin/reports')}
              className="text-[10px] text-[#b65a3a] font-bold hover:underline"
            >
              View All Reports
            </button>
          </div>

          {priorityAlerts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#ede3d1]/40 border border-[#d5b990]/50 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500/40 mx-auto" />
              <h4 className="font-bold text-xs">No High Priority Issues Pending</h4>
              <p className="text-[10px] text-[#4b2f23]/60 max-w-xs mx-auto">Excellent! No structural cracks or surface erosions require emergency dispatch right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {priorityAlerts.map((report) => (
                <div 
                  key={report.id} 
                  className="p-5 rounded-2xl bg-[#ede3d1]/80 border border-[#d5b990] hover:border-[#b65a3a]/60 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-[8px] font-black uppercase text-red-600 tracking-widest">
                        CRITICAL SEVERITY
                      </span>
                      <span className="text-[10px] font-bold text-[#b65a3a]">
                        Priority {report.priorityScore} / 100
                      </span>
                    </div>
                    <h4 className="font-display text-lg font-black text-[#4b2f23]">
                      {report.monumentName}
                    </h4>
                    <p className="text-[10px] text-[#4b2f23]/50 font-bold uppercase tracking-wider">
                      {report.state} • {report.issueType}
                    </p>
                    <p className="text-xs text-[#4b2f23]/70 line-clamp-2 leading-relaxed">
                      {report.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => onNavigate(`admin/reports/${report.id}`)}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow shrink-0"
                  >
                    <span>Review Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Quick Actions & Snapshot (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#d5b990] shadow-md space-y-4 text-left">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-[#d5b990]/40">
              <TrendingUp className="w-4 h-4" />
              Administrative Actions
            </h3>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={() => onNavigate('admin/reports')}
                className="w-full py-3 rounded-xl bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23]/80 hover:text-[#b65a3a] transition-all cursor-pointer text-left px-4 flex items-center justify-between"
              >
                <span>Open Reports Ledger</span>
                <ChevronRight className="w-4 h-4 text-[#b65a3a]" />
              </button>
              <button 
                onClick={() => onNavigate('admin/risk-monitor')}
                className="w-full py-3 rounded-xl bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23]/80 hover:text-[#b65a3a] transition-all cursor-pointer text-left px-4 flex items-center justify-between"
              >
                <span>Inspect Risk Monitor</span>
                <ChevronRight className="w-4 h-4 text-[#b65a3a]" />
              </button>
              <button 
                onClick={() => onNavigate('admin/contributions')}
                className="w-full py-3 rounded-xl bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23]/80 hover:text-[#b65a3a] transition-all cursor-pointer text-left px-4 flex items-center justify-between"
              >
                <span>Story Contribution Board</span>
                <ChevronRight className="w-4 h-4 text-[#b65a3a]" />
              </button>
              <button 
                onClick={() => onNavigate('admin/analytics')}
                className="w-full py-3 rounded-xl bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23]/80 hover:text-[#b65a3a] transition-all cursor-pointer text-left px-4 flex items-center justify-between"
              >
                <span>Preservation Analytics</span>
                <ChevronRight className="w-4 h-4 text-[#b65a3a]" />
              </button>
              <button 
                onClick={() => onNavigate('admin/activity')}
                className="w-full py-3 rounded-xl bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23]/80 hover:text-[#b65a3a] transition-all cursor-pointer text-left px-4 flex items-center justify-between"
              >
                <span>Inspect Audit Log</span>
                <ChevronRight className="w-4 h-4 text-[#b65a3a]" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* ── RECENT REPORTS LEDGER LOG ── */}
      <div className="space-y-4 text-left">
        <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-[#d5b990]/40">
          <Activity className="w-4 h-4" />
          Recent Preservation Log Entries
        </h3>
        
        {recentReports.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-[#ede3d1]/40 border border-[#d5b990]/50 space-y-3">
            <ClipboardList className="w-12 h-12 text-[#b65a3a]/30 mx-auto" />
            <h4 className="font-bold text-xs">No reports submitted</h4>
            <p className="text-[10px] text-[#4b2f23]/60">Preservation dashboard log is empty.</p>
          </div>
        ) : (
          <div className="bg-[#ede3d1]/80 border border-[#d5b990] rounded-2xl overflow-hidden shadow-md">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#ede3d1] text-[#4b2f23]/60 uppercase text-[9px] font-extrabold tracking-wider border-b border-[#d5b990]">
                  <tr>
                    <th className="p-4">Report ID</th>
                    <th className="p-4">Monument</th>
                    <th className="p-4">Issue</th>
                    <th className="p-4">Severity</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date Logged</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d5b990]/40 font-semibold text-[#4b2f23]/95">
                  {recentReports.map((report) => (
                    <tr key={report.id} className="hover:bg-[#ede3d1]/40 transition-colors">
                      <td className="p-4 font-mono text-[10px] text-[#b65a3a]">{report.id.substring(0, 8)}</td>
                      <td className="p-4 font-bold">{report.monumentName}</td>
                      <td className="p-4">{report.issueType}</td>
                      <td className="p-4 capitalize">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                          report.severity === 'critical' ? 'bg-red-500/10 text-red-600' :
                          report.severity === 'high' ? 'bg-amber-500/10 text-amber-600' :
                          report.severity === 'medium' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {report.severity}
                        </span>
                      </td>
                      <td className="p-4 capitalize">
                        <span className="px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wide bg-[#f5f0e6] border-[#d5b990]">
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-[#4b2f23]/60 text-[10px]">
                        {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => onNavigate(`admin/reports/${report.id}`)}
                          className="px-3 py-1 rounded bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] hover:bg-[#ede3d1] text-[#b65a3a] text-[10px] font-bold uppercase transition-all cursor-pointer shadow-sm"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards Stack View */}
            <div className="md:hidden divide-y divide-[#d5b990]/40">
              {recentReports.map((report) => (
                <div key={report.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] text-[#b65a3a] font-bold">#{report.id.substring(0, 8)}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                      report.severity === 'critical' ? 'bg-red-500/10 text-red-600' :
                      report.severity === 'high' ? 'bg-amber-500/10 text-amber-600' :
                      report.severity === 'medium' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-emerald-500/10 text-emerald-600'
                    }`}>
                      {report.severity}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#4b2f23]">{report.monumentName}</h4>
                    <p className="text-[10px] text-[#4b2f23]/60 font-semibold">{report.issueType}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-[#d5b990]/20">
                    <span className="px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-wider bg-[#f5f0e6] border-[#d5b990]">
                      {report.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => onNavigate(`admin/reports/${report.id}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#b65a3a] text-white text-[10px] font-bold uppercase cursor-pointer"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </motion.div>
  );
};
