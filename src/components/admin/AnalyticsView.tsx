import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { HeritageReport } from '../../types';
import { motion } from 'framer-motion';

export const AnalyticsView: React.FC = () => {
  const [reports, setReports] = useState<HeritageReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportsData() {
      try {
        const data = await adminService.getReports();
        setReports(data);
        setLoading(false);
      } catch (err) {
        console.error('Error loading analytics ledger:', err);
        setLoading(false);
      }
    }
    loadReportsData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#4b2f23]/60 uppercase tracking-widest font-black">Compiling Preservation Metrics...</p>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="p-16 text-center rounded-3xl bg-[#ede3d1]/40 border border-[#d5b990] space-y-3 shadow-inner">
        <BarChart3 className="w-12 h-12 text-[#b65a3a]/30 mx-auto" />
        <h4 className="font-bold text-xs">No analytics metadata available</h4>
        <p className="text-[10px] text-[#4b2f23]/60">Submit some preservation reports to unlock dashboard analytics charts.</p>
      </div>
    );
  }

  // Helper function to group and count fields
  const groupCount = (field: keyof HeritageReport) => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      const val = String(r[field]);
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  };

  const statusGroups = groupCount('status');
  const severityGroups = groupCount('severity');
  const issueGroups = groupCount('issueType');
  const stateGroups = groupCount('state');

  // Math metrics
  const resolvedCount = reports.filter(r => r.status === 'resolved').length;
  const resolutionRate = ((resolvedCount / reports.length) * 100).toFixed(0);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      
      {/* ── HEADER ── */}
      <div className="border-b border-[#d5b990]/40 pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#4b2f23]">
          PRESERVATION ANALYTICS & INSIGHTS
        </h1>
        <p className="text-xs text-[#4b2f23]/60 mt-1">
          Historical overview of logged architectural damages, resolutions, and regional concerns.
        </p>
      </div>

      {/* ── METRICS SUMMARY ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-5 rounded-3xl bg-[#ede3d1] border border-[#d5b990] text-left space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-[#b65a3a] font-bold">Logged Incidents</span>
          <span className="text-3xl font-black text-[#4b2f23] block">{reports.length} reports</span>
          <p className="text-[9px] text-[#4b2f23]/65">Total database case entries</p>
        </div>
        <div className="p-5 rounded-3xl bg-[#ede3d1] border border-[#d5b990] text-left space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-emerald-700 font-bold">Case Resolution Rate</span>
          <span className="text-3xl font-black text-emerald-700 block">{resolutionRate}%</span>
          <p className="text-[9px] text-[#4b2f23]/65">{resolvedCount} cases closed successfully</p>
        </div>
        <div className="p-5 rounded-3xl bg-[#ede3d1] border border-[#d5b990] text-left space-y-2">
          <span className="text-[9px] uppercase tracking-widest text-red-700 font-bold">Emergency Threat Ratio</span>
          <span className="text-3xl font-black text-red-700 block">
            {((reports.filter(r => r.priorityScore >= 80).length / reports.length) * 100).toFixed(0)}%
          </span>
          <p className="text-[9px] text-[#4b2f23]/65">Vulnerability scores rating &ge; 80</p>
        </div>
      </div>

      {/* ── CHART BAR GRAPHICS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Reports by Severity */}
        <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
          <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" />
            Vulnerability Cases by Severity
          </h3>
          <div className="space-y-3.5">
            {severityGroups.map(([key, count]) => {
              const pct = ((count / reports.length) * 100).toFixed(0);
              return (
                <div key={key} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="capitalize">{key}</span>
                    <span className="text-[#4b2f23]/60">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f5f0e6] rounded-full overflow-hidden border border-[#d5b990]/30">
                    <div 
                      className={`h-full rounded-full ${
                        key === 'critical' ? 'bg-red-600' :
                        key === 'high' ? 'bg-amber-500' :
                        key === 'medium' ? 'bg-indigo-500' : 'bg-emerald-500'
                      }`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports by Status */}
        <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
          <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            Vulnerability Cases by Status
          </h3>
          <div className="space-y-3.5">
            {statusGroups.map(([key, count]) => {
              const pct = ((count / reports.length) * 100).toFixed(0);
              return (
                <div key={key} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                    <span className="text-[#4b2f23]/60">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f5f0e6] rounded-full overflow-hidden border border-[#d5b990]/30">
                    <div 
                      className="h-full bg-[#b65a3a] rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports by State */}
        <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
          <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            Incidents Distribution by State
          </h3>
          <div className="space-y-3.5">
            {stateGroups.map(([key, count]) => {
              const pct = ((count / reports.length) * 100).toFixed(0);
              return (
                <div key={key} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span>{key}</span>
                    <span className="text-[#4b2f23]/60">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f5f0e6] rounded-full overflow-hidden border border-[#d5b990]/30">
                    <div 
                      className="h-full bg-[#b65a3a] rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports by Issue Type */}
        <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
          <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Cases by Issue Classification
          </h3>
          <div className="space-y-3.5">
            {issueGroups.map(([key, count]) => {
              const pct = ((count / reports.length) * 100).toFixed(0);
              return (
                <div key={key} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span>{key}</span>
                    <span className="text-[#4b2f23]/60">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#f5f0e6] rounded-full overflow-hidden border border-[#d5b990]/30">
                    <div 
                      className="h-full bg-[#b65a3a] rounded-full" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </motion.div>
  );
};
