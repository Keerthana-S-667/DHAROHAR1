import { 
  STATES_DATA, 
  MONUMENTS, 
  HERITAGE_TRAILS, 
  SHORE_TEMPLE_HOTSPOTS, 
  AI_CULTURAL_KNOWLEDGE_BASE 
} from '../data/heritageData';
import { LOCALIZED_STATES, LOCALIZED_MONUMENTS } from '../data/localizedHeritageData';
import { StateData, Monument, HeritageTrail, Hotspot, Destination, NearbyHeritageResult, TravellerPreferences, HistoricalTimelineEvent, GalleryImage, Language } from '../types';

export function localizeState(state: StateData, lang?: Language): StateData {
  if (!state || !lang || lang === 'en') return state;
  const loc = LOCALIZED_STATES[state.id]?.[lang];
  if (!loc) return state;

  return {
    ...state,
    name: loc.name || state.name,
    tagline: loc.tagline || state.tagline,
    overview: loc.overview || state.overview,
    architecturalHeritage: loc.architecturalHeritage || state.architecturalHeritage,
    capital: loc.capital || state.capital,
    dynasties: loc.dynasties || state.dynasties
  };
}

export function localizeMonument(m: Monument, lang?: Language): Monument {
  if (!m || !lang || lang === 'en') return m;
  const loc = LOCALIZED_MONUMENTS[m.id]?.[lang];
  if (!loc) return m;

  return {
    ...m,
    name: loc.name || m.name,
    tagline: loc.tagline || m.tagline,
    culturalSignificance: loc.culturalSignificance || m.culturalSignificance,
    history: loc.history || m.history,
    architectureStyle: loc.architectureStyle || m.architectureStyle,
    material: loc.material || m.material,
    period: loc.period || m.period,
    dynasty: loc.dynasty || m.dynasty,
    ruler: loc.ruler || m.ruler
  };
}

export function enrichMonument(m: Monument): Monument {
  if (!m) return m;

  // 1. Historical Overview
  const historicalOverview = m.historicalOverview || `${m.name} stands as an immortal monument of ${m.dynasty} heritage in ${m.location.city}, ${m.location.state}. ${m.history} Commissioned during the era of ${m.period} under the vision of ${m.ruler}, it remains a globally celebrated landmark showcasing ${m.architectureStyle}. ${m.culturalSignificance}`;

  // 2. Historical Timeline
  const startYear = (m.period || '').split('–')[0]?.trim() || '1500 CE';
  const endYear = (m.period || '').includes('–') ? (m.period || '').split('–')[1]?.trim() : `${startYear} (Completed)`;

  const historicalTimeline: HistoricalTimelineEvent[] = (m.historicalTimeline && m.historicalTimeline.length > 0)
    ? m.historicalTimeline
    : [
        {
          year: startYear,
          title: `Royal Decree & Foundation by ${m.ruler}`,
          description: `Emperor/King ${m.ruler} of the ${m.dynasty} commissioned ${m.name} in ${m.location.city}. Master architects and artisans were mobilized across the region to quarry materials and lay the structural foundation.`,
          period: `${m.dynasty} Imperial Era`
        },
        {
          year: endYear,
          title: 'Architectural Consecration & Peak Milestone',
          description: `Construction completed utilizing ${m.material}. The grand structural plan reached full realization, establishing intricate decorative reliefs, ceremonial sanctums, and structural symmetry.`,
          period: 'Golden Heritage Period'
        },
        {
          year: m.unescoYear ? `${m.unescoYear} CE` : '1983 CE',
          title: m.unescoYear ? 'UNESCO World Heritage Inscription' : 'National Monument Protection',
          description: `Officially designated as a World Heritage site of Outstanding Universal Value, securing legal preservation mandates and international conservation funding under archaeological protection.`,
          period: 'Modern Preservation Era'
        },
        {
          year: '2024 CE',
          title: '3D LiDAR & Digital Twin Archival',
          description: `Sub-millimeter spatial photogrammetry and 3D mesh scans executed to digitally archive structural stone alignment, carvings, and architectural geometry.`,
          period: 'Digital Preservation Era'
        }
      ];

  // 3. Architectural Details
  const architecturalDetails = m.architecturalDetails || {
    overview: `${m.name} is a masterwork of ${m.architectureStyle}. Constructed primarily from ${m.constructionMaterial || m.material}, the structure harmonizes monumental scale with delicate structural ornamentation and structural engineering.`,
    style: m.architectureStyle,
    materials: m.constructionMaterial || m.material,
    techniques: m.constructionTechnique || 'Interlocking stone masonry, load-bearing arches, carved motifs, and stress-distributing plinths.',
    highlights: (m.stories || []).map(s => `${s.title}: ${s.narrative}`).concat([
      `Bilateral symmetry and proportional axial alignment crafted with local stone blocks.`,
      `Precision masonry engineered without modern mortar, withstanding seismic & weather stresses for centuries.`
    ])
  };

  const initialGallery: GalleryImage[] = (m.imageGallery && m.imageGallery.length > 0)
    ? m.imageGallery
    : (m.galleryImages || [m.heroImage]).map((url, idx) => ({
        url,
        source: 'DHAROHAR Archives',
        title: `${m.name} View ${idx + 1}`,
        caption: `Architectural perspective showing structural detailing of ${m.name}.`
      }));

  return {
    ...m,
    historicalOverview,
    historicalTimeline,
    architecturalDetails,
    imageGallery: initialGallery
  };
}

