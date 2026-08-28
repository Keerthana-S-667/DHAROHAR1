import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, Trophy, CheckCircle2, XCircle, ChevronRight, Award, RotateCcw, BookOpen } from 'lucide-react';
import { Language, QuizLevel } from '../types';
import { heritageService } from '../services/heritageService';
import { studentProgressService, BADGE_DEFINITIONS } from '../services/studentProgressService';
import { getQuizByMonumentAndLevel, hasQuizData, QUIZ_LEVEL_CONFIG, QUIZ_QUESTIONS } from '../data/quizData';
import type { QuizQuestion } from '../types';

interface HeritageQuestPageProps {
  monumentId?: string;
  onNavigate: (route: string) => void;
  language: Language;
}

type QuestPhase = 'select-level' | 'playing' | 'results';

const LEVELS: QuizLevel[] = ['explorer', 'historian', 'researcher', 'scholar'];

export const HeritageQuestPage: React.FC<HeritageQuestPageProps> = ({
  monumentId,
  onNavigate,
  language
}) => {
  const monument = monumentId ? heritageService.getMonumentById(monumentId) : null;

  const [selectedLevel, setSelectedLevel] = useState<QuizLevel | null>(null);
  const [phase, setPhase] = useState<QuestPhase>('select-level');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selected: number; correct: boolean }[]>([]);
  const [newBadges, setNewBadges] = useState<string[]>([]);

  const questions = useMemo((): QuizQuestion[] => {
    if (!selectedLevel || !monumentId) return [];
    return getQuizByMonumentAndLevel(monumentId, selectedLevel);
  }, [selectedLevel, monumentId]);

  const currentQuestion = questions[currentIndex] ?? null;
  const score = answers.length > 0
    ? Math.round((answers.filter(a => a.correct).length / answers.length) * 100)
    : 0;

  if (!monument) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Trophy className="w-12 h-12 text-[#b65a3a]/30 mx-auto" />
          <h2 className="font-display text-xl font-bold text-[#4b2f23]">Monument not found</h2>
          <button onClick={() => onNavigate('research')} className="text-[#b65a3a] text-sm underline cursor-pointer">
            Back to Research Portal
          </button>
        </div>
      </div>
    );
  }

  if (!hasQuizData(monumentId || '')) {
    return (
      <div className="min-h-screen bg-[#f5f0e6] pt-24 pb-20 flex items-center justify-center px-4">
        <div className="text-center space-y-4 max-w-md">
          <Trophy className="w-12 h-12 text-[#b65a3a]/30 mx-auto" />
          <h2 className="font-display text-2xl font-bold text-[#4b2f23]">Quest Coming Soon</h2>
          <p className="text-sm text-[#4b2f23]/60">Heritage Quest questions for {monument.name} are being carefully verified and will be available soon.</p>
          <button
            onClick={() => onNavigate(`research/monument/${monumentId}`)}
            className="px-5 py-2.5 rounded-xl bg-[#b65a3a] text-white text-sm font-bold cursor-pointer hover:bg-[#9e4a2e] transition-colors"
          >
            Back to Research Dossier
          </button>
        </div>
      </div>
    );
  }

  const handleSelectLevel = (level: QuizLevel) => {
    setSelectedLevel(level);
    setPhase('playing');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
  };

  const handleSelectAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // already answered
    setSelectedAnswer(index);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null || !currentQuestion) return;
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    const newAnswer = { questionId: currentQuestion.id, selected: selectedAnswer, correct: isCorrect };
    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      // Quest complete
      const finalScore = Math.round((updatedAnswers.filter(a => a.correct).length / updatedAnswers.length) * 100);
      const badges = studentProgressService.recordQuestCompletion(monumentId!, selectedLevel!, finalScore);
      setNewBadges(badges);
      setPhase('results');
      try {
        confetti({
          particleCount: finalScore >= 80 ? 120 : 60,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#22c55e', '#b65a3a', '#aa7b3f', '#3b82f6']
        });
      } catch {}
    }
  };

  const handleReset = () => {
    setPhase('select-level');
    setSelectedLevel(null);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setNewBadges([]);
  };

  const levelConfig = selectedLevel ? QUIZ_LEVEL_CONFIG[selectedLevel] : null;

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => phase === 'select-level'
              ? onNavigate(`research/monument/${monumentId}`)
              : handleReset()
            }
            className="flex items-center gap-1.5 text-xs text-[#b65a3a] font-medium cursor-pointer hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {phase === 'select-level' ? 'Back to Research Dossier' : 'Choose Different Level'}
          </button>
          <button
            onClick={() => onNavigate('research/progress')}
            className="flex items-center gap-1.5 text-xs text-[#b65a3a] font-medium cursor-pointer hover:underline"
          >
            <Trophy className="w-3.5 h-3.5" /> My Progress
          </button>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] font-bold uppercase tracking-widest text-amber-700">
            <Trophy className="w-3.5 h-3.5" /> Heritage Quest
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23]">{monument.name}</h1>
          <p className="text-xs text-[#4b2f23]/60">{monument.location.city}, {monument.location.state}</p>
        </div>

        {/* ── PHASE: Level Selection ─────────────────────────────────────────────── */}
        {phase === 'select-level' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-[#4b2f23]/70">Choose your challenge level. All questions are based on verified historical facts.</p>
            </div>
            <div className="space-y-4">
              {LEVELS.map(level => {
                const config = QUIZ_LEVEL_CONFIG[level];
                const levelQuestions = getQuizByMonumentAndLevel(monumentId || '', level);
                const isAvailable = levelQuestions.length > 0;
                return (
                  <button
                    key={level}
                    disabled={!isAvailable}
                    onClick={() => isAvailable && handleSelectLevel(level)}
                    className={`w-full p-5 rounded-2xl border text-left transition-all ${
                      isAvailable
                        ? 'bg-[#ede3d1] border-[#aa7b3f]/30 hover:border-[#aa7b3f] hover:shadow-lg cursor-pointer'
                        : 'bg-[#ede3d1]/40 border-[#aa7b3f]/10 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: config.color }}
                          />
                          <span className="font-display text-lg font-bold text-[#4b2f23]">{config.label}</span>
                        </div>
                        <p className="text-xs text-[#4b2f23]/60 ml-5">{config.description}</p>
                      </div>
                      <div className="text-right">
                        {isAvailable ? (
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-[#4b2f23]">{levelQuestions.length} questions</span>
                            <ChevronRight className="w-5 h-5 text-[#b65a3a] ml-auto" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#4b2f23]/40 font-bold uppercase">Coming Soon</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Source integrity notice */}
            <div className="p-4 rounded-2xl bg-[#ede3d1]/60 border border-[#aa7b3f]/20 flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-[#b65a3a] shrink-0 mt-0.5" />
              <p className="text-[10px] text-[#4b2f23]/70 leading-relaxed">
                All Heritage Quest questions are derived from verified information in UNESCO records, ASI documentation, and the DHAROHAR monument archive. No fabricated facts are used.
              </p>
            </div>
          </div>
        )}

        {/* ── PHASE: Playing ──────────────────────────────────────────────────────── */}
        {phase === 'playing' && currentQuestion && (
          <div className="space-y-6">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#b65a3a]" style={{ color: levelConfig?.color }}>
                  {levelConfig?.label}
                </span>
                <span className="text-[#4b2f23]/60">Question {currentIndex + 1} of {questions.length}</span>
              </div>
              <div className="h-2 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/20 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentIndex + 1) / questions.length) * 100}%`,
                    backgroundColor: levelConfig?.color
                  }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-[#4b2f23]/50">
                <span>{answers.filter(a => a.correct).length} correct so far</span>
                <span>{questions.length - currentIndex - 1} remaining</span>
              </div>
            </div>

            {/* Question card */}
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 shadow-xl space-y-6">
              {/* Question type badge */}
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#f5f0e6] border border-[#aa7b3f]/20 text-[9px] font-bold uppercase tracking-wider text-[#4b2f23]/60">
                  {currentQuestion.type === 'mcq' ? 'Multiple Choice'
                    : currentQuestion.type === 'true_false' ? 'True / False'
                    : 'Timeline'}
                </span>
              </div>

              <p className="font-display text-lg sm:text-xl font-bold text-[#4b2f23] leading-snug">
                {currentQuestion.question}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => {
                  let optionStyle = 'bg-[#f5f0e6] border-[#aa7b3f]/20 text-[#4b2f23] hover:border-[#aa7b3f] cursor-pointer';
                  if (selectedAnswer !== null) {
                    if (idx === currentQuestion.correctIndex) {
                      optionStyle = 'bg-green-500/10 border-green-500/50 text-green-800';
                    } else if (idx === selectedAnswer && idx !== currentQuestion.correctIndex) {
                      optionStyle = 'bg-red-500/10 border-red-500/50 text-red-800';
                    } else {
                      optionStyle = 'bg-[#f5f0e6]/50 border-[#aa7b3f]/10 text-[#4b2f23]/50 cursor-default';
                    }
                  }
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {option}
                      </span>
                      {selectedAnswer !== null && idx === currentQuestion.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                      )}
                      {selectedAnswer !== null && idx === selectedAnswer && idx !== currentQuestion.correctIndex && (
                        <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              {selectedAnswer !== null && (
                <div className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-2 ${
                  selectedAnswer === currentQuestion.correctIndex
                    ? 'bg-green-500/8 border-green-500/25 text-green-800'
                    : 'bg-amber-500/8 border-amber-500/25 text-amber-800'
                }`}>
                  <div className="flex items-center gap-2 font-bold">
                    {selectedAnswer === currentQuestion.correctIndex
                      ? <><CheckCircle2 className="w-4 h-4" /> Correct!</>
                      : <><XCircle className="w-4 h-4" /> Not quite — here's the answer</>
                    }
                  </div>
                  <p className="text-[#4b2f23]/80">{currentQuestion.explanation}</p>
                  {currentQuestion.sourceNote && (
                    <p className="text-[9px] text-[#4b2f23]/50 pt-1 border-t border-current/10">
                      Source: {currentQuestion.sourceNote}
                    </p>
                  )}
                </div>
              )}

              {/* Next button */}
              {selectedAnswer !== null && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full py-3 rounded-xl bg-[#b65a3a] text-white font-bold text-sm uppercase tracking-wider hover:bg-[#9e4a2e] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  {currentIndex + 1 < questions.length ? (
                    <><ChevronRight className="w-5 h-5" /> Next Question</>
                  ) : (
                    <><Trophy className="w-5 h-5" /> See Results</>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE: Results ──────────────────────────────────────────────────────── */}
        {phase === 'results' && (
          <div className="space-y-6">
            {/* Score card */}
            <div className="p-8 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 shadow-xl text-center space-y-5">
              <div className="space-y-1">
                <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
                <h2 className="font-display text-3xl font-bold text-[#4b2f23]">Quest Complete!</h2>
                <p className="text-sm text-[#4b2f23]/60">{levelConfig?.label} — {monument.name}</p>
              </div>

              {/* Big score */}
              <div className="space-y-1">
                <div
                  className="text-6xl font-black"
                  style={{ color: score >= 80 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444' }}
                >
                  {score}%
                </div>
                <p className="text-sm text-[#4b2f23]/70">
                  {answers.filter(a => a.correct).length} of {answers.length} correct
                </p>
              </div>

              {/* Score message */}
              <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/15">
                <p className="text-sm text-[#4b2f23]/80 italic">
                  {score === 100 ? '🌟 Perfect score! You have mastered this level.'
                    : score >= 80 ? '🎉 Excellent work! Strong historical understanding demonstrated.'
                    : score >= 60 ? '👍 Good effort! Review the explanations to strengthen your knowledge.'
                    : '📚 Keep studying — revisit the Research Dossier and try again.'}
                </p>
              </div>

              {/* New badges */}
              {newBadges.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] uppercase font-bold text-amber-600 tracking-wider">Badges Unlocked!</h4>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {newBadges.map(badgeId => {
                      const badge = BADGE_DEFINITIONS.find(b => b.id === badgeId);
                      if (!badge) return null;
                      return (
                        <div key={badgeId} className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-2">
                          <span className="text-xl">{badge.icon}</span>
                          <div className="text-left">
                            <p className="text-[10px] font-bold text-amber-700">{badge.title}</p>
                            <p className="text-[9px] text-[#4b2f23]/60">{badge.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question review */}
              <div className="space-y-3 text-left">
                <h4 className="text-[10px] uppercase font-bold text-[#b65a3a] tracking-wider">Question Review</h4>
                {answers.map((ans, i) => {
                  const q = questions[i];
                  return (
                    <div key={ans.questionId} className={`p-3 rounded-xl border text-xs ${ans.correct ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                      <div className="flex items-start gap-2">
                        {ans.correct
                          ? <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                          : <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        }
                        <div className="space-y-1">
                          <p className="font-semibold text-[#4b2f23]">{q?.question}</p>
                          {!ans.correct && (
                            <p className="text-green-700">✓ {q?.options[q?.correctIndex]}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleReset}
                className="py-3 rounded-xl bg-[#ede3d1] border border-[#aa7b3f]/30 text-sm font-bold text-[#4b2f23] hover:bg-[#e8dbc7] cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> Try Another Level
              </button>
              <button
                onClick={() => onNavigate(`research/monument/${monumentId}`)}
                className="py-3 rounded-xl bg-[#b65a3a] text-white text-sm font-bold hover:bg-[#9e4a2e] cursor-pointer transition-colors flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Research Dossier
              </button>
            </div>
            <button
              onClick={() => onNavigate('research/progress')}
              className="w-full py-3 rounded-xl bg-[#ede3d1] border border-[#aa7b3f]/20 text-sm font-semibold text-[#4b2f23] hover:bg-[#e8dbc7] cursor-pointer transition-colors flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4 text-amber-500" /> View My Full Progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
