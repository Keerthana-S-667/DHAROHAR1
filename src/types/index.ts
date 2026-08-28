export type Language = 'en' | 'ta' | 'hi';

export interface Hotspot {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  position: [number, number, number];
  architecturalSignificance: string;
  audioGuideSnippet?: string;
  detailImage?: string;
  eraFact: string;
}

export interface Monument {
  id: string;
  name: string;
  nativeName: string;
  tagline: string;
  stateId: string;
  destinationId: string;
  period: string;
  dynasty: string;
  ruler: string;
  architectureStyle: string;
  material: string;
  unescoYear?: number;
  location: {
    city: string;
    state: string;
    coordinates: string;
    lat: number;
    lng: number;
  };
  heroImage: string;
  galleryImages: string[];
  imageGallery?: GalleryImage[];
  culturalSignificance: string;
  history: string;
  stories: {
    title: string;
    narrative: string;
    type: 'mythology' | 'historical_event' | 'architectural_feat' | 'discovery';
  }[];
  preservationStatus: {
    healthScore: number;
    threats: string[];
    digitalScanStatus: string;
    currentInitiatives: string;
    visitorGuidelines: string[];
  };
  audioGuide: {
    duration: string;
    narrator: string;
    transcript: string;
  };
  has3DModel?: boolean;
  threeDModelUrl?: string;
  sketchfabId?: string;
  sketchfabUrl?: string;
  threeDStatus?: 'available' | 'pending';
  hotspots?: (Hotspot | MonumentHotspot)[];
  constructionMaterial?: string;
  constructionTechnique?: string;
  historicalOverview?: string;
  historicalTimeline?: HistoricalTimelineEvent[];
  architecturalDetails?: {
    overview: string;
    style: string;
    materials: string;
    techniques: string;
    highlights: string[];
    geometryPlan?: string;
  };
  unescoDetails?: string;
  researchReferences?: string[];
}

export interface MonumentHotspot {
  id: string;
  name: string;
  shortDescription: string;
  historicalSignificance: string;
  architecturalSignificance: string;
  story: string;
  position?: [number, number, number];
}

export interface GalleryImage {
  url: string;
  source: string;
  sourcePage?: string;
  photographer?: string;
  license?: string;
  title?: string;
  caption?: string;
}

export interface Destination {
  id: string;
  name: string;
  nativeName: string;
  stateId: string;
  tagline: string;
  heroImage: string;
  description: string;
  historicalContext: string;
  bestTimeToVisit: string;
  monumentIds: string[];
  geographicHighlight: string;
  imageGallery?: GalleryImage[];
}

export interface StateData {
  id: string;
  name: string;
  nativeName: string;
  capital: string;
  tagline: string;
  heroImage: string;
  accentColor: string;
  overview: string;
  dynasties: string[];
  architecturalHeritage: string;
  destinations: Destination[];
}

export interface TrailStop {
  monumentId: string;
  name: string;
  order: number;
  durationMinutes: number;
  distanceFromPrevious?: string;
  keyHighlight: string;
  audioTrackTitle: string;
  tipForVisitor: string;
}

export interface HeritageTrail {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  duration: string;
  difficulty: 'Easy' | 'Moderate' | 'In-depth';
  distance: string;
  heroImage: string;
  theme: string;
  description: string;
  stops: TrailStop[];
  historicalNarrative: string;
}

export interface TrailPreferences {
  duration: '15min' | '30min' | '1hour' | '2hours';
  interests: ('Architecture' | 'History' | 'Culture' | 'Photography')[];
  pace: 'relaxed' | 'moderate' | 'brisk';
  accessibility: boolean;
}

export interface TravellerPreferences {
  timeAvailable: '30min' | '1hour' | '2hours' | 'halfday' | 'fullday';
  interests: ('Architecture' | 'History' | 'Culture' | 'Photography' | 'Spiritual Heritage')[];
  mobilityPreference?: 'walking' | 'lowwalking' | 'accessible';
}

