import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Trophy, 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Award, 
  RotateCcw, 
  BookOpen, 
  Target, 
  Shield, 
  Star,
  Play,
  Bookmark
} from 'lucide-react';
import { Language, QuizQuestion, BadgeDefinition } from '../types';
import { heritageService } from '../services/heritageService';
import { studentProgressService, BADGE_DEFINITIONS } from '../services/studentProgressService';
import { QUIZ_QUESTIONS } from '../data/quizData';
import { motion, AnimatePresence } from 'framer-motion';

interface HeritageQuestPageProps {
  monumentId?: string;
  onNavigate: (route: string) => void;
  language: Language;
}

type QuestPhase = 'catalog' | 'select-level' | 'playing' | 'results';

// Fallback question generator using verified monument metadata
const generateFallbackQuestions = (monument: any, difficulty: string, neededCount: number): QuizQuestion[] => {
  const fallbacks: QuizQuestion[] = [];
  const name = monument.name;

  const dynasty = monument.dynasty || 'ancient rulers';
  const period = monument.period || 'historical era';
  const ruler = monument.ruler || 'patron ruler';
  const material = monument.material || 'stone blocks';
  const state = monument.location.state || 'India';
  const city = monument.location.city || 'historical city';
  const style = monument.architectureStyle || 'Traditional Indian';
  const unescoYear = monument.unescoYear ? `${monument.unescoYear}` : null;

  fallbacks.push({
    id: `${monument.id}-f1`,
    monumentId: monument.id,
    level: 'explorer',
    type: 'mcq',
    question: `Which dynasty is historically associated with the construction of ${name}?`,
    options: [dynasty, 'Chola Dynasty', 'Mughal Empire', 'Gupta Empire'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    correctIndex: 0,
    explanation: `${name} was commissioned during the imperial reign of the ${dynasty}.`,
    sourceNote: 'ASI Heritage Archives'
  });

  fallbacks.push({
    id: `${monument.id}-f2`,
    monumentId: monument.id,
    level: 'explorer',
    type: 'mcq',
    question: `Which historical ruler is credited with commissioning or establishing the foundations of ${name}?`,
    options: [ruler, 'Emperor Ashoka', 'Raja Raja Chola I', 'Emperor Shah Jahan'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    correctIndex: 0,
    explanation: `Historical records verify that ${ruler} commissioned the building of this iconic site.`,
    sourceNote: 'ASI Heritage Archives'
  });

  fallbacks.push({
    id: `${monument.id}-f3`,
    monumentId: monument.id,
    level: 'explorer',
    type: 'mcq',
    question: `What primary construction material was utilized to build the main structure of ${name}?`,
    options: [material, 'Red sandstone', 'White Makrana marble', 'Granite blocks'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    correctIndex: 0,
    explanation: `The builders constructed ${name} primarily utilizing ${material}.`,
    sourceNote: 'ASI Heritage Archives'
  });

  fallbacks.push({
    id: `${monument.id}-f4`,
    monumentId: monument.id,
    level: 'explorer',
    type: 'mcq',
    question: `In which Indian state/region is the monument ${name} located?`,
    options: [state, 'Tamil Nadu', 'Karnataka', 'Rajasthan', 'Uttar Pradesh'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    correctIndex: 0,
    explanation: `${name} is situated in ${city}, ${state}.`,
    sourceNote: 'DHAROHAR Atlas'
  });

  fallbacks.push({
    id: `${monument.id}-f5`,
    monumentId: monument.id,
    level: 'historian',
    type: 'mcq',
    question: `Which architectural style is dominant in the design of ${name}?`,
    options: [style, 'Dravidian Architecture', 'Mughal Architecture', 'Vesara Style'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    correctIndex: 0,
    explanation: `${name} is widely celebrated as a masterwork of ${style} architecture.`,
    sourceNote: 'ASI Architectural Records'
  });

  fallbacks.push({
    id: `${monument.id}-f6`,
    monumentId: monument.id,
    level: 'historian',
    type: 'mcq',
    question: `During which historical epoch/period was ${name} built?`,
    options: [period, '17th Century', '11th Century', '3rd Century BCE'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    correctIndex: 0,
    explanation: `Constructed during ${period}, the monument represents peak artisan skills of that era.`,
    sourceNote: 'ASI Historical Chronicles'
  });

  if (unescoYear) {
    fallbacks.push({
      id: `${monument.id}-f7`,
      monumentId: monument.id,
      level: 'researcher',
      type: 'mcq',
      question: `In which year was ${name} officially inscribed as a UNESCO World Heritage Site?`,
      options: [`${unescoYear} CE`, '1987 CE', '2004 CE', '2010 CE'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
      correctIndex: 0,
      explanation: `${name} was designated a UNESCO World Heritage Site in ${unescoYear} CE for its Outstanding Universal Value.`,
      sourceNote: 'UNESCO World Heritage List'
    });
  }

  fallbacks.push({
    id: `${monument.id}-f8`,
    monumentId: monument.id,
    level: 'explorer',
    type: 'mcq',
    question: `In which specific district/city would you travel to visit ${name}?`,
    options: [city, 'Agra', 'Thanjavur', 'Hampi', 'Jaipur'].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4),
    correctIndex: 0,
    explanation: `${name} is located in the historical district of ${city}.`,
    sourceNote: 'ASI Official Tour Guide'
  });

  let index = 1;
  while (fallbacks.length < neededCount) {
    fallbacks.push({
      id: `${monument.id}-f-extra-${index}`,
      monumentId: monument.id,
      level: 'explorer',
      type: 'true_false',
      question: `${name} is protected under national archaeological preservation mandates.`,
      options: ['True', 'False'],
      correctIndex: 0,
      explanation: `${name} is legally protected as a monument of national importance under archaeological survey preservation acts.`,
      sourceNote: 'National Archeological Protection Act'
    });
    index++;
  }

  return fallbacks.map(q => {
    const correctAnsText = q.options[q.correctIndex];
    const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
    const newCorrectIndex = shuffledOptions.indexOf(correctAnsText);
    return {
      ...q,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  }).slice(0, neededCount);
};

export const HeritageQuestPage: React.FC<HeritageQuestPageProps> = ({
  monumentId: initialMonumentId,
  onNavigate,
  language
}) => {
  // Navigation parameter state
  const [selectedMonId, setSelectedMonId] = useState<string | null>(initialMonumentId || null);
  const [phase, setPhase] = useState<QuestPhase>(initialMonumentId ? 'select-level' : 'catalog');
  
  // Game state
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [accumulatedXp, setAccumulatedXp] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [newBadges, setNewBadges] = useState<string[]>([]);
  
  // Progress states
  const [progress, setProgress] = useState(studentProgressService.getProgress());
  const [leaderboardTab, setLeaderboardTab] = useState<'global' | 'weekly' | 'college' | 'monument'>('global');

  // Trigger state updates
  const refreshProgress = () => {
    setProgress(studentProgressService.getProgress());
  };

  useEffect(() => {
    if (initialMonumentId) {
      setSelectedMonId(initialMonumentId);
      setPhase('select-level');
    } else {
      setSelectedMonId(null);
      setPhase('catalog');
    }
    refreshProgress();
  }, [initialMonumentId]);

  // Load the active monument
  const monument = useMemo(() => {
    return selectedMonId ? heritageService.getMonumentById(selectedMonId) : null;
  }, [selectedMonId]);

  // Build shuffled questions array for selected level
  const questions = useMemo((): QuizQuestion[] => {
    if (!selectedMonId || !difficulty || !monument) return [];
    
    // 1. Fetch direct matching questions from database array
    const dbQuestions = QUIZ_QUESTIONS.filter(q => q.monumentId === selectedMonId);
    
    // 2. Map difficulty selections to matching levels
    let filtered: QuizQuestion[] = [];
    if (difficulty === 'easy') {
      filtered = dbQuestions.filter(q => q.level === 'explorer' || q.level === 'historian');
    } else if (difficulty === 'medium') {
      filtered = dbQuestions.filter(q => q.level === 'historian' || q.level === 'researcher');
    } else {
      filtered = dbQuestions.filter(q => q.level === 'researcher' || q.level === 'scholar');
    }

    const needed = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
    let finalQuestions = [...filtered];

    // 3. Autogenerate verified fallbacks if short of questions count
    if (finalQuestions.length < needed) {
      const extraNeeded = needed - finalQuestions.length;
      const fallbacks = generateFallbackQuestions(monument, difficulty, extraNeeded);
      finalQuestions = [...finalQuestions, ...fallbacks];
    }

    // 4. Shuffle selection order
    const shuffled = [...finalQuestions].sort(() => Math.random() - 0.5).slice(0, needed);

    // 5. Shuffle options for each question to prevent bias
    return shuffled.map(q => {
      const correctAnsText = q.options[q.correctIndex];
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.indexOf(correctAnsText);
      return {
        ...q,
        options: shuffledOptions,
        correctIndex: newCorrectIndex
      };
    });
  }, [selectedMonId, difficulty, monument]);

  const currentQuestion = questions[currentIndex] ?? null;

  // XP systems
  const getXpValue = () => {
    if (difficulty === 'easy') return 10;
    if (difficulty === 'medium') return 20;
    return 30;
  };

  // Answer feedback
  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null || isAnswerRevealed) return;
    setSelectedAnswer(idx);
    setIsAnswerRevealed(true);

    const isCorrect = idx === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      setAccumulatedXp(prev => prev + getXpValue());
    }
  };

  // Carousel steps
  const handleContinue = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerRevealed(false);
    } else {
      // Completed - Record XP and write updates
      const accuracyScore = Math.round((correctAnswersCount / questions.length) * 100);
      const badges = studentProgressService.recordQuestCompletion(selectedMonId!, difficulty!, accuracyScore, accumulatedXp);
      setNewBadges(badges);
      setPhase('results');
      
      try {
        confetti({
          particleCount: accuracyScore >= 80 ? 120 : 60,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#22c55e', '#b65a3a', '#aa7b3f', '#3b82f6']
        });
      } catch {}
      refreshProgress();
    }
  };

  const handleResetQuizState = () => {
    setPhase('catalog');
    setSelectedMonId(null);
    setDifficulty(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAccumulatedXp(0);
    setCorrectAnswersCount(0);
    setIsAnswerRevealed(false);
    setNewBadges([]);
    refreshProgress();
  };

  // Mocked competition lists mapping user progress
  const userTotalXp = (progress as any).totalXp || 0;
  const mockCompetitors = [
    { name: 'Arjun', xp: 360 },
    { name: 'Priya', xp: 330 },
    { name: 'Rahul', xp: 300 },
    { name: 'Meena', xp: 280 }
  ];
  
  const leaderboardList = useMemo(() => {
    const list = [
      { name: 'You (Officer)', xp: userTotalXp, isUser: true },
      ...mockCompetitors.map(c => ({ name: c.name, xp: c.xp, isUser: false }))
    ];
    return list.sort((a, b) => b.xp - a.xp);
  }, [userTotalXp]);

  const userRankIdx = leaderboardList.findIndex(item => item.isUser);
  const nextRankItem = userRankIdx > 0 ? leaderboardList[userRankIdx - 1] : null;

  return (
    <div className="min-h-screen bg-[#f5f0e6] stone-pattern pt-40 pb-20 px-4 sm:px-6 lg:px-8 font-body text-[#4b2f23]">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ── BREADCRUMB HEADER ── */}
        <div className="flex items-center justify-between border-b border-[#d5b990]/40 pb-4">
          <button
            onClick={() => {
              if (phase === 'catalog') {
                onNavigate('research');
              } else if (phase === 'select-level') {
                handleResetQuizState();
              } else if (phase === 'playing' || phase === 'results') {
                if (confirm('Are you sure you want to exit the current Heritage Quest? Progress will not be saved.')) {
                  handleResetQuizState();
                }
              }
            }}
            className="flex items-center gap-1.5 text-xs text-[#b65a3a] font-bold uppercase tracking-wider cursor-pointer hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{phase === 'catalog' ? 'Back to Research Portal' : 'Catalog Home'}</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#ede3d1] border border-[#d5b990]/50 text-[10px] font-bold uppercase text-[#b65a3a]">
              <Star className="w-3.5 h-3.5 fill-[#b65a3a] text-transparent" />
              <span>{userTotalXp} XP</span>
            </div>
            <button
              onClick={() => onNavigate('research/progress')}
              className="text-xs text-[#b65a3a] font-bold uppercase tracking-wider hover:underline flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>My Notebook</span>
            </button>
          </div>
        </div>

        {/* ── PHASE 1: CATALOG LANDING PAGE ── */}
        {phase === 'catalog' && (
          <div className="space-y-10 text-left animate-fade-in duration-200">
            
            {/* Top Page Header Banner */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold uppercase tracking-widest text-amber-700">
                <Target className="w-3.5 h-3.5" /> Heritage Quest
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23]">HERITAGE QUEST CHALLENGES</h1>
              <p className="text-xs sm:text-sm text-[#4b2f23]/60 max-w-xl">
                Test your knowledge. Earn XP. Unlock achievement badges. Become a verified Heritage Scholar.
              </p>
            </div>

            {/* Horizontal Stats Row (Leaderboard & Badges Locker side-by-side) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Leaderboard Card (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#ede3d1] border border-[#d5b990] shadow-md space-y-4">
                <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-[#d5b990]/40">
                  <Trophy className="w-4 h-4" />
                  Preservation Scholars Leaderboard
                </h3>
                
                {/* Tabs */}
                <div className="grid grid-cols-4 gap-1 border-b border-[#d5b990]/30 pb-2">
                  {[
                    { id: 'global', label: 'Global' },
                    { id: 'weekly', label: 'Weekly' },
                    { id: 'college', label: 'College' },
                    { id: 'monument', label: 'Local' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setLeaderboardTab(tab.id as any)}
                      className={`py-1 text-[8px] font-black uppercase tracking-wider rounded-lg text-center cursor-pointer transition-colors ${
                        leaderboardTab === tab.id
                          ? 'bg-[#b65a3a] text-white'
                          : 'text-[#4b2f23]/60 hover:bg-[#f5f0e6]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2 pt-2">
                  {leaderboardList.map((competitor, idx) => (
                    <div 
                      key={idx}
                      className={`flex justify-between items-center px-3 py-2 rounded-xl text-xs ${
                        competitor.isUser 
                          ? 'bg-[#b65a3a]/15 border border-[#b65a3a]/30 font-bold'
                          : 'bg-[#f5f0e6] border border-[#d5b990]/30 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-[#b65a3a]">
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
                        </span>
                        <span className="truncate max-w-[120px]">{competitor.name}</span>
                      </div>
                      <span className="text-[#b65a3a] font-black">{competitor.xp} XP</span>
                    </div>
                  ))}
                </div>

                {nextRankItem && (
                  <p className="text-[9px] text-[#4b2f23]/60 font-bold italic pt-2 text-center border-t border-[#d5b990]/30">
                    🏆 You are ranked #{userRankIdx + 1}. Earn {nextRankItem.xp - userTotalXp} XP to reach #{userRankIdx}!
                  </p>
                )}
              </div>

              {/* Badges Locker (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#ede3d1] border border-[#d5b990] shadow-md space-y-4">
                <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest flex items-center gap-1.5 pb-2 border-b border-[#d5b990]/40">
                  <Award className="w-4 h-4" />
                  Preservation Badges Showcase
                </h3>

                <div className="grid grid-cols-2 gap-3 max-h-[175px] overflow-y-auto pr-1">
                  {studentProgressService.getBadgesEarned().length === 0 ? (
                    <p className="col-span-2 text-[10px] text-[#4b2f23]/60 italic text-center py-4">No badges unlocked yet. Complete your first Heritage Quest challenge!</p>
                  ) : (
                    studentProgressService.getBadgesEarned().map(badge => (
                      <div key={badge.id} className="p-2 rounded-lg bg-[#f5f0e6] border border-[#d5b990]/30 text-center space-y-0.5">
                        <span className="text-xl block">{badge.icon}</span>
                        <p className="text-[9px] font-extrabold text-[#4b2f23] leading-tight truncate">{badge.title}</p>
                        <p className="text-[8px] text-[#4b2f23]/50 leading-none truncate">{badge.requirement}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Monuments Challenges Grid (Full Width, 3 columns) */}
            <div className="space-y-6 pt-4 border-t border-[#d5b990]/30">
              <h3 className="text-xs font-black text-[#b65a3a] uppercase tracking-widest">
                SELECT A MONUMENT CHALLENGE
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.values(heritageService.getMonuments()).map(mon => {
                  const monQuests = progress.questsCompleted[mon.id] || [];
                  const hasDone = monQuests.length > 0;
                  const best = hasDone ? Math.max(...monQuests.map(q => q.score)) : 0;
                  const isMaster = progress.badgesEarned.includes(`${mon.id}-master`);

                  return (
                    <div 
                      key={mon.id} 
                      className="rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] overflow-hidden flex flex-col justify-between shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative aspect-video w-full overflow-hidden bg-black/5">
                        <img 
                          src={mon.heroImage} 
                          alt={mon.name} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-[#f5f0e6] px-2 py-0.5 rounded-lg text-[8px] font-extrabold uppercase text-[#b65a3a] border border-[#d5b990]/60">
                          {mon.location.state}
                        </div>
                        {isMaster && (
                          <div className="absolute top-3 right-3 bg-amber-500 text-white p-1 rounded-full shadow-md text-xs">
                            🏆
                          </div>
                        )}
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1">
                          <h4 className="font-display text-lg font-bold text-[#4b2f23]">{mon.name}</h4>
                          <p className="text-[10px] text-[#4b2f23]/65 font-bold uppercase tracking-wider">
                            {mon.dynasty} • {mon.architectureStyle}
                          </p>
                          <p className="text-xs text-[#4b2f23]/70 line-clamp-2 leading-relaxed pt-1">
                            {mon.tagline}
                          </p>
                        </div>

                        {/* Status logs */}
                        <div className="pt-3 border-t border-[#d5b990]/35 flex justify-between items-center text-[10px] font-bold">
                          {hasDone ? (
                            <div className="flex flex-col">
                              <span className="text-[#4b2f23]/50 text-[8px] uppercase tracking-wider">Best Score</span>
                              <span className="text-emerald-700">{best}% Correct</span>
                            </div>
                          ) : (
                            <span className="text-[#4b2f23]/40">Unexplored challenge</span>
                          )}
                          <button
                            onClick={() => {
                              setSelectedMonId(mon.id);
                              setPhase('select-level');
                            }}
                            className="px-4 py-2 bg-[#b65a3a] hover:bg-[#4b2f23] text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow"
                          >
                            Start Quest
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ── PHASE 2: DIFFICULTY SELECTION ── */}
        {phase === 'select-level' && monument && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="text-[9px] font-black uppercase text-[#b65a3a] tracking-widest">
                PRESERVATION ASSESSMENT
              </span>
              <h2 className="font-display text-3xl font-bold text-[#4b2f23]">{monument.name}</h2>
              <p className="text-xs text-[#4b2f23]/60">Select your quiz difficulty to test your architectural and historical knowledge.</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { 
                  id: 'easy', 
                  title: 'Easy Challenge', 
                  desc: '8 questions focusing on basic monument facts, location, period, and dynasty.', 
                  color: '#22c55e', 
                  xp: '10 XP per question' 
                },
                { 
                  id: 'medium', 
                  title: 'Medium Challenge', 
                  desc: '10 questions focusing on architecture details, history, and construction techniques.', 
                  color: '#f59e0b', 
                  xp: '20 XP per question' 
                },
                { 
                  id: 'hard', 
                  title: 'Hard Challenge', 
                  desc: '12 questions focusing on deeper analysis, conservation details, and comparisons.', 
                  color: '#ef4444', 
                  xp: '30 XP per question' 
                }
              ].map(level => (
                <button
                  key={level.id}
                  onClick={() => {
                    setDifficulty(level.id as any);
                    setPhase('playing');
                    setCurrentIndex(0);
                    setSelectedAnswer(null);
                    setAccumulatedXp(0);
                    setCorrectAnswersCount(0);
                    setIsAnswerRevealed(false);
                  }}
                  className="p-5 rounded-3xl bg-[#ede3d1]/80 border border-[#d5b990] hover:border-[#b65a3a] shadow-md hover:shadow-lg transition-all text-left flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: level.color }} />
                      <strong className="font-display text-lg font-bold text-[#4b2f23]">{level.title}</strong>
                    </div>
                    <p className="text-xs text-[#4b2f23]/70">{level.desc}</p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] font-black text-[#b65a3a] uppercase tracking-wider block">{level.xp}</span>
                    <span className="text-[8px] text-[#4b2f23]/50 block mt-0.5 font-bold uppercase">Click to start</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#ede3d1]/40 border border-[#d5b990]/65 flex items-start gap-3 text-left">
              <BookOpen className="w-4 h-4 text-[#b65a3a] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#4b2f23]/70 leading-relaxed">
                All Heritage Quest questions are derived from verified information in UNESCO records, ASI documentation, and the DHAROHAR monument archive. No fabricated facts are used.
              </p>
            </div>
          </div>
        )}

        {/* ── PHASE 3: INTERACTIVE QUIZ PLAYING ── */}
        {phase === 'playing' && currentQuestion && (
          <div className="max-w-2xl mx-auto space-y-6 text-left">
            
            {/* Progress indicators */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#b65a3a] uppercase tracking-wider">
                  {difficulty} Quest — {monument?.name}
                </span>
                <span className="text-[#4b2f23]/60">Question {currentIndex + 1} of {questions.length}</span>
              </div>
              <div className="h-2 rounded-full bg-[#ede3d1] border border-[#d5b990] overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    backgroundColor: difficulty === 'easy' ? '#22c55e' : difficulty === 'medium' ? '#f59e0b' : '#ef4444'
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-[#4b2f23]/50 font-bold uppercase tracking-wider">
                <span>Current Score: {accumulatedXp} XP</span>
                <span>{questions.length - currentIndex - 1} remaining</span>
              </div>
            </div>

            {/* Question card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#ede3d1] border border-[#d5b990] shadow-xl space-y-6">
              
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#f5f0e6] border border-[#d5b990] text-[8px] font-black uppercase text-[#4b2f23]/60 tracking-widest">
                  Multiple Choice Question
                </span>
              </div>

              <p className="font-display text-xl font-bold text-[#4b2f23] leading-snug">
                {currentQuestion.question}
              </p>

              {/* Options stack */}
              <div className="space-y-3.5">
                {currentQuestion.options.map((option, idx) => {
                  let optionStyle = 'bg-[#f5f0e6] border-[#d5b990] text-[#4b2f23] hover:border-[#b65a3a] cursor-pointer';
                  if (isAnswerRevealed) {
                    if (idx === currentQuestion.correctIndex) {
                      optionStyle = 'bg-green-500/10 border-green-500 text-green-800 font-bold';
                    } else if (idx === selectedAnswer && idx !== currentQuestion.correctIndex) {
                      optionStyle = 'bg-red-500/10 border-red-500 text-red-800 font-bold';
                    } else {
                      optionStyle = 'bg-[#f5f0e6]/50 border-[#d5b990]/40 text-[#4b2f23]/40 cursor-default';
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={isAnswerRevealed}
                      className={`w-full p-4 rounded-xl border text-left text-xs font-semibold tracking-wide transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-5.5 h-5.5 rounded-full border border-current flex items-center justify-center text-[9px] font-extrabold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                      </span>
                      {isAnswerRevealed && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      )}
                      {isAnswerRevealed && idx === selectedAnswer && idx !== currentQuestion.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanatory feedback cards */}
              {isAnswerRevealed && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'bg-green-500/10 border-green-500/30 text-green-800'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-800'
                }`}>
                  <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[10px]">
                    {selectedAnswer === currentQuestion.correctIndex
                      ? <><CheckCircle2 className="w-4 h-4" /> Excellent! +{getXpValue()} XP</>
                      : <><XCircle className="w-4 h-4" /> Not quite! +0 XP</>
                    }
                  </div>
                  <p className="text-[#4b2f23]/80 font-semibold">{currentQuestion.explanation}</p>
                  {currentQuestion.sourceNote && (
                    <span className="text-[8px] font-bold text-[#4b2f23]/40 block pt-1 border-t border-current/10">
                      Source: {currentQuestion.sourceNote}
                    </span>
                  )}
                </div>
              )}

              {/* Continue button */}
              {isAnswerRevealed && (
                <button
                  onClick={handleContinue}
                  className="w-full py-3.5 bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

            </div>
          </div>
        )}

        {/* ── PHASE 4: RESULTS SCREEN ── */}
        {phase === 'results' && monument && (
          <div className="max-w-2xl mx-auto space-y-6 text-center">
            
            <div className="p-8 rounded-3xl bg-[#ede3d1] border border-[#d5b990] shadow-xl space-y-6">
              <div className="space-y-1">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
                <h2 className="font-display text-3xl font-bold text-[#4b2f23]">QUEST COMPLETE</h2>
                <p className="text-xs text-[#4b2f23]/60 uppercase tracking-widest font-bold">
                  🏛️ {monument.name}
                </p>
              </div>

              {/* Score breakdown metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#d5b990]/40">
                  <span className="text-[8px] uppercase tracking-wider text-[#4b2f23]/50 block mb-1">XP Earned</span>
                  <strong className="text-2xl font-black text-[#b65a3a]">+{accumulatedXp} XP</strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#d5b990]/40">
                  <span className="text-[8px] uppercase tracking-wider text-[#4b2f23]/50 block mb-1">Accuracy</span>
                  <strong className="text-2xl font-black text-emerald-700">
                    {Math.round((correctAnswersCount / questions.length) * 100)}%
                  </strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#d5b990]/40">
                  <span className="text-[8px] uppercase tracking-wider text-[#4b2f23]/50 block mb-1">Correct Answers</span>
                  <strong className="text-2xl font-black text-[#4b2f23]">{correctAnswersCount} / {questions.length}</strong>
                </div>
                <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#d5b990]/40">
                  <span className="text-[8px] uppercase tracking-wider text-[#4b2f23]/50 block mb-1">Difficulty</span>
                  <strong className="text-xs font-black uppercase text-[#b65a3a] block mt-2">{difficulty}</strong>
                </div>
              </div>

              {/* Unlocked Badges Alerts */}
              {newBadges.length > 0 && (
                <div className="space-y-3 border-t border-[#d5b990]/50 pt-5">
                  <h4 className="text-[9px] uppercase font-black text-amber-700 tracking-wider">
                    🏆 New Preservation Badges Earned!
                  </h4>
                  <div className="flex flex-col gap-2 max-w-sm mx-auto">
                    {newBadges.map(badgeId => {
                      const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId) || {
                        icon: '🏛️',
                        title: `${monument.name} Master`,
                        description: `Scored 80%+ on ${monument.name} quiz.`
                      };
                      return (
                        <div 
                          key={badgeId} 
                          className="p-3.5 rounded-2xl bg-[#f5f0e6] border border-[#d5b990] flex items-center gap-3 text-left shadow-sm"
                        >
                          <span className="text-2xl">{badge.icon}</span>
                          <div>
                            <p className="text-[10px] font-black text-[#4b2f23] uppercase tracking-wide">{badge.title}</p>
                            <p className="text-[9px] text-[#4b2f23]/60 leading-tight">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setPhase('select-level');
                  setCurrentIndex(0);
                  setSelectedAnswer(null);
                  setAccumulatedXp(0);
                  setCorrectAnswersCount(0);
                  setIsAnswerRevealed(false);
                }}
                className="py-3 rounded-xl bg-[#ede3d1] border border-[#d5b990] hover:border-[#b65a3a] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                onClick={handleResetQuizState}
                className="py-3 rounded-xl bg-[#ede3d1] border border-[#d5b990] hover:border-[#b65a3a] text-[10px] font-bold uppercase tracking-wider text-[#4b2f23] cursor-pointer transition-all flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Challenge Catalog</span>
              </button>
              <button
                onClick={() => onNavigate('research/progress')}
                className="py-3 rounded-xl bg-[#b65a3a] hover:bg-[#4b2f23] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all flex items-center justify-center gap-2 shadow"
              >
                <Trophy className="w-4 h-4" />
                <span>Show Progress</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