const MONUMENT_INTERESTS: Record<string, ('Architecture' | 'History' | 'Culture' | 'Photography' | 'Spiritual Heritage')[]> = {
  // Tamil Nadu
  'shore-temple': ['Architecture', 'History', 'Culture', 'Photography', 'Spiritual Heritage'],
  'arjunas-penance': ['Architecture', 'History', 'Culture', 'Photography'],
  'krishnas-butter-ball': ['History', 'Culture', 'Photography'],
  'descent-of-the-ganges': ['Architecture', 'History', 'Culture', 'Photography'],
  // Kerala
  'mattancherry-palace': ['Architecture', 'History', 'Culture', 'Photography'],
  'paradesi-synagogue': ['Architecture', 'History', 'Culture', 'Spiritual Heritage'],
  'st-francis-church': ['Architecture', 'History', 'Culture', 'Spiritual Heritage'],
  'bekal-fort': ['History', 'Culture', 'Photography'],
  'padmanabhaswamy-temple': ['Architecture', 'History', 'Culture', 'Spiritual Heritage'],
  // Karnataka
  'virupaksha-temple': ['Architecture', 'History', 'Culture', 'Spiritual Heritage'],
  'vittala-temple': ['Architecture', 'History', 'Culture', 'Photography'],
  'lotus-mahal': ['Architecture', 'History', 'Culture'],
  'hazara-rama-temple': ['Architecture', 'History', 'Spiritual Heritage'],
  // Rajasthan
  'hawa-mahal': ['Architecture', 'Culture', 'Photography'],
  'amber-fort': ['Architecture', 'History', 'Culture', 'Photography'],
  'city-palace-jaipur': ['Architecture', 'Culture', 'Photography'],
  'jantar-mantar-jaipur': ['Architecture', 'History', 'Culture'],
  // Delhi
  'qutb-minar': ['Architecture', 'History', 'Culture'],
  'humayuns-tomb': ['Architecture', 'History', 'Photography'],
  'red-fort': ['Architecture', 'History', 'Culture', 'Photography'],
  'india-gate': ['History', 'Culture', 'Photography'],
  // Odisha
  'konark-sun-temple': ['Architecture', 'History', 'Culture', 'Photography', 'Spiritual Heritage'],
  'mukteshwar-temple': ['Architecture', 'Culture', 'Spiritual Heritage'],
  'lingaraj-temple': ['Architecture', 'History', 'Culture', 'Spiritual Heritage'],
  'udayagiri-caves': ['Architecture', 'History', 'Culture'],
  // Uttar Pradesh
  'taj-mahal': ['Architecture', 'History', 'Culture', 'Photography'],
  'agra-fort': ['Architecture', 'History', 'Culture', 'Photography'],
  'fatehpur-sikri': ['Architecture', 'History', 'Culture'],
  'itmad-ud-daulah': ['Architecture', 'History', 'Culture', 'Photography']
};

