import React, { useMemo } from 'react';
import { ArrowLeft, Trophy, BookOpen, FileText, ExternalLink, Star, Award, Target } from 'lucide-react';
import { Language } from '../types';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { studentProgressService, BADGE_DEFINITIONS } from '../services/studentProgressService';
import { QUIZ_LEVEL_CONFIG } from '../data/quizData';

interface StudentProgressPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const StudentProgressPage: React.FC<StudentProgressPageProps> = ({ onNavigate, language }) => {
  const store = useStore();
  const progress = useMemo(() => studentProgressService.getProgress(), []);
  const level = useMemo(() => studentProgressService.getStudentLevel(), []);
  const averageScore = useMemo(() => studentProgressService.getAverageScore(), []);
  const totalQuests = useMemo(() => studentProgressService.getTotalQuestsCompleted(), []);
  const earnedBadges = useMemo(() => studentProgressService.getBadgesEarned(), []);
  const unearnedBadges = useMemo(() =>
    BADGE_DEFINITIONS.filter(b => !progress.badgesEarned.includes(b.id)),
    [progress]
  );

  const recentMonuments = store.recentlyViewedMonuments
    .map(id => heritageService.getMonumentById(id))
    .filter(Boolean);

  const allQuestEntries = (Object.entries(progress.questsCompleted) as [string, { level: import('../types').QuizLevel; score: number; completedAt: number }[]][])
    .flatMap(([monumentId, entries]) =>
      entries.map(e => ({ monumentId, ...e }))
    )
    .sort((a, b) => b.completedAt - a.completedAt)
    .slice(0, 8);

