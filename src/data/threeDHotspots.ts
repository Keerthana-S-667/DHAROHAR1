import { MonumentHotspot } from '../types';

export const MONUMENT_3D_HOTSPOTS: Record<string, MonumentHotspot[]> = {
  'shore-temple': [
    {
      id: 'gopuram',
      name: 'The Entrance Gopuram',
      shortDescription: 'The western gateway structure representing the transition from outer secular spaces to inner sacred grounds.',
      historicalSignificance: 'Commissioned by Narasimhavarman II Rajasimha (700-728 CE) to serve as the gateway sentinel protecting the inner sanctuaries.',
      architecturalSignificance: 'Carved out of granite gneiss blocks. Unlike later high Dravidian towers, this remains low-profile, keeping in theme with Pallava double-tier design.',
      story: 'Legend says the Gopuram was the final structure built, sealing the temple energy and protecting it from destructive ocean spirits.',
      position: [0, 1.5, 4.5]
    },
    {
      id: 'vimana',
      name: 'Main Vimana (East Tower)',
      shortDescription: 'The taller towering cella housing Shiva, rising 60 feet overlooking the Bay of Bengal.',
      historicalSignificance: 'Designed as a structural maritime lighthouse, historically guiding ancient merchant vessels navigating the Coromandel Spice Routes.',
      architecturalSignificance: 'A stepped pyramidal granite tower terminating in an octagonal shikhara finial dome, illustrating early structural Dravidian stone masonry.',
      story: 'Sailors of old recorded seeing a crown of gold at the peak of the tower, reflecting the early morning sun to indicate safe harbour.',
      position: [0, 3.8, 0]
    },
    {
      id: 'nandi',
      name: 'Nandi Bull Enclosure',
      shortDescription: 'Perimeter boundary walls crowned with dozens of monolithic crouching guardian bull statues.',
      historicalSignificance: 'Carved during the peak of Pallava structural experiments to demarcate the sacred sanctuary thresholds.',
      architecturalSignificance: 'Over 50 life-sized Crouching Nandi figures sculpted from single granite rocks, creating an unbroken protective perimeter.',
      story: 'Local lore holds that the Nandi bulls wake up during stormy moonlit nights to guard the Shore Temple against ocean waves.',
      position: [3.5, 0.6, 2.2]
    },
    {
      id: 'sanctum',
      name: 'Inner Garbhagriha',
      shortDescription: 'The dark inner womb sanctum housing the fluted basalt Shiva Linga and the Somaskanda panel.',
      historicalSignificance: 'The core spiritual sanctuary of the temple complex, active since the 8th century.',
      architecturalSignificance: 'Houses a sixteen-sided fluted black basalt Dharalinga. On the back wall is a detailed low-relief stone panel portraying Shiva, Uma, and infant Skanda.',
      story: 'Devotees believe that chanting inside the silent, light-absorbing granite sanctum aligns one’s breathing with the low frequency of the ocean tides.',
      position: [0, 1.2, -0.4]
    },
    {
      id: 'mandapa',
      name: 'Pillar Hall (Mandapa)',
      shortDescription: 'The assembly chamber with heavy rock pillars connecting the entry to the main sanctum.',
      historicalSignificance: 'Used historically for royal congregational prayers, philosophical debates, and devotional dances.',
      architecturalSignificance: 'Features robust square pillars displaying characteristic Pallava sitting lion bases (Yali).',
      story: 'It is said that Rajasimha held court here with early stone sculptors to design the structural plans of subsequent temples.',
      position: [0, 0.8, 2.0]
    }
  ]
};
