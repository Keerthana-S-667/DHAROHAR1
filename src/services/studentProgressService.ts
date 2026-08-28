/**
 * DHAROHAR — Student Progress Service
 * localStorage-based progress tracking for the Student/Research role.
 * No external backend required.
 */

import { StudentProgress, QuizLevel, BadgeDefinition } from '../types';

const STORAGE_KEY = 'dharohar_student_progress';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  {
    id: 'first-explore',
    icon: '🏛️',
    title: 'Heritage Explorer',
    description: 'Explored your first monument research dossier',
    requirement: 'Explore 1 monument'
  },
  {
    id: 'five-monuments',
    icon: '🗺️',
    title: 'Monument Mapper',
    description: 'Explored research dossiers for 5 monuments',
    requirement: 'Explore 5 monuments'
  },
  {
    id: 'first-source',
    icon: '📜',
    title: 'Archive Explorer',
    description: 'Viewed your first verified research source',
    requirement: 'View 1 source'
  },
  {
    id: 'five-sources',
    icon: '📚',
    title: 'Library Scholar',
    description: 'Viewed 5 verified research sources',
    requirement: 'View 5 sources'
  },
  {
    id: 'first-note',
    icon: '📝',
    title: 'Research Scribe',
    description: 'Saved your first research note to the notebook',
    requirement: 'Save 1 note'
  },
  {
    id: 'ten-notes',
    icon: '📖',
    title: 'Notebook Keeper',
    description: 'Saved 10 research notes',
    requirement: 'Save 10 notes'
  },
  {
    id: 'first-quest',
    icon: '🎯',
    title: 'Quest Starter',
    description: 'Completed your first Heritage Quest',
    requirement: 'Complete 1 quest'
  },
  {
    id: 'perfect-score',
    icon: '⭐',
    title: 'Perfect Scholar',
    description: 'Scored 100% on a Heritage Quest',
    requirement: '100% score on any quest'
  },
  {
    id: 'all-levels',
    icon: '🎓',
    title: 'Heritage Scholar',
    description: 'Completed all 4 levels of any Heritage Quest',
    requirement: 'Complete all levels for one monument'
  },
  {
    id: 'researcher-level',
    icon: '🔬',
    title: 'Heritage Researcher',
    description: 'Reached Researcher level in Heritage Quest',
    requirement: 'Complete Researcher level quest'
  }
];

const DEFAULT_PROGRESS: StudentProgress = {
  monumentsExplored: [],
  sectionsCompleted: [],
  sourcesViewed: [],
  sourcesSaved: [],
  notesCreated: 0,
  questsCompleted: {},
  badgesEarned: [],
  totalScore: 0,
  lastUpdated: Date.now()
};

function loadProgress(): StudentProgress {
  if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

function saveProgress(progress: StudentProgress): void {
  if (typeof window === 'undefined') return;
  progress.lastUpdated = Date.now();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('[studentProgressService] Failed to save progress to localStorage');
  }
}

function checkAndAwardBadges(progress: StudentProgress): string[] {
  const newBadges: string[] = [];
  const earned = progress.badgesEarned;

  const award = (id: string) => {
    if (!earned.includes(id)) {
      earned.push(id);
      newBadges.push(id);
    }
  };

  if (progress.monumentsExplored.length >= 1) award('first-explore');
  if (progress.monumentsExplored.length >= 5) award('five-monuments');
  if (progress.sourcesViewed.length >= 1) award('first-source');
  if (progress.sourcesViewed.length >= 5) award('five-sources');
  if (progress.notesCreated >= 1) award('first-note');
  if (progress.notesCreated >= 10) award('ten-notes');

  const totalQuests = Object.values(progress.questsCompleted).reduce((sum, arr) => sum + arr.length, 0);
  if (totalQuests >= 1) award('first-quest');

  const hasPerfect = Object.values(progress.questsCompleted).some(arr =>
    arr.some(q => q.score === 100)
  );
  if (hasPerfect) award('perfect-score');

  const hasResearcher = Object.values(progress.questsCompleted).some(arr =>
    arr.some(q => q.level === 'researcher' || q.level === 'scholar')
  );
  if (hasResearcher) award('researcher-level');

  const hasAllLevels = Object.values(progress.questsCompleted).some(arr => {
    const levels = arr.map(q => q.level);
    return ['explorer', 'historian', 'researcher', 'scholar'].every(l => levels.includes(l as QuizLevel));
  });
  if (hasAllLevels) award('all-levels');

  return newBadges;
}