export const heritageService = {
  /**
   * Retrieves all states list.
   */
  getStates(language?: Language): StateData[] {
    return STATES_DATA.map((s) => localizeState(s, language));
  },

  /**
   * Retrieves a single state by its ID.
   */
  getStateById(stateId: string, language?: Language): StateData | undefined {
    const s = STATES_DATA.find((s) => s.id === stateId);
    return s ? localizeState(s, language) : undefined;
  },

  /**
   * Retrieves all monuments located in a specific state by stateId.
   */
  getMonumentsByState(stateId: string, language?: Language): Monument[] {
    const all = Object.values(MONUMENTS);
    const state = STATES_DATA.find((s) => s.id === stateId);
    const destinationMonIds = state
      ? state.destinations.flatMap((d) => d.monumentIds || [])
      : [];

    return all
      .filter(
        (m) =>
          m.stateId === stateId ||
          destinationMonIds.includes(m.id) ||
          (m.location &&
            m.location.state &&
            m.location.state.toLowerCase().replace(/\s+/g, '-') === stateId)
      )
      .map((m) => localizeMonument(enrichMonument(m), language));
  },

  /**
   * Retrieves all monuments map.
   */
  getMonuments(language?: Language): Record<string, Monument> {
    const enriched: Record<string, Monument> = {};
    for (const key in MONUMENTS) {
      enriched[key] = localizeMonument(enrichMonument(MONUMENTS[key]), language);
    }
    return enriched;
  },

  /**
   * Retrieves a single monument by its ID.
   */
  getMonumentById(monumentId: string, language?: Language): Monument | undefined {
    const m = MONUMENTS[monumentId];
    return m ? localizeMonument(enrichMonument(m), language) : undefined;
  },

  /**
   * Retrieves all predefined heritage trails.
   */
  getHeritageTrails(): HeritageTrail[] {
    return HERITAGE_TRAILS;
  },

  /**
   * Retrieves a single heritage trail by its ID.
   */
  getHeritageTrailById(trailId: string): HeritageTrail | undefined {
    return HERITAGE_TRAILS.find((t) => t.id === trailId);
  },

  /**
   * Retrieves Shore Temple hotspots.
   */
  getShoreTempleHotspots(): Hotspot[] {
    return SHORE_TEMPLE_HOTSPOTS;
  },

  /**
   * Retrieves the simulated AI Knowledge Base.
   */
  getAICulturalKnowledgeBase() {
    return AI_CULTURAL_KNOWLEDGE_BASE;
  },

  /**
   * Helper: Calculates the Haversine distance between two coordinates in kilometers.
   */
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  /**
   * Helper: Estimate travel time based on distance and mobility preference.
   */
  estimateTravelTime(distanceKm: number, mobility?: 'walking' | 'lowwalking' | 'accessible'): number {
    let speedKmh = 5.0; // standard walking
    if (mobility === 'lowwalking' || mobility === 'accessible') {
      speedKmh = 3.5;
    }
    const timeHours = distanceKm / speedKmh;
    const timeMinutes = Math.round(timeHours * 60);
    return Math.max(1, timeMinutes);
  },

  /**
   * Evaluates all monuments and ranks them by relevance to the user coordinates & preferences.
   */
  getNearbyHeritage(
    userLocation: { latitude: number; longitude: number },
    prefs: TravellerPreferences
  ): NearbyHeritageResult[] {
    const results: NearbyHeritageResult[] = [];
    const monuments = MONUMENTS;

    for (const key in monuments) {
      const m = monuments[key];
      const dist = this.calculateDistance(userLocation.latitude, userLocation.longitude, m.location.lat, m.location.lng);

      // Discovery radius limit (e.g. 50 km for local relevance)
      if (dist > 50) {
        continue;
      }

      const state = STATES_DATA.find((s) => s.id === m.stateId);
      if (!state) continue;
      const destination = state.destinations.find((d) => d.id === m.destinationId);
      if (!destination) continue;

      const interestsTags = MONUMENT_INTERESTS[m.id] || [];
      const matchingInterests = interestsTags.filter((interest) =>
        prefs.interests.includes(interest)
      );

      const estimatedMinutes = this.estimateTravelTime(dist, prefs.mobilityPreference);

      // Recommendation Scoring Logic:
      // score = (interest matches * 20) - (distance * 2) + visit duration bonus
      let interestBonus = matchingInterests.length * 25;
      
      // Distance penalty (closer is higher score)
      let distanceScore = Math.max(0, 100 - (dist * 2));

      // Duration match bonus
      let timeMatchBonus = 0;
      if (prefs.timeAvailable === '30min' && estimatedMinutes <= 15) {
        timeMatchBonus = 30;
      } else if (prefs.timeAvailable === '1hour' && estimatedMinutes <= 30) {
        timeMatchBonus = 25;
      } else if (prefs.timeAvailable === '2hours' && estimatedMinutes <= 60) {
        timeMatchBonus = 20;
      } else if (prefs.timeAvailable === 'halfday' && estimatedMinutes <= 120) {
        timeMatchBonus = 15;
      } else {
        timeMatchBonus = 10;
      }

      const recommendationScore = interestBonus + distanceScore + timeMatchBonus;

      // Recommendation Reason Formulation
      let recommendationReason = '';
      if (matchingInterests.length > 0) {
        recommendationReason = `Matches your interest in ${matchingInterests[0]}`;
      } else if (estimatedMinutes < 15) {
        recommendationReason = `${estimatedMinutes} min from your current location`;
      } else {
        recommendationReason = `Fits your ${prefs.timeAvailable === '30min' ? '30-minute' : prefs.timeAvailable} visit`;
      }

      results.push({
        monument: m,
        destination,
        state,
        distanceKm: dist,
        estimatedMinutes,
        matchingInterests,
        recommendationReason,
        recommendationScore
      });
    }

    // Sort results by score in descending order
    return results.sort((a, b) => b.recommendationScore - a.recommendationScore);
  }
};
