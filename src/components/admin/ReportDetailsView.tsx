import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  MapPin,
  Sparkles,
  Layers,
  Send,
  Eye,
  FileText,
  UserCheck,
  FileCheck2,
  Trash2
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useAuthStore } from '../../store/authStore';
import { 
  HeritageReport, 
  ReportStatus, 
  ReportStatusHistory, 
  ReportAssignment, 
  FieldVerification, 
  ReportResolution 
} from '../../types';
import { motion } from 'framer-motion';

interface ReportDetailsViewProps {
  reportId: string;
  onNavigate: (route: string) => void;
}

export const ReportDetailsView: React.FC<ReportDetailsViewProps> = ({ reportId, onNavigate }) => {
  const { profile } = useAuthStore();
  const [report, setReport] = useState<HeritageReport | null>(null);
  const [timeline, setTimeline] = useState<ReportStatusHistory[]>([]);
  const [assignment, setAssignment] = useState<ReportAssignment | null>(null);
  const [verification, setVerification] = useState<FieldVerification | null>(null);
  const [resolution, setResolution] = useState<ReportResolution | null>(null);
  const [relatedReports, setRelatedReports] = useState<HeritageReport[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active image in gallery
  const [activeImage, setActiveImage] = useState<string>('');

  // Form inputs
  const [statusNote, setStatusNote] = useState('');
  
  const [assignedRole, setAssignedRole] = useState('Archaeologist');
  const [assignedName, setAssignedName] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [assignmentNote, setAssignmentNote] = useState('');

  const [verificationStatus, setVerificationStatus] = useState<'confirmed' | 'not_confirmed' | 'requires_further_study'>('confirmed');
  const [observedCondition, setObservedCondition] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');

  const [resolutionSummary, setResolutionSummary] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionEvidence, setResolutionEvidence] = useState('');

  // Confirmation state
  const [showConfirmAction, setShowConfirmAction] = useState<'status' | 'assign' | 'verify' | 'resolve' | null>(null);
  const [statusToTransition, setStatusToTransition] = useState<ReportStatus | null>(null);

  const officerName = profile?.full_name || 'Heritage Officer';

  const loadData = async () => {
    try {
      setLoading(true);
      const rep = await adminService.getReportById(reportId);
      setReport(rep);
      if (rep.visualEvidence && rep.visualEvidence.length > 0) {
        setActiveImage(rep.visualEvidence[0]);
      }

      // Fetch status timeline
      const time = await adminService.getReportTimeline(reportId);
      setTimeline(time);

      // Fetch assignment if any
      const assign = await adminService.getReportAssignment(reportId);
      setAssignment(assign);

      // Fetch verification if any
      const verify = await adminService.getFieldVerification(reportId);
      setVerification(verify);

      // Fetch resolution if any
      const res = await adminService.getReportResolution(reportId);
      setResolution(res);

      // Fetch related
      const related = await adminService.getRelatedReports(rep.monumentId, reportId);
      setRelatedReports(related);

      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching report details:', err);
      setError(err.message || 'Failed to load report from database.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [reportId]);

  // Actions
  const handleTransitionStatus = async (status: ReportStatus) => {
    if (!report) return;
    try {
      await adminService.updateReportStatus({
        reportId: report.id,
        status,
        officerName,
        notes: statusNote
      });
      setStatusNote('');
      setShowConfirmAction(null);
      loadData();
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleAssignReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !assignedName || !targetDate) return;
    try {
      await adminService.assignReport({
        reportId: report.id,
        assignedRole,
        assignedToName: assignedName,
        targetDate,
        officerNote: assignmentNote,
        officerName
      });
      setAssignedName('');
      setAssignmentNote('');
      setShowConfirmAction(null);
      loadData();
    } catch (err: any) {
      alert('Failed to assign report: ' + err.message);
    }
  };

  const handleFieldVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !observedCondition || !recommendedAction) return;
    try {
      await adminService.submitFieldVerification({
        reportId: report.id,
        verificationStatus,
        observedCondition,
        recommendedAction,
        fieldNotes: verificationNotes,
        officerName
      });
      setObservedCondition('');
      setRecommendedAction('');
      setVerificationNotes('');
      setShowConfirmAction(null);
      loadData();
    } catch (err: any) {
      alert('Failed to log field survey: ' + err.message);
    }
  };

  const handleResolveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report || !resolutionSummary || !resolutionNotes) return;
    try {
      await adminService.resolveReport({
        reportId: report.id,
        summary: resolutionSummary,
        notes: resolutionNotes,
        evidenceUrl: resolutionEvidence,
        officerName
      });
      setResolutionSummary('');
      setResolutionNotes('');
      setResolutionEvidence('');
      setShowConfirmAction(null);
      loadData();
    } catch (err: any) {
      alert('Failed to resolve report: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-[#4b2f23]/60 uppercase tracking-widest font-black">Retrieving Preservation Record...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center space-y-3 max-w-xl mx-auto">
        <AlertTriangle className="w-10 h-10 text-red-500 mx-auto" />
        <h4 className="font-bold text-red-700">Record Unreachable</h4>
        <p className="text-xs text-red-700/80">{error || 'This report record does not exist.'}</p>
        <button 
          onClick={() => onNavigate('admin/reports')}
          className="px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-bold uppercase cursor-pointer"
        >
          Return to Ledger
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 text-left"
    >
      
      {/* ── HEADER BREADCRUMB COMMANDS ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#d5b990]/40 pb-5 gap-4">
        <div className="space-y-1">
          <button 
            onClick={() => onNavigate('admin/reports')}
            className="flex items-center gap-1.5 text-[10px] uppercase font-black tracking-widest text-[#b65a3a] hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to reports ledger</span>
          </button>
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-[#4b2f23]">
              REPORT #{report.id.substring(0, 8)}
            </h1>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wide bg-[#f5f0e6] border-[#d5b990]`}>
                {report.status.replace('_', ' ')}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide ${
                report.severity === 'critical' ? 'bg-red-500/10 text-red-700 border border-red-500/20' :
                report.severity === 'high' ? 'bg-amber-500/10 text-amber-700 border border-amber-500/20' :
                'bg-[#ede3d1] text-[#4b2f23]/80 border border-[#d5b990]'
              }`}>
                {report.severity} Priority
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Map Action */}
        {report.gpsLatitude && report.gpsLongitude && (
          <button
            onClick={() => onNavigate('admin/risk-monitor')}
            className="px-4 py-2 bg-[#b65a3a] hover:bg-[#4b2f23] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow flex items-center gap-2 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Locate on Risk Map</span>
          </button>
        )}
      </div>

            {/* ── DETAILS & DIAGNOSTICS ROW ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in duration-200">
        
        {/* Left: Metadata & Citizen Description (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Report Information Grid */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Preservation Case Metadata
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[#4b2f23]/50 text-[9px] uppercase tracking-wider block">Monument</span>
                <span className="text-sm font-bold text-[#4b2f23]">{report.monumentName}</span>
              </div>
              <div>
                <span className="text-[#4b2f23]/50 text-[9px] uppercase tracking-wider block">Region/State</span>
                <span className="text-sm font-bold text-[#4b2f23]">{report.state}</span>
              </div>
              <div>
                <span className="text-[#4b2f23]/50 text-[9px] uppercase tracking-wider block">Issue Classification</span>
                <span className="text-[#4b2f23]">{report.issueType}</span>
              </div>
              <div>
                <span className="text-[#4b2f23]/50 text-[9px] uppercase tracking-wider block">Submitted Date</span>
                <span className="text-[#4b2f23]">
                  {new Date(report.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                </span>
              </div>
              {report.gpsLatitude && (
                <div className="sm:col-span-2">
                  <span className="text-[#4b2f23]/50 text-[9px] uppercase tracking-wider block">GPS Coordinates</span>
                  <span className="font-mono text-[#b65a3a]">
                    Lat: {report.gpsLatitude.toFixed(6)} • Lng: {report.gpsLongitude?.toFixed(6)}
                  </span>
                </div>
              )}
              {report.reporterName && (
                <div className="sm:col-span-2 border-t border-[#d5b990]/30 pt-3">
                  <span className="text-[#4b2f23]/50 text-[9px] uppercase tracking-wider block">Reporter Details</span>
                  <span className="text-[#4b2f23]">
                    {report.reporterName} ({report.reporterEmail || 'No contact email verified'})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Citizen Description */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-3">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40">
              Citizen / Researcher Observation Statement
            </h3>
            <blockquote className="text-xs text-[#4b2f23]/80 italic border-l-2 border-[#b65a3a] pl-4 py-1 leading-relaxed">
              "{report.description}"
            </blockquote>
          </div>

        </div>

        {/* Right: AI Assessment & Vulnerability Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* AI Preliminary Assessment */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/85 border border-[#d5b990] shadow-md space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#b65a3a]/5 rounded-full blur-xl pointer-events-none" />
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#b65a3a]" />
              AI Preliminary Diagnostic Assessment
            </h3>
            
            <div className="space-y-3 text-xs leading-relaxed text-left">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-700">
                  ASSESSMENT GENERATED
                </span>
                <span className="text-[10px] text-[#4b2f23]/60 font-semibold">Confidence: 87%</span>
              </div>
              <p className="text-[#4b2f23]/80 font-medium">
                {report.aiAssessment || 'Diagnostic report currently compiling... Localized conservation algorithm scanning monument material details.'}
              </p>
            </div>
          </div>

          {/* Preservation Priority Formula Breakdown */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40">
              DHAROHAR Preservation Priority Score
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="space-y-1.5 flex-1 text-left">
                <p className="text-xs text-[#4b2f23]/80 leading-relaxed">
                  Calculated automatically based on monument vulnerability, weather exposure, report recency, and structural severity class weight values.
                </p>
                <div className="flex flex-wrap gap-2 text-[9px] font-black uppercase text-[#4b2f23]/60">
                  <span>Severity: 40%</span>
                  <span>•</span>
                  <span>Recency: 30%</span>
                  <span>•</span>
                  <span>Sens: 30%</span>
                </div>
              </div>
              <div className="w-24 h-24 rounded-full border-4 border-[#b65a3a] flex flex-col items-center justify-center bg-[#f5f0e6] shadow shrink-0">
                <span className="text-3xl font-black text-[#b65a3a]">{report.priorityScore}</span>
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-[#4b2f23]/60 leading-none">Vulnerability</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── WORKFLOW & ACTIONS ROW (Balanced columns) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-[#d5b990]/30">
        
        {/* Left: Timeline History & Related Incidents (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Status Timeline History Card */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4 text-left">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40">
              Preservation Case Status History
            </h3>
            
            <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[9px] before:w-0.5 before:bg-[#d5b990]/80">
              {timeline.map((mile, idx) => {
                const isLatest = idx === timeline.length - 1;
                return (
                  <div key={mile.id} className="relative">
                    <span className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 bg-[#f5f0e6] flex items-center justify-center ${
                      isLatest ? 'border-[#b65a3a] text-[#b65a3a]' : 'border-[#d5b990] text-[#4b2f23]/50'
                    }`}>
                      <Clock className="w-3 h-3" />
                    </span>
                    <div className="text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="uppercase font-bold tracking-wider text-[10px] text-[#4b2f23]">{mile.status.replace('_', ' ')}</strong>
                        <span className="text-[9px] text-[#4b2f23]/50">
                          {new Date(mile.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[#4b2f23]/70 mt-0.5 text-[11px] leading-relaxed">{mile.notes}</p>
                      {mile.officerName && (
                        <span className="text-[8px] font-bold text-[#b65a3a] block mt-1 uppercase tracking-wide">
                          Logged By: {mile.officerName}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Status transition triggers */}
            {report.status !== 'resolved' && (
              <div className="pt-4 border-t border-[#d5b990]/40 space-y-3">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#4b2f23]/50 block">Quick Actions</span>
                <div className="flex gap-2 flex-wrap">
                  {report.status === 'submitted' && (
                    <button
                      onClick={() => {
                        setStatusToTransition('under_review');
                        setShowConfirmAction('status');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#d5b990] hover:border-[#b65a3a] bg-[#f5f0e6] text-[#b65a3a] text-[10px] font-bold uppercase transition-all cursor-pointer"
                    >
                      Start Review
                    </button>
                  )}
                  {report.status === 'under_review' && (
                    <button
                      onClick={() => {
                        setStatusToTransition('requires_more_info');
                        setShowConfirmAction('status');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-[#d5b990] hover:border-amber-500 bg-[#f5f0e6] text-amber-600 text-[10px] font-bold uppercase transition-all cursor-pointer"
                    >
                      Request Info
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Related / Duplicate Reports list */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 text-left">
              Related Regional Incidents
            </h3>
            
            {relatedReports.length === 0 ? (
              <p className="text-[10px] text-[#4b2f23]/65 italic text-left">No overlapping reports logged for this monument location.</p>
            ) : (
              <div className="space-y-2.5 text-left">
                {relatedReports.map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onNavigate(`admin/reports/${rel.id}`)}
                    className="w-full p-3.5 rounded-xl bg-[#f5f0e6] border border-[#d5b990] hover:border-[#b65a3a] text-left transition-all text-xs font-semibold cursor-pointer block"
                  >
                    <div className="flex justify-between items-center text-[10px] uppercase font-extrabold text-[#b65a3a] pb-1">
                      <span>#{rel.id.substring(0, 8)}</span>
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700">{rel.severity}</span>
                    </div>
                    <p className="text-[#4b2f23] font-bold truncate">{rel.monumentName}</p>
                    <p className="text-[10px] text-[#4b2f23]/60 truncate mt-0.5">{rel.issueType}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right: Workflow Action Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Assignment Panel */}
          {report.status !== 'resolved' && (
            <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4 text-left">
              <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                Case Assignment Workflow
              </h3>

              {assignment ? (
                <div className="text-xs space-y-3 bg-[#f5f0e6] p-4 rounded-2xl border border-[#d5b990]/50">
                  <div className="grid grid-cols-2 gap-2 font-semibold">
                    <div>
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Assigned Unit</span>
                      <span>{assignment.assignedToName}</span>
                    </div>
                    <div>
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Assigned Role</span>
                      <span>{assignment.assignedRole}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Target Due Date</span>
                      <span>{new Date(assignment.targetDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                  {assignment.officerNote && (
                    <div className="pt-2 border-t border-[#d5b990]/35 text-[#4b2f23]/75 italic">
                      " {assignment.officerNote} "
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setShowConfirmAction('assign'); }} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Assigned Role</label>
                    <select
                      value={assignedRole}
                      onChange={(e) => setAssignedRole(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] text-xs font-bold uppercase tracking-wider text-[#4b2f23]"
                    >
                      <option value="Archaeologist">Archaeologist</option>
                      <option value="Conservation Officer">Conservation Officer</option>
                      <option value="Structural Engineer">Structural Engineer</option>
                      <option value="Field Survey Team">Field Survey Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Surveyor / Specialist Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Dr. Ramesh Kumar"
                      value={assignedName}
                      onChange={(e) => setAssignedName(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Target Inspection Date</label>
                    <input 
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-bold text-xs text-[#4b2f23] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Special Survey Notes</label>
                    <textarea 
                      rows={2}
                      placeholder="Detail scan bounds or diagnostic guidelines..."
                      value={assignmentNote}
                      onChange={(e) => setAssignmentNote(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                  >
                    Assign for Field Verification
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Field Verification Observation Sheet */}
          {report.status !== 'resolved' && (
            <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4 text-left">
              <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                Field Verification Observation Log
              </h3>

              {verification ? (
                <div className="text-xs space-y-3 bg-[#f5f0e6] p-4 rounded-2xl border border-[#d5b990]/50">
                  <div className="grid grid-cols-2 gap-2 font-semibold">
                    <div>
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Observation Result</span>
                      <span className="capitalize">{verification.verificationStatus.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Verified By</span>
                      <span>{verification.verifiedByName}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Observed Condition</span>
                      <p className="text-[#4b2f23]/80 leading-relaxed font-normal">{verification.observedCondition}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Recommended Action</span>
                      <p className="text-[#4b2f23]/80 leading-relaxed font-normal">{verification.recommendedAction}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setShowConfirmAction('verify'); }} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Status Verification</label>
                    <select
                      value={verificationStatus}
                      onChange={(e) => setVerificationStatus(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] text-xs font-bold uppercase tracking-wider text-[#4b2f23]"
                    >
                      <option value="confirmed">Confirmed Damage</option>
                      <option value="not_confirmed">Not Confirmed (False Alarm)</option>
                      <option value="requires_further_study">Requires Further Study</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Observed Structural Condition</label>
                    <textarea 
                      rows={2}
                      placeholder="Detail cracks width, surface discoloration rate..."
                      value={observedCondition}
                      onChange={(e) => setObservedCondition(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Recommended Conservation Plan</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Lime mud-pack treat, structural scaffolding brace..."
                      value={recommendedAction}
                      onChange={(e) => setRecommendedAction(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Additional Notes</label>
                    <textarea 
                      rows={1}
                      placeholder="Weather conditions, team dispatch details..."
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none resize-none"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                  >
                    Submit Field Verification Sheet
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Resolution form sheet */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] shadow-md space-y-4 text-left">
            <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest pb-2 border-b border-[#d5b990]/40 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Conservation Case Resolution Summary
            </h3>

            {resolution ? (
              <div className="text-xs space-y-3 bg-[#f5f0e6] p-4 rounded-2xl border border-[#d5b990]/50">
                <div className="space-y-2">
                  <div>
                    <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Resolution Summary</span>
                    <strong className="text-sm font-bold text-emerald-700">{resolution.summary}</strong>
                  </div>
                  <div>
                    <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Resolution Date</span>
                    <span>{new Date(resolution.resolvedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                  </div>
                  <div>
                    <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Officer Remarks</span>
                    <p className="text-[#4b2f23]/80 leading-relaxed font-normal">{resolution.notes}</p>
                  </div>
                  {resolution.evidenceUrl && (
                    <div>
                      <span className="text-[#4b2f23]/40 text-[9px] uppercase tracking-wider block">Post-Resolution Photo</span>
                      <a href={resolution.evidenceUrl} target="_blank" rel="noreferrer" className="text-xs text-[#b65a3a] hover:underline font-bold">
                        View Evidence Photo Link
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setShowConfirmAction('resolve'); }} className="space-y-3 text-xs">
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Resolution Summary</label>
                  <input 
                    type="text"
                    placeholder="e.g. Lintel cracks reinforced via non-magnetic steel rods."
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Detailed Resolution Notes</label>
                  <textarea 
                    rows={3}
                    placeholder="Detailed conservation tasks logged, clay packs applications, mortar checks..."
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block mb-1">Post-Restoration Evidence URL</label>
                  <input 
                    type="url"
                    placeholder="https://post-cleanup-photo-url.com"
                    value={resolutionEvidence}
                    onChange={(e) => setResolutionEvidence(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#d5b990] bg-[#f5f0e6] font-semibold text-xs text-[#4b2f23] outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow cursor-pointer"
                >
                  Mark Case Resolved
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* ── CONFIRMATION MODALS DIALOG ── */}
      {showConfirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirmAction(null)} />
          <div className="relative bg-[#ede3d1] border border-[#d5b990] p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl text-center space-y-5">
            <AlertTriangle className="w-12 h-12 text-[#b65a3a] mx-auto animate-pulse" />
            <div className="space-y-2">
              <h3 className="font-display text-xl font-bold text-[#4b2f23]">Confirm Action</h3>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                {showConfirmAction === 'status' && `Transition this case to: ${statusToTransition?.replace('_', ' ')}?`}
                {showConfirmAction === 'assign' && `Assign Dr. ${assignedName} to inspect this structural issue?`}
                {showConfirmAction === 'verify' && 'Log verification sheet details into the database?' }
                {showConfirmAction === 'resolve' && 'Permanently mark this conservation report as resolved?'}
              </p>
            </div>
            
            {showConfirmAction === 'status' && (
              <textarea
                placeholder="Optionally add notes regarding this transition..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full p-2.5 text-xs border border-[#d5b990] bg-[#f5f0e6] rounded-xl outline-none resize-none font-semibold"
                rows={2}
              />
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowConfirmAction(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#d5b990] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23]/80 hover:bg-[#f5f0e6] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (showConfirmAction === 'status' && statusToTransition) {
                    handleTransitionStatus(statusToTransition);
                  } else if (showConfirmAction === 'assign') {
                    const form = document.querySelector('form');
                    handleAssignReport({ preventDefault: () => {} } as any);
                  } else if (showConfirmAction === 'verify') {
                    handleFieldVerify({ preventDefault: () => {} } as any);
                  } else if (showConfirmAction === 'resolve') {
                    handleResolveCase({ preventDefault: () => {} } as any);
                  }
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </motion.div>
  );
};