export const studentProgressService = {
  getProgress(): StudentProgress {
    return loadProgress();
  },

  markMonumentExplored(monumentId: string): string[] {
    const progress = loadProgress();
    if (!progress.monumentsExplored.includes(monumentId)) {
      progress.monumentsExplored.push(monumentId);
    }
    const newBadges = checkAndAwardBadges(progress);
    saveProgress(progress);
    return newBadges;
  },

  markSectionCompleted(monumentId: string, sectionKey: string): void {
    const progress = loadProgress();
    const key = `${monumentId}:${sectionKey}`;
    if (!progress.sectionsCompleted.includes(key)) {
      progress.sectionsCompleted.push(key);
    }
    saveProgress(progress);
  },

  markSourceViewed(sourceId: string): string[] {
    const progress = loadProgress();
    if (!progress.sourcesViewed.includes(sourceId)) {
      progress.sourcesViewed.push(sourceId);
    }
    const newBadges = checkAndAwardBadges(progress);
    saveProgress(progress);
    return newBadges;
  },

  markSourceSaved(sourceId: string): void {
    const progress = loadProgress();
    if (!progress.sourcesSaved.includes(sourceId)) {
      progress.sourcesSaved.push(sourceId);
    }
    saveProgress(progress);
  },

  incrementNotesCreated(): string[] {
    const progress = loadProgress();
    progress.notesCreated += 1;
    const newBadges = checkAndAwardBadges(progress);
    saveProgress(progress);
    return newBadges;
  },

  recordQuestCompletion(monumentId: string, level: QuizLevel, score: number): string[] {
    const progress = loadProgress();
    if (!progress.questsCompleted[monumentId]) {
      progress.questsCompleted[monumentId] = [];
    }
    progress.questsCompleted[monumentId].push({ level, score, completedAt: Date.now() });
    progress.totalScore += score;
    const newBadges = checkAndAwardBadges(progress);
    saveProgress(progress);
    return newBadges;
  },

  getAverageScore(): number {
    const progress = loadProgress();
    const allQuests = Object.values(progress.questsCompleted).flat();
    if (allQuests.length === 0) return 0;
    const total = allQuests.reduce((sum, q) => sum + q.score, 0);
    return Math.round(total / allQuests.length);
  },

  getTotalQuestsCompleted(): number {
    const progress = loadProgress();
    return Object.values(progress.questsCompleted).reduce((sum, arr) => sum + arr.length, 0);
  },

  getStudentLevel(): { title: string; description: string } {
    const progress = loadProgress();
    const monuments = progress.monumentsExplored.length;
    const notes = progress.notesCreated;
    const quests = this.getTotalQuestsCompleted();
    const sources = progress.sourcesViewed.length;
    const score = monuments * 2 + notes + quests * 3 + sources;

    if (score >= 50) return { title: 'Heritage Scholar', description: 'Expert-level researcher' };
    if (score >= 30) return { title: 'Heritage Researcher', description: 'Advanced research skills' };
    if (score >= 15) return { title: 'Heritage Historian', description: 'Growing historical understanding' };
    if (score >= 5) return { title: 'Heritage Seeker', description: 'Beginning your research journey' };
    return { title: 'Heritage Explorer', description: 'Just getting started' };
  },

  getBadgesEarned(): BadgeDefinition[] {
    const progress = loadProgress();
    return BADGE_DEFINITIONS.filter(b => progress.badgesEarned.includes(b.id));
  },

  resetProgress(): void {
    saveProgress({ ...DEFAULT_PROGRESS });
  }
};