export interface NearbyHeritageResult {
  monument: Monument;
  destination: Destination;
  state: StateData;
  distanceKm: number;
  estimatedMinutes: number;
  matchingInterests: string[];
  recommendationReason: string;
  recommendationScore: number;
}

export interface HistoricalTimelineEvent {
  year: string;
  title: string;
  description: string;
  period: string;
}

export interface SavedResearchItem {
  id: string;
  monumentId: string;
  monumentName: string;
  sectionName?: string;
  featureName?: string;
  note?: string;
  savedContent?: string;
  sourceUrls?: string[];
  timestamp: number;
}

// ── Research Library ──────────────────────────────────────────────────────────

export type ResearchSourceType =
  | 'OFFICIAL_SOURCE'
  | 'RESEARCH_PAPER'
  | 'ACADEMIC_PUBLICATION'
  | 'ARCHAEOLOGICAL_REPORT'
  | 'HISTORICAL_DOCUMENT'
  | 'BOOK_CATALOGUE'
  | 'MUSEUM_RECORD'
  | 'UNESCO_RECORD'
  | 'GOVERNMENT_DOCUMENT';

export interface ResearchSource {
  id: string;
  monumentId: string;
  title: string;
  author?: string;
  year?: string;
  organization: string;
  sourceType: ResearchSourceType;
  description: string;
  url: string;
}

// ── Heritage Quest ────────────────────────────────────────────────────────────

export type QuizLevel = 'explorer' | 'historian' | 'researcher' | 'scholar';

export type QuizQuestionType = 'mcq' | 'true_false' | 'timeline';

export interface QuizQuestion {
  id: string;
  monumentId: string;
  level: QuizLevel;
  type: QuizQuestionType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceNote?: string;
}

// ── Student Progress ──────────────────────────────────────────────────────────

export interface BadgeDefinition {
  id: string;
  icon: string;
  title: string;
  description: string;
  requirement: string;
}

export interface StudentProgress {
  monumentsExplored: string[];
  sectionsCompleted: string[];   // e.g. "taj-mahal:architecture"
  sourcesViewed: string[];       // source ids
  sourcesSaved: string[];
  notesCreated: number;
  questsCompleted: Record<string, { level: QuizLevel; score: number; completedAt: number }[]>;
  badgesEarned: string[];
  totalScore: number;
  lastUpdated: number;
}

// ── Heritage Preservation Reports ─────────────────────────────────────────────

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportStatus = 
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'field_verification'
  | 'action_conservation'
  | 'requires_more_info'
  | 'resolved';

export interface HeritageReport {
  id: string;
  monumentId: string;
  monumentName: string;
  state: string;
  issueType: string;
  severity: ReportSeverity;
  status: ReportStatus;
  priorityScore: number;
  description: string;
  visualEvidence?: string[];
  gpsLatitude?: number;
  gpsLongitude?: number;
  reporterName?: string;
  reporterEmail?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportStatusHistory {
  id: string;
  reportId: string;
  status: ReportStatus;
  officerName?: string;
  notes?: string;
  createdAt: string;
}

export interface ReportAssignment {
  id: string;
  reportId: string;
  assignedRole: string;
  assignedToName: string;
  targetDate: string;
  officerNote?: string;
  createdAt: string;
}

export interface FieldVerification {
  id: string;
  reportId: string;
  verificationStatus: 'confirmed' | 'not_confirmed' | 'requires_further_study';
  observedCondition: string;
  recommendedAction: string;
  fieldNotes?: string;
  additionalEvidence?: string[];
  verifiedByName: string;
  verifiedAt: string;
}

export interface ReportResolution {
  id: string;
  reportId: string;
  summary: string;
  notes: string;
  evidenceUrl?: string;
  resolvedByName: string;
  resolvedAt: string;
}

export interface ReportActivityLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  reportId?: string;
  details?: string;
  createdAt: string;
}

export interface CommunityContribution {
  id: string;
  title: string;
  location: string;
  contributorName: string;
  contributorEmail?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
  moderatedByName?: string;
  moderatedAt?: string;
  createdAt: string;
}
