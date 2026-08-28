import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { HeritageMap } from '../HeritageMap';
import { HeritageReport } from '../../types';
import { heritageService } from '../../services/heritageService';
import { motion } from 'framer-motion';

interface RiskMonitorViewProps {
  onNavigate: (route: string) => void;
}

export const RiskMonitorView: React.FC<RiskMonitorViewProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<HeritageReport[]>([]);
  const [selectedMonumentId, setSelectedMonumentId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await adminService.getReports();
        setReports(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching reports for risk monitoring:', err);
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  // Standard monuments catalog
  const monumentsList = Object.values(heritageService.getMonuments());

  // Aggregate stats per monument based on real reports
  const monumentRiskMetrics = monumentsList.map(monument => {
    const monReports = reports.filter(r => r.monumentId === monument.id);
    const openReports = monReports.filter(r => r.status !== 'resolved');
    const highPriority = openReports.filter(r => r.priorityScore >= 80);
    
    // Determine risk status deterministically based on high priority counts
    let riskLevel: 'stable' | 'moderate' | 'high' | 'critical' = 'stable';
    if (highPriority.length > 0) {
      riskLevel = highPriority.length >= 2 ? 'critical' : 'high';
    } else if (openReports.length > 0) {
      riskLevel = 'moderate';
    }

    // Get latest report date
    const latestDate = monReports.length > 0 
      ? new Date(Math.max(...monReports.map(r => new Date(r.createdAt).getTime())))
      : null;

    return {
      monument,
      openCount: openReports.length,
      highPriorityCount: highPriority.length,
      riskLevel,
      latestDate
    };
  });

  const selectedMetric = selectedMonumentId 
    ? monumentRiskMetrics.find(m => m.monument.id === selectedMonumentId) 
    : null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      
      {/* ── HEADER ── */}
      <div className="border-b border-[#d5b990]/40 pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#4b2f23]">
          HERITAGE PRESERVATION RISK MONITOR
        </h1>
        <p className="text-xs text-[#4b2f23]/60 mt-1">
          Monitor monument vulnerability statuses based on active structural threats and environmental weathering complaints.
        </p>
      </div>

      {/* ── INTERACTIVE MAP PANEL ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Map viewport (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#b65a3a] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              Preservation Map Overview
            </span>
            {selectedMonumentId && (
              <button 
                onClick={() => setSelectedMonumentId(null)}
                className="text-[9px] text-[#4b2f23]/60 hover:text-[#b65a3a] font-bold"
              >
                Clear selection
              </button>
            )}
          </div>

          <div className="h-[420px] rounded-3xl overflow-hidden border border-[#d5b990] shadow-md bg-stone-100 relative">
            <HeritageMap 
              selectedMonumentId={selectedMonumentId}
              onSelectMonument={setSelectedMonumentId}
              onNavigate={onNavigate}
            />
          </div>
        </div>

        {/* Right: Selected Marker Card or Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#b65a3a] block">
            Map Incident Diagnostics
          </span>

          {selectedMetric ? (
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#d5b990] shadow-md space-y-5 text-left">
              <div className="space-y-1.5">
                <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                  selectedMetric.riskLevel === 'critical' ? 'bg-red-500/15 text-red-700' :
                  selectedMetric.riskLevel === 'high' ? 'bg-amber-500/15 text-amber-700' :
                  selectedMetric.riskLevel === 'moderate' ? 'bg-blue-500/15 text-blue-700' : 'bg-emerald-500/15 text-emerald-700'
                }`}>
                  DHAROHAR Risk Status: {selectedMetric.riskLevel}
                </span>
                <h3 className="font-display text-xl font-black text-[#4b2f23]">
                  {selectedMetric.monument.name}
                </h3>
                <p className="text-[10px] text-[#4b2f23]/50 font-bold uppercase tracking-wider">
                  {selectedMetric.monument.location.city}, {selectedMetric.monument.location.state}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-[#d5b990]/40 pt-4 text-xs font-semibold">
                <div>
                  <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Open Cases</span>
                  <span className="text-sm font-bold text-[#4b2f23]">{selectedMetric.openCount} reports</span>
                </div>
                <div>
                  <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Emergency Cases</span>
                  <span className="text-sm font-bold text-red-600">{selectedMetric.highPriorityCount} priority</span>
                </div>
                {selectedMetric.latestDate && (
                  <div className="col-span-2">
                    <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Latest Incident Logged</span>
                    <span>{selectedMetric.latestDate.toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#d5b990]/40">
                <button
                  onClick={() => onNavigate('admin/reports')}
                  className="w-full py-3 rounded-xl bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-black uppercase tracking-wider text-center transition-all cursor-pointer shadow"
                >
                  Inspect Reports Ledger for {selectedMetric.monument.name}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl bg-[#ede3d1]/50 border border-[#d5b990] space-y-4">
              <TrendingUp className="w-10 h-10 text-[#b65a3a]/30 mx-auto" />
              <h4 className="font-bold text-xs">No Site Selected</h4>
              <p className="text-[10px] text-[#4b2f23]/60 max-w-xs mx-auto leading-relaxed">
                Click on any monument pin on the left map layer to view active preservation complaints, priority score aggregates, and logs.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* ── MONUMENTS RISK LISTING MATRIX ── */}
      <div className="space-y-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#b65a3a] block">
          preservation threat monitoring deck
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {monumentRiskMetrics.map((item) => (
            <div 
              key={item.monument.id} 
              className="p-5 rounded-2xl bg-[#ede3d1]/80 border border-[#d5b990] hover:border-[#b65a3a]/40 shadow-md hover:shadow-lg transition-all flex flex-col justify-between space-y-4 text-left"
            >
              <div className="space-y-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-display font-black text-[#4b2f23] truncate pr-2 max-w-[170px]">{item.monument.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shrink-0 ${
                    item.riskLevel === 'critical' ? 'bg-red-500/10 text-red-600 border border-red-500/20' :
                    item.riskLevel === 'high' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                    item.riskLevel === 'moderate' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  }`}>
                    {item.riskLevel}
                  </span>
                </div>
                <p className="text-[9px] text-[#4b2f23]/50 font-bold uppercase tracking-wider">{item.monument.location.state}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-[#d5b990]/35 pt-3 text-[10px] font-semibold text-[#4b2f23]/80">
                <div>
                  <span className="text-[#4b2f23]/40 text-[8px] uppercase tracking-wider block">Open Cases</span>
                  <span>{item.openCount} cases</span>
                </div>
                <div>
                  <span className="text-[#4b2f23]/40 text-[8px] uppercase tracking-wider block">Emergency Cases</span>
                  <span className={item.highPriorityCount > 0 ? 'text-red-500 font-bold' : ''}>
                    {item.highPriorityCount} priority
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setSelectedMonumentId(item.monument.id);
                    // Scroll smooth to map container
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full py-2 bg-[#f5f0e6] hover:bg-[#ede3d1] border border-[#d5b990] hover:border-[#b65a3a] text-[#b65a3a] rounded-xl text-[9px] font-bold uppercase tracking-wider text-center transition-all cursor-pointer"
                >
                  Locate on Map
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
};
