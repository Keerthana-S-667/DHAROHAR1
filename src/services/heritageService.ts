import { 
  STATES_DATA, 
  MONUMENTS, 
  HERITAGE_TRAILS, 
  SHORE_TEMPLE_HOTSPOTS, 
  AI_CULTURAL_KNOWLEDGE_BASE 
} from '../data/heritageData';
import { StateData, Monument, HeritageTrail, Hotspot, Destination, NearbyHeritageResult, TravellerPreferences } from '../types';

const MONUMENT_INTERESTS: Record<string, ('Architecture' | 'History' | 'Culture' | 'Photography' | 'Spiritual Heritage')[]> = {
  // Tamil Nadu
  'shore-temple': ['Architecture', 'History', 'Culture', 'Photography', 'Spiritual Heritage'],
  'pancha-rathas': ['Architecture', 'History', 'Photography'],
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
  getStates(): StateData[] {
    return STATES_DATA;
  },

  /**
   * Retrieves a single state by its ID.
   */
  getStateById(stateId: string): StateData | undefined {
    return STATES_DATA.find((s) => s.id === stateId);
  },

  /**
   * Retrieves all monuments map.
   */
  getMonuments(): Record<string, Monument> {
    return MONUMENTS;
  },

  /**
   * Retrieves a single monument by its ID.
   */
  getMonumentById(monumentId: string): Monument | undefined {
    return MONUMENTS[monumentId];
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
