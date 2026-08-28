import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageSquare,
  AlertCircle,
  FileText
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { CommunityContribution } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

interface ContributionsViewProps {
  onNavigate: (route: string) => void;
}

export const ContributionsView: React.FC<ContributionsViewProps> = ({ onNavigate }) => {
  const { profile } = useAuthStore();
  const [contributions, setContributions] = useState<CommunityContribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectNote, setRejectNote] = useState('');

  const officerName = profile?.full_name || 'Heritage Officer';

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getContributions(activeTab);
      setContributions(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching contributions:', err);
      setError(err.message || 'Failed to query database.');
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleApprove = async (id: string) => {
    if (!confirm('Approve this contribution for public display?')) return;
    try {
      await adminService.moderateContribution({
        contributionId: id,
        status: 'approved',
        officerName
      });
      loadData();
    } catch (err: any) {
      alert('Failed to approve story: ' + err.message);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRejectModal || !rejectNote) return;
    try {
      await adminService.moderateContribution({
        contributionId: showRejectModal,
        status: 'rejected',
        moderationNote: rejectNote,
        officerName
      });
      setRejectNote('');
      setShowRejectModal(null);
      loadData();
    } catch (err: any) {
      alert('Failed to reject story: ' + err.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-left"
    >
      
      {/* ── HEADER ── */}
      <div className="border-b border-[#d5b990]/40 pb-5">
        <h1 className="font-display text-3xl font-bold tracking-tight text-[#4b2f23]">
          COMMUNITY CONTRIBUTIONS MODERATION
        </h1>
        <p className="text-xs text-[#4b2f23]/60 mt-1">
          Review, approve, or reject public heritage stories, travelogues, and local folklore narratives.
        </p>
      </div>

      {/* ── TAB FILTER TOGGLES ── */}
      <div className="flex gap-2 border-b border-[#d5b990]/30 pb-1.5 flex-wrap">
        {[
          { id: 'pending', label: 'Pending Review', icon: Clock },
          { id: 'approved', label: 'Approved Stories', icon: CheckCircle2 },
          { id: 'rejected', label: 'Rejected Entries', icon: XCircle }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#b65a3a] text-white shadow-sm'
                  : 'text-[#4b2f23]/70 hover:bg-[#ede3d1]/60 hover:text-[#b65a3a]'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── CONTRIBUTIONS STACK DECK ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <div className="w-10 h-10 border-4 border-[#b65a3a] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#4b2f23]/60 uppercase tracking-widest font-black">Syncing Contributions...</p>
        </div>
      ) : error ? (
        <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/20 text-center space-y-3">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h4 className="font-bold text-red-700">Database Query Failed</h4>
          <p className="text-xs text-red-700/80">{error}</p>
        </div>
      ) : contributions.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-[#ede3d1]/40 border border-[#d5b990] space-y-3 shadow-inner">
          <Users className="w-12 h-12 text-[#b65a3a]/30 mx-auto" />
          <h4 className="font-bold text-xs">No Stories Listed In This Category</h4>
          <p className="text-[10px] text-[#4b2f23]/60">Excellent! All public entries have been reviewed by moderators.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contributions.map((story) => (
            <div 
              key={story.id} 
              className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] flex flex-col justify-between space-y-4 shadow-md hover:shadow-lg transition-all text-left"
            >
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between items-start text-[10px] font-extrabold uppercase text-[#b65a3a]">
                    <span>{story.location}</span>
                    <span className="text-[#4b2f23]/40 font-semibold font-mono">
                      {new Date(story.createdAt).toLocaleDateString(undefined, { dateStyle: 'short' })}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-black text-[#4b2f23] leading-snug">{story.title}</h3>
                  <span className="text-[9px] font-bold text-[#4b2f23]/50 block">By: {story.contributorName}</span>
                </div>
                <p className="text-xs text-[#4b2f23]/85 leading-relaxed font-semibold whitespace-pre-line">
                  {story.content}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="pt-4 border-t border-[#d5b990]/40 flex justify-between items-center gap-3">
                {activeTab === 'pending' ? (
                  <>
                    <button
                      onClick={() => setShowRejectModal(story.id)}
                      className="px-4 py-2 border border-[#d5b990] hover:border-red-500 rounded-xl text-[10px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-500/5 transition-all cursor-pointer flex-1"
                    >
                      Reject Story
                    </button>
                    <button
                      onClick={() => handleApprove(story.id)}
                      className="px-4 py-2 bg-[#b65a3a] hover:bg-[#4b2f23] text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex-1 shadow-sm"
                    >
                      Approve Story
                    </button>
                  </>
                ) : activeTab === 'rejected' && story.moderationNote ? (
                  <div className="text-[10px] text-red-700 bg-red-500/5 border border-red-500/15 p-3 rounded-xl w-full leading-normal">
                    <strong className="block uppercase text-[8px] tracking-wider mb-0.5">Rejection reason:</strong>
                    "{story.moderationNote}"
                  </div>
                ) : (
                  <span className="text-[9px] font-extrabold text-[#b65a3a] uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Story Displayed Publicly
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* ── REJECTION REASON MODAL ── */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowRejectModal(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#ede3d1] border border-[#d5b990] p-6 sm:p-8 rounded-3xl max-w-sm w-full shadow-2xl text-left space-y-4 z-50 font-body"
            >
              <h3 className="font-display text-xl font-bold text-[#4b2f23] flex items-center gap-2">
                <XCircle className="w-5.5 h-5.5 text-red-600" />
                Reject Story Contribution
              </h3>
              
              <form onSubmit={handleRejectSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase tracking-wider font-extrabold text-[#4b2f23]/50 block">Reason for Rejection</label>
                  <textarea
                    placeholder="Provide a detailed feedback note for the contributor (e.g. offensive terms, spam, historically inaccurate details)..."
                    value={rejectNote}
                    onChange={(e) => setRejectNote(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-3 text-xs border border-[#d5b990] bg-[#f5f0e6] rounded-xl outline-none resize-none font-semibold text-[#4b2f23]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowRejectModal(null)}
                    className="flex-1 py-2.5 rounded-xl border border-[#d5b990] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23]/80 hover:bg-[#f5f0e6] transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow"
                  >
                    Reject Entry
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};