  const statCards = [
    { label: 'Monuments Explored', value: progress.monumentsExplored.length, icon: '🏛️', color: 'text-amber-600' },
    { label: 'Research Notes', value: progress.notesCreated, icon: '📝', color: 'text-blue-600' },
    { label: 'Sources Viewed', value: progress.sourcesViewed.length, icon: '📜', color: 'text-purple-600' },
    { label: 'Quests Completed', value: totalQuests, icon: '🎯', color: 'text-green-600' },
    { label: 'Average Quest Score', value: totalQuests > 0 ? `${averageScore}%` : '—', icon: '⭐', color: 'text-rose-600' },
    { label: 'Badges Earned', value: earnedBadges.length, icon: '🎖️', color: 'text-indigo-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Breadcrumb */}
        <button
          onClick={() => onNavigate('research')}
          className="flex items-center gap-1.5 text-xs text-[#b65a3a] font-medium cursor-pointer hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Research Portal
        </button>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold uppercase tracking-widest text-amber-700">
            <Trophy className="w-3.5 h-3.5" /> My Heritage Progress
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#4b2f23]">Research Journey</h1>
          <p className="text-sm text-[#4b2f23]/60 max-w-xl">Track your progress across monuments, quests, notes, and research sources.</p>
        </div>

        {/* Current Level Card */}
        <div className="p-6 rounded-3xl bg-[#ede3d1] border-2 border-[#aa7b3f]/40 shadow-xl flex flex-col sm:flex-row items-center gap-5">
          <div className="text-5xl">{
            level.title === 'Heritage Scholar' ? '🎓'
            : level.title === 'Heritage Researcher' ? '🔬'
            : level.title === 'Heritage Historian' ? '📜'
            : level.title === 'Heritage Seeker' ? '🗺️'
            : '🏛️'
          }</div>
          <div className="text-center sm:text-left">
            <p className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-widest">Current Level</p>
            <h2 className="font-display text-2xl font-bold text-[#4b2f23]">{level.title}</h2>
            <p className="text-sm text-[#4b2f23]/80 font-medium">{level.description}</p>
          </div>
          <div className="sm:ml-auto text-center sm:text-right">
            <p className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-widest">Next Level</p>
            <p className="text-xs text-[#4b2f23]/70 font-semibold">Explore more monuments & complete quests</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} className="p-5 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 shadow-lg text-center space-y-1">
              <div className="text-2xl">{icon}</div>
              <div className={`font-display text-3xl font-black ${color}`}>{value}</div>
              <p className="text-[10px] uppercase font-bold text-[#4b2f23]/60 tracking-wider">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent Quests */}
        {allQuestEntries.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-[#4b2f23] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#b65a3a]" /> Recent Quests
            </h2>
            <div className="space-y-3">
              {allQuestEntries.map((entry, i) => {
                const mon = heritageService.getMonumentById(entry.monumentId);
                const config = QUIZ_LEVEL_CONFIG[entry.level];
                return (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/20 hover:border-[#aa7b3f]/50 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                      <div>
                        <p className="text-xs font-bold text-[#4b2f23]">{mon?.name || entry.monumentId}</p>
                        <p className="text-[10px] text-[#4b2f23]/50">{config.label} · {new Date(entry.completedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-lg font-black ${entry.score >= 80 ? 'text-green-600' : entry.score >= 60 ? 'text-amber-500' : 'text-red-500'}`}>
                        {entry.score}%
                      </span>
                      <button
                        onClick={() => onNavigate(`research/quest/${entry.monumentId}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#f5f0e6] border border-[#aa7b3f]/20 text-[10px] font-bold text-[#b65a3a] cursor-pointer hover:border-[#aa7b3f] transition-colors uppercase tracking-wider"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Monuments Explored */}
        {progress.monumentsExplored.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display text-xl font-bold text-[#4b2f23] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#b65a3a]" /> Monuments Explored
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {progress.monumentsExplored.map(monumentId => {
                const mon = heritageService.getMonumentById(monumentId);
                if (!mon) return null;
                const questsDone = (progress.questsCompleted[monumentId] || []).length;
                return (
                  <div
                    key={monumentId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#ede3d1] border border-[#aa7b3f]/20 hover:border-[#aa7b3f]/50 transition-all cursor-pointer"
                    onClick={() => onNavigate(`research/monument/${monumentId}`)}
                  >
                    <img src={mon.heroImage} alt={mon.name} className="w-12 h-12 rounded-xl object-cover border border-[#aa7b3f]/15 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[#4b2f23] truncate">{mon.name}</p>
                      <p className="text-[10px] text-[#4b2f23]/50">{mon.location.city} · {mon.dynasty}</p>
                      {questsDone > 0 && (
                        <span className="text-[9px] text-green-700 font-bold">✓ {questsDone} quest{questsDone > 1 ? 's' : ''} completed</span>
                      )}
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#b65a3a]/50 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Research Notebook Snapshot */}
        {store.savedResearchItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#4b2f23] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#b65a3a]" /> Research Notebook
              </h2>
              <span className="text-xs text-[#4b2f23]/60">{store.savedResearchItems.length} saved items</span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {store.savedResearchItems.slice(0, 6).map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#b65a3a]">{item.monumentName}</span>
                    {item.sectionName && (
                      <span className="text-[9px] uppercase font-bold text-[#4b2f23]/40">{item.sectionName}</span>
                    )}
                  </div>
                  {item.note && (
                    <p className="text-[#4b2f23]/70 italic">"{item.note}"</p>
                  )}
                  <p className="text-[9px] text-[#4b2f23]/40">{new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="space-y-5">
          <h2 className="font-display text-xl font-bold text-[#4b2f23] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#b65a3a]" /> Heritage Badges
          </h2>

          {earnedBadges.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider">Earned</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-lg">
                    <span className="text-3xl">{badge.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-amber-800">{badge.title}</p>
                      <p className="text-[10px] text-amber-700/70">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unearnedBadges.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[10px] uppercase font-bold text-[#4b2f23]/40 tracking-wider">Yet to Earn</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {unearnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-3 p-4 rounded-2xl bg-[#ede3d1]/50 border border-[#aa7b3f]/15 opacity-60">
                    <span className="text-3xl grayscale">{badge.icon}</span>
                    <div>
                      <p className="font-bold text-sm text-[#4b2f23]">{badge.title}</p>
                      <p className="text-[10px] text-[#4b2f23]/50">{badge.requirement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {earnedBadges.length === 0 && (
            <div className="text-center py-8 space-y-3">
              <Star className="w-10 h-10 text-[#b65a3a]/20 mx-auto" />
              <p className="text-sm text-[#4b2f23]/60">Start exploring monuments and completing quests to earn your first badge!</p>
              <button
                onClick={() => onNavigate('research')}
                className="px-5 py-2.5 rounded-xl bg-[#b65a3a] text-white text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#9e4a2e] transition-colors"
              >
                Start Researching
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
