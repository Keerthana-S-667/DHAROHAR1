import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  SlidersHorizontal, 
  RefreshCw, 
  AlertCircle,
  FileText,
  Clock,
  CheckCircle2,
  Users
} from 'lucide-react';
import { adminService, mapReportFromDb } from '../../services/adminService';
import { HeritageReport } from '../../types';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface ReportsLedgerViewProps {
  onNavigate: (route: string) => void;
}

export const ReportsLedgerView: React.FC<ReportsLedgerViewProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<HeritageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [realtimeNotification, setRealtimeNotification] = useState<HeritageReport | null>(null);

  // Filter States
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [severity, setSeverity] = useState('all');
  const [state, setState] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority' | 'severity'>('newest');

  // Real-time Supabase Subscription
  useEffect(() => {
    const channel = supabase
      .channel('heritage_reports_realtime_ledger')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'heritage_reports' },
        (payload) => {
          console.log('Real-time database event received:', payload);
          if (payload.eventType === 'INSERT') {
            const newReport = mapReportFromDb(payload.new);
            setReports((prev) => {
              // Deduplicate by ID
              if (prev.some((r) => r.id === newReport.id)) return prev;
              return [newReport, ...prev];
            });
            setRealtimeNotification(newReport);
          } else if (payload.eventType === 'UPDATE') {
            const updatedReport = mapReportFromDb(payload.new);
            setReports((prev) =>
              prev.map((r) => (r.id === updatedReport.id ? updatedReport : r))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id;
            setReports((prev) => prev.filter((r) => r.id !== deletedId));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load Data
  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await adminService.getReports({
        search,
        status,
        severity,
        state,
        sortBy
      });
      setReports(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching ledger reports:', err);
      setError(err.message || 'Failed to query database.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [search, status, severity, state, sortBy]);

  // Unique States list for filter option
  const indianStates = [
    { value: 'all', label: 'All States' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Karnataka', label: 'Karnataka' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Delhi NCR', label: 'Delhi NCR' },
    { value: 'Odisha', label: 'Odisha' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Uttar Pradesh', label: 'Uttar Pradesh' },
    { value: 'Gujarat', label: 'Gujarat' },
    { value: 'Bihar', label: 'Bihar' },
    { value: 'West Bengal', label: 'West Bengal' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left relative"
    >
      {/* Real-time Notification Banner */}
      {realtimeNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-3xl bg-[#ede3d1] border-2 border-[#b65a3a] shadow-2xl text-left max-w-sm space-y-2 animate-fade-in-up duration-200">
          <div className="flex items-center gap-2 text-xs font-black uppercase text-[#b65a3a] tracking-wider">
            <AlertCircle className="w-4 h-4 text-[#b65a3a]" />
            New Heritage Report
          </div>
          <p className="text-xs font-bold text-[#4b2f23]">
            A new preservation report has been submitted for <strong className="text-[#b65a3a]">{realtimeNotification.monumentName}</strong>.
          </p>
          <div className="flex justify-between items-center pt-2 gap-4">
            <button
              onClick={() => {
                const reportIdToView = realtimeNotification.id;
                setRealtimeNotification(null);
                onNavigate(`admin/reports/${reportIdToView}`);
              }}
              className="px-3 py-1.5 bg-[#b65a3a] text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#4b2f23] transition-colors cursor-pointer"
            >
              View Report
            </button>
            <button
              onClick={() => setRealtimeNotification(null)}
              className="text-[10px] text-[#4b2f23]/60 font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#d5b990]/40 pb-5 gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#4b2f23]">
            HERITAGE PRESERVATION REPORTS
          </h1>
          <p className="text-xs text-[#4b2f23]/60 mt-1">
            Browse structural anomalies, surface chemical weathering issues, and active restoration cases.
          </p>
        </div>
        <button
          onClick={loadReports}
          className="flex items-center gap-1.5 px-4 py-2 border border-[#d5b990] hover:border-[#b65a3a] rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer bg-[#f5f0e6]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh ledger</span>
        </button>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="p-5 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#4b2f23]/40">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search monument, issue, or state..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#d5b990] focus:border-[#b65a3a] bg-[#f5f0e6] text-xs font-semibold placeholder:text-[#4b2f23]/40 outline-none transition-colors"
            />
          </div>

          {/* Filters Select Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-4 gap-3">
            
            {/* Status Filter */}
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#d5b990] focus:border-[#b65a3a] bg-[#f5f0e6] text-xs font-bold uppercase tracking-wider text-[#4b2f23] outline-none cursor-pointer appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="assigned">Assigned</option>
                <option value="field_verification">Field Verification</option>
                <option value="action_conservation">Conservation Action</option>
                <option value="requires_more_info">Need Info</option>
                <option value="resolved">Resolved</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#4b2f23]/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Severity Filter */}
            <div className="relative">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#d5b990] focus:border-[#b65a3a] bg-[#f5f0e6] text-xs font-bold uppercase tracking-wider text-[#4b2f23] outline-none cursor-pointer appearance-none"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#4b2f23]/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* State Filter */}
            <div className="relative">
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#d5b990] focus:border-[#b65a3a] bg-[#f5f0e6] text-xs font-bold uppercase tracking-wider text-[#4b2f23] outline-none cursor-pointer appearance-none"
              >
                {indianStates.map((st) => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#4b2f23]/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl border border-[#d5b990] focus:border-[#b65a3a] bg-[#f5f0e6] text-xs font-bold uppercase tracking-wider text-[#4b2f23] outline-none cursor-pointer appearance-none"
              >
                <option value="newest">Newest Logged</option>
                <option value="oldest">Oldest Logged</option>
                <option value="priority">Highest Priority</option>
                <option value="severity">Highest Severity</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#4b2f23]/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

        </div>
      </div>

      {/* ── REPORTS LIST / TABLE ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#4b2f23]/60 uppercase tracking-widest font-black">Filtering Database Ledger...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h4 className="font-bold text-red-700">Failed to Retrieve Reports</h4>
          <p className="text-xs text-red-700/80">{error}</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#ede3d1]/40 border border-[#d5b990] space-y-3 shadow-inner">
          <AlertCircle className="w-12 h-12 text-[#b65a3a]/30 mx-auto animate-pulse" />
          <h4 className="font-bold text-xs">No Preservation Records Match Selected Query</h4>
          <p className="text-[10px] text-[#4b2f23]/60 max-w-sm mx-auto">Try clearing search parameters, adjusting state filters, or reviewing alternative statuses.</p>
        </div>
      ) : (
        <div className="bg-[#ede3d1]/80 border border-[#d5b990] rounded-3xl overflow-hidden shadow-md">
          
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ede3d1] border-b border-[#d5b990] text-[#4b2f23]/60 uppercase text-[9px] font-black tracking-wider">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Monument</th>
                  <th className="p-4">State</th>
                  <th className="p-4">Issue Type</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Submitted Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d5b990]/40 font-semibold text-[#4b2f23]/95">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-[#ede3d1]/40 transition-colors">
                    <td className="p-4 font-mono text-[10px] text-[#b65a3a]">#{report.id.substring(0, 8)}</td>
                    <td className="p-4 font-bold">{report.monumentName}</td>
                    <td className="p-4">{report.state}</td>
                    <td className="p-4">{report.issueType}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                        report.severity === 'critical' ? 'bg-red-500/15 text-red-600' :
                        report.severity === 'high' ? 'bg-amber-500/15 text-amber-600' :
                        report.severity === 'medium' ? 'bg-indigo-500/15 text-indigo-600' : 'bg-emerald-500/15 text-emerald-600'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#b65a3a]">{report.priorityScore}</td>
                    <td className="p-4 text-[#4b2f23]/60 text-[10px]">
                      {new Date(report.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 capitalize">
                      <span className="px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wide bg-[#f5f0e6] border-[#d5b990]">
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onNavigate(`admin/reports/${report.id}`)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] hover:bg-[#ede3d1] text-[#b65a3a] text-[10px] font-bold uppercase transition-all cursor-pointer shadow-sm"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Stack view */}
          <div className="md:hidden divide-y divide-[#d5b990]/40">
            {reports.map((report) => (
              <div key={report.id} className="p-5 space-y-3 text-left">
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
                  <p className="text-[10px] text-[#4b2f23]/60 font-semibold">{report.state} • {report.issueType}</p>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[#d5b990]/20">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-wider text-[#4b2f23]/40 leading-none">Preservation score</span>
                    <span className="text-xs font-bold text-[#b65a3a]">{report.priorityScore} / 100</span>
                  </div>
                  <button
                    onClick={() => onNavigate(`admin/reports/${report.id}`)}
                    className="px-4 py-2 rounded-xl bg-[#b65a3a] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </motion.div>
  );
};
