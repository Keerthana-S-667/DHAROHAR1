import React, { useState, useEffect } from 'react';
import { 
  History, 
  User, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { ReportActivityLog } from '../../types';
import { motion } from 'framer-motion';

interface ActivityLogViewProps {
  onNavigate: (route: string) => void;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<ReportActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        const audit = await adminService.getAuditLogs();
        setLogs(audit);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activity log:', err);
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      
      {/* ── HEADER ── */}
      <div className="border-b border-[#d5b990]/40 pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#4b2f23]">
          ADMINISTRATIVE AUDIT LOG
        </h1>
        <p className="text-xs text-[#4b2f23]/60 mt-1">
          Review secure, non-modifiable records of all structural assignments, verifications, status changes, and moderation approvals.
        </p>
      </div>

      {/* ── LOGS TABLE ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#4b2f23]/60 uppercase tracking-widest font-black">Syncing Audit Trail...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#ede3d1]/40 border border-[#d5b990] space-y-3 shadow-inner">
          <History className="w-12 h-12 text-[#b65a3a]/30 mx-auto" />
          <h4 className="font-bold text-xs">Activity Log Empty</h4>
          <p className="text-[10px] text-[#4b2f23]/60">Administrative events will print here in real-time as actions occur.</p>
        </div>
      ) : (
        <div className="bg-[#ede3d1]/80 border border-[#d5b990] rounded-3xl overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#ede3d1] border-b border-[#d5b990] text-[#4b2f23]/60 uppercase text-[9px] font-black tracking-wider">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Officer Name</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Report ID</th>
                  <th className="p-4">Diagnostic Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d5b990]/40 font-semibold text-[#4b2f23]/95">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#ede3d1]/40 transition-colors">
                    <td className="p-4 text-[#4b2f23]/50 font-mono text-[10px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#b65a3a]/15 text-[#b65a3a] flex items-center justify-center font-bold text-[10px]">
                        {log.actorName[0]?.toUpperCase() || 'O'}
                      </div>
                      <span>{log.actorName}</span>
                    </td>
                    <td className="p-4 font-bold text-[#b65a3a] uppercase text-[10px] tracking-wider">
                      {log.action}
                    </td>
                    <td className="p-4 font-mono text-[#b65a3a]">
                      {log.reportId ? (
                        <button
                          onClick={() => onNavigate(`admin/reports/${log.reportId}`)}
                          className="hover:underline text-[10px] font-bold cursor-pointer text-left"
                        >
                          #{log.reportId.substring(0, 8)}
                        </button>
                      ) : (
                        <span className="text-[#4b2f23]/40">System-wide</span>
                      )}
                    </td>
                    <td className="p-4 text-xs font-semibold text-[#4b2f23]/80 leading-relaxed max-w-sm truncate sm:max-w-md">
                      {log.details || 'No additional remarks logged.'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </motion.div>
  );
};
