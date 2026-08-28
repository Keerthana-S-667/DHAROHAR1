/**
 * DHAROHAR — Pan-India Heritage Risk & Preservation Dataset
 * Structured risk profiles for all 25 featured heritage monuments across India.
 * Verified environmental, structural, and visitor impact factors.
 */

export type RiskLevel = 'high' | 'moderate' | 'low';

export interface MonumentRiskProfile {
  monumentId: string;
  monumentName: string;
  city: string;
  state: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0 to 100
  primaryRisk: string;
  explanation: string;
  riskFactors: string[];
  preservationMeasures: string[];
  historicalImportance: string;
}

export const HERITAGE_RISK_DATA: Record<string, MonumentRiskProfile> = {
  'shore-temple': {
    monumentId: 'shore-temple',
    monumentName: 'Shore Temple',
    city: 'Mahabalipuram',
    state: 'Tamil Nadu',
    riskLevel: 'high',
    riskScore: 78,
    primaryRisk: 'Coastal erosion & saltwater exposure',
    explanation: 'Located directly beside the Bay of Bengal, continuous exposure to sea spray, salt-laden winds, and high humidity accelerates the abrasive erosion of Pallava granite carvings and foundation stability.',
    riskFactors: [
      'Coastal sea spray & salt crystallization',
      'High marine atmospheric humidity',
      'Saltwater capillary action in foundation stones',
      'Heavy tourist footfall on soft rock plinths',
      'Cyclonic storm surges & tidal wave risks'
    ],
    preservationMeasures: [
      'Sacrificial pulp and bentonite clay desalination packs',
      'Casuarina tree buffer belts & stone groynes coastal defense',
      'Sub-millimeter LiDAR 3D scanning and photogrammetric twins',
      'Controlled visitor access zones and elevated footpaths',
      'Real-time marine salinity & structural tilt monitoring'
    ],
    historicalImportance: '7th-century Pallava structural temple marking the transition from cave temples to freestanding Dravidian stone architecture.'
  },

  'konark-sun-temple': {
    monumentId: 'konark-sun-temple',
    monumentName: 'Konark Sun Temple',
    city: 'Konark',
    state: 'Odisha',
    riskLevel: 'high',
    riskScore: 82,
    primaryRisk: 'Sandstone weathering & internal sand fill pressure',
    explanation: 'Proximity to the Bay of Bengal subjects the Khondalite sandstone to severe salt weathering. The 1903 British sand fill inside the Jagamohana hall exerts internal structural pressure.',
    riskFactors: [
      'Severe salt crystallization & flaking',
      'Internal sand fill dead load weight',
      'Heavy monsoon rains and moisture retention',
      'Khondalite rock thermal expansion & cracking'
    ],
    preservationMeasures: [
      'Phased mechanical extraction of internal sand fill',
      'Chemical water-repellent micro-coatings on carved wheels',
      'Structural glass fiber sensors & load monitoring',
      'Comprehensive drainage & perimeter dewatering systems'
    ],
    historicalImportance: '13th-century Ganga dynasty masterpiece designed as a monumental solar chariot with 24 carved stone wheels.'
  },

  'ajanta-caves': {
    monumentId: 'ajanta-caves',
    monumentName: 'Ajanta Caves',
    city: 'Aurangabad',
    state: 'Maharashtra',
    riskLevel: 'high',
    riskScore: 75,
    primaryRisk: 'Sub-surface water seepage & mural pigment decay',
    explanation: 'Rainwater percolates through basalt rock fissures, bringing soluble salts into the ancient clay plaster murals, causing pigment flaking, mold growth, and biological decay.',
    riskFactors: [
      'Monsoon water seepage through basalt cracks',
      'Exhaled carbon dioxide & moisture from visitor crowds',
      'Insect and bat guano chemical erosion',
      'Pigment layer delamination from clay mud substrate'
    ],
    preservationMeasures: [
      'Fiber-optic cold light installation to eliminate thermal degradation',
      'Micro-climate relative humidity & temperature regulators',
      'Controlled batch entry for visitor group management',
      'Polymer consolidation of loose mural paint layers'
    ],
    historicalImportance: '2nd century BCE to 5th century CE rock-cut Buddhist sanctuaries featuring world-famous ancient Indian wall paintings.'
  },

  'ellora-caves': {
    monumentId: 'ellora-caves',
    monumentName: 'Ellora Caves',
    city: 'Aurangabad',
    state: 'Maharashtra',
    riskLevel: 'high',
    riskScore: 71,
    primaryRisk: 'Basalt weathering & heavy tourist footfall',
    explanation: 'The monolithic Kailasa Temple (Cave 16) is exposed to torrential monsoon rains, atmospheric temperature swings, and foot abrasion on rock-cut staircases.',
    riskFactors: [
      'Weathering of exposed monolithic basalt rock face',
      'Surface runoff during heavy monsoonal rainfalls',
      'Footwear wear on carved thresholds & pillar bases'
    ],
    preservationMeasures: [
      'Rock trench diversion channels to redirect storm runoff',
      'Bi-annual biocide spraying against lichen & algal colonies',
      'Laser cleaning of carbon deposits on relief sculptures',
      'Walkway matting to cushion high-volume foot traffic'
    ],
    historicalImportance: '8th-century Rashtrakuta rock-cut complex; Cave 16 is the largest single monolithic excavation in human history.'
  },

  'jaisalmer-fort': {
    monumentId: 'jaisalmer-fort',
    monumentName: 'Jaisalmer Fort',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    riskLevel: 'high',
    riskScore: 79,
    primaryRisk: 'Water seepage & yellow sandstone foundation collapse',
    explanation: 'Modern municipal water supply and drainage leaks soak into the clay soil beneath the yellow sandstone hill fort, causing soil liquefaction and wall subsidences.',
    riskFactors: [
      'Uncontrolled domestic wastewater leakage',
      'Subsoil clay expansion beneath fort bastions',
      'Extreme desert temperature fluctuations (0°C to 48°C)',
      'Heavy tourist residential load inside the living fort'
    ],
    preservationMeasures: [
      'Complete replacement of old sewage pipelines with sealed conduits',
      'Underpinning and micro-piling of tilting fortification bastions',
      'Strict municipal regulations on commercial guest houses',
      'Continuous geotechnical soil moisture monitoring'
    ],
    historicalImportance: '12th-century living fort built of golden yellow sandstone on Trikuta Hill along ancient Silk Road trade routes.'
  },

  'rani-ki-vav': {
    monumentId: 'rani-ki-vav',
    monumentName: 'Rani Ki Vav',
    city: 'Patan',
    state: 'Gujarat',
    riskLevel: 'high',
    riskScore: 74,
    primaryRisk: 'Subterranean moisture & siltation pressure',
    explanation: 'Built seven stories below ground level along the Saraswati River, the stepwell suffers from high subterranean humidity, ground moisture, and seasonal river flood risk.',
    riskFactors: [
      'Subsurface groundwater capillary moisture',
      'Silt accumulation and soil pressure on carved walls',
      'Humidity-induced fungal growth on lower tier sculptures'
    ],
    preservationMeasures: [
      'Subterranean dewatering wells and sump pump grid',
      'Gentle ultrasonic micro-cleaning of marble & sandstone reliefs',
      '3D LiDAR structural movement sensors on stepwell terraces',
      'Perimeter embankment buffer to divert river overflow'
    ],
    historicalImportance: '11th-century Solanki dynasty stepwell designed as an inverted temple honoring the sanctity of subterranean water.'
  },

  'taj-mahal': {
    monumentId: 'taj-mahal',
    monumentName: 'Taj Mahal',
    city: 'Agra',
    state: 'Uttar Pradesh',
    riskLevel: 'high',
    riskScore: 73,
    primaryRisk: 'Yamuna riverbed drying & industrial air pollution',
    explanation: 'Decline in Yamuna water levels threatens the moisture balance of the wooden well foundations. Atmospheric pollutants and insect excrement yellow the white marble.',
    riskFactors: [
      'Drying of Yamuna riverbed affecting timber foundation wells',
      'Industrial SO2 emissions causing atmospheric marble yellowing',
      'Goeldi insect breeding along Yamuna leaving green stains',
      'High daily visitor load (over 40,000 visitors/day)'
    ],
    preservationMeasures: [
      'Multani mitti (Fuller\'s earth) mud-pack therapy for marble whitening',
      'TTZ (Taj Trapezium Zone) industrial emission monitoring',
      'Check-dam construction to maintain minimum Yamuna water table',
      'Shoe covers and timed digital ticket management'
    ],
    historicalImportance: '17th-century Mughal white marble mausoleum universally acclaimed for its flawless bilateral symmetry.'
  },

  'brihadeeswarar-temple': {
    monumentId: 'brihadeeswarar-temple',
    monumentName: 'Brihadeeswarar Temple',
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    riskLevel: 'moderate',
    riskScore: 58,
    primaryRisk: 'Granite micro-lichen & seismic vibration',
    explanation: 'The 216-foot granite vimana stands without mortar. Atmospheric moisture promotes lichen growth, while regional micro-seismic activity requires continuous monitoring.',
    riskFactors: [
      'Micro-lichen & algal crust formation on granite joints',
      'Seismic vibration impacts on mortarless interlocking stones',
      'High crowd density during annual festival gatherings'
    ],
    preservationMeasures: [
      'Eco-friendly enzymatic cleaning of outer vimana carvings',
      'Piezoelectric tilt and vibration sensors on capstone',
      'Restricted access to upper interior passage levels'
    ],
    historicalImportance: '11th-century Chola granite temple showcasing the peak of High Dravidian stepped tower engineering.'
  },

  'red-fort': {
    monumentId: 'red-fort',
    monumentName: 'Red Fort',
    city: 'Delhi',
    state: 'Delhi',
    riskLevel: 'moderate',
    riskScore: 62,
    primaryRisk: 'Urban traffic pollution & red sandstone weathering',
    explanation: 'Located in Old Delhi, vehicle exhaust emissions and atmospheric particulates settle on the red Dholpur sandstone walls, causing surface darkening and spalling.',
    riskFactors: [
      'Vehicular pollution & soot deposition',
      'Thermal stress on exposed red sandstone battlements',
      'Monsoon moisture trapped in historic lime plaster layers'
    ],
    preservationMeasures: [
      'Low-pressure water jet and non-ionic detergent washing',
      'Lime mortar re-pointing of wall joints',
      'Pedestrianization of Old Delhi access corridors'
    ],
    historicalImportance: '17th-century Mughal imperial palace fort built by Shah Jahan, symbolic heart of Indian nationhood.'
  },

  'qutb-minar': {
    monumentId: 'qutb-minar',
    monumentName: 'Qutub Minar',
    city: 'New Delhi',
    state: 'Delhi',
    riskLevel: 'moderate',
    riskScore: 55,
    primaryRisk: 'Structural tilt & lightning vulnerability',
    explanation: 'The 72.5-meter tower has a slight historical tilt (approx. 25 cm). Being the tallest stone tower in the region, lightning strikes pose a recurring physical threat.',
    riskFactors: [
      'Slight structural tilt from foundation settlement',
      'Lightning strike risk on upper marble storeys',
      'Vibrations from surrounding metro and urban traffic'
    ],
    preservationMeasures: [
      'Advanced Faraday-cage lightning conductor installation',
      'Sub-surface tiltmeters & electronic inclinometer grid',
      'Protective iron pillar perimeter fence & barrier'
    ],
    historicalImportance: '12th-century Mamluk dynasty minaret representing the earliest surviving monument of the Delhi Sultanate.'
  },

  'gateway-of-india': {
    monumentId: 'gateway-of-india',
    monumentName: 'Gateway of India',
    city: 'Mumbai',
    state: 'Maharashtra',
    riskLevel: 'moderate',
    riskScore: 64,
    primaryRisk: 'Maritime salinity & urban exhaust accumulation',
    explanation: 'Positioned right on Mumbai harbour, salt spray and heavy vehicle exhaust cause surface erosion on the yellow basalt stone and decorative minarets.',
    riskFactors: [
      'Marine salt spray & high humidity coastal environment',
      'Urban vehicular pollution & smog',
      'Pigeon droppings accumulating on stone cornices'
    ],
    preservationMeasures: [
      'Periodic washing with deionized water and soft brushes',
      'Pigeon netting & bird deterrent gel application',
      'Structural health monitoring of sea-facing basalt foundation'
    ],
    historicalImportance: '20th-century Indo-Saracenic triumphal arch erected to commemorate the landing of King George V in 1911.'
  },

  'hampi-virupaksha': {
    monumentId: 'hampi-virupaksha',
    monumentName: 'Hampi / Vijayanagara Ruins',
    city: 'Hampi',
    state: 'Karnataka',
    riskLevel: 'moderate',
    riskScore: 52,
    primaryRisk: 'Granite exfoliation & Tungabhadra flood surges',
    explanation: 'The vast open-air ruin landscape faces extreme summer heat causing granite spalling, while monsoon floods along the Tungabhadra River threaten riverside shrines.',
    riskFactors: [
      'Thermal exfoliation of granite boulders',
      'Flash floods along the Tungabhadra riverbed',
      'Vegetation roots dislodging ancient temple masonry'
    ],
    preservationMeasures: [
      'Manual removal of invasive woody vegetation',
      'Riverbank stone revetment and flood warning gauge system',
      'Buffer zone urban development regulations'
    ],
    historicalImportance: '14th–16th century capital of the Vijayanagara Empire, sprawling over 4,100 hectares of granite boulder landscape.'
  },

  'gol-gumbaz': {
    monumentId: 'gol-gumbaz',
    monumentName: 'Gol Gumbaz',
    city: 'Vijayapura',
    state: 'Karnataka',
    riskLevel: 'moderate',
    riskScore: 48,
    primaryRisk: 'Acoustic gallery wall strain & dome mortar degradation',
    explanation: 'The massive 44-meter diameter unsupported dome exerts enormous outward thrust. The interior whispering gallery experiences high tourist acoustic and vibration energy.',
    riskFactors: [
      'Outward structural thrust from massive hemispherical dome',
      'Mortar degradation in dark basalt wall joints',
      'Loud vocal acoustic stress in whispering gallery'
    ],
    preservationMeasures: [
      'Ultrasonic crack gauge monitoring on dome perimeter',
      'Controlled visitor numbers inside whispering gallery',
      'Traditional lime-guggul mortar restoration'
    ],
    historicalImportance: '17th-century Adil Shahi mausoleum housing the world\'s second largest dome constructed without central pillars.'
  },

  'nalanda-mahavihara': {
    monumentId: 'nalanda-mahavihara',
    monumentName: 'Nalanda Mahavihara',
    city: 'Nalanda',
    state: 'Bihar',
    riskLevel: 'moderate',
    riskScore: 56,
    primaryRisk: 'Brick salt efflorescence & open rainwater pooling',
    explanation: 'Unroofed ancient red terracotta brick stupas and monastery walls absorb monsoon rainwater, causing soluble salt crystallization and brick crumbling.',
    riskFactors: [
      'Rainwater saturation of exposed ancient brick masonry',
      'Salt efflorescence crumbling terracotta decorative panels',
      'Subsoil drainage stagnation in monastery courtyards'
    ],
    preservationMeasures: [
      'Sacrificial capping layer on top of exposed brick walls',
      'Subsurface French drain network around monastery cella',
      'Hydrophobic siliconate treatment on brick faces'
    ],
    historicalImportance: '5th–12th century CE ancient international monastic university, one of the greatest centers of learning in human history.'
  },

  'meenakshi-temple': {
    monumentId: 'meenakshi-temple',
    monumentName: 'Meenakshi Amman Temple',
    city: 'Madurai',
    state: 'Tamil Nadu',
    riskLevel: 'moderate',
    riskScore: 45,
    primaryRisk: 'Heavy daily footfall & ritual soot deposits',
    explanation: 'Receiving over 20,000 visitors daily, oil lamp soot and footwear abrasion require continuous maintenance on multi-colored gopuram sculptures and mandapa halls.',
    riskFactors: [
      'High daily visitor traffic & footwear mechanical wear',
      'Oil lamp smoke & camphor soot on ceiling frescoes',
      'Humid interior mandapa atmosphere'
    ],
    preservationMeasures: [
      'Exhaust ventilation systems in inner oil lamp corridors',
      'Mineral pigment restoration on gopuram stucco figures',
      'Granite floor polishing and rubber matting pathways'
    ],
    historicalImportance: 'Historic Nayak dynasty temple complex renowned for its 14 towering colorful gopurams and Hall of a Thousand Pillars.'
  },

  'mysore-palace': {
    monumentId: 'mysore-palace',
    monumentName: 'Mysore Palace',
    city: 'Mysuru',
    state: 'Karnataka',
    riskLevel: 'low',
    riskScore: 22,
    primaryRisk: 'Controlled indoor tourism & timber wiring maintenance',
    explanation: 'Exemplary state conservation and active royal trust management maintain the granite structure, indoor stained glass, and 100,000 illumination bulbs in top condition.',
    riskFactors: [
      'Aging electrical wiring for 100,000 palace exterior bulbs',
      'High tourist volume through wooden durbar hall floors'
    ],
    preservationMeasures: [
      'Transition to low-heat LED decorative lighting systems',
      'Fire suppression grid and automated smoke detectors',
      'Carpeted visitor pathways protecting rosewood doors and brass inlay'
    ],
    historicalImportance: 'Indo-Saracenic royal residence of the Wadiyar dynasty, famed for its opulent Dussehra festival illuminations.'
  },

  'ellora-ajanta-caves': {
    monumentId: 'ajanta-caves',
    monumentName: 'Ajanta Caves',
    city: 'Aurangabad',
    state: 'Maharashtra',
    riskLevel: 'high',
    riskScore: 75,
    primaryRisk: 'Sub-surface water seepage & mural pigment decay',
    explanation: 'Rainwater percolates through basalt rock fissures, bringing soluble salts into ancient plaster murals.',
    riskFactors: ['Monsoon seepage', 'Visitor crowd humidity', 'Bat guano erosion'],
    preservationMeasures: ['Cold lighting', 'Batch entry limits', 'Polymer consolidation'],
    historicalImportance: 'World-famous 2nd century BCE rock-cut Buddhist murals.'
  },

  'sanchi-stupa': {
    monumentId: 'sanchi-stupa',
    monumentName: 'Sanchi Stupa',
    city: 'Sanchi',
    state: 'Madhya Pradesh',
    riskLevel: 'low',
    riskScore: 24,
    primaryRisk: 'Minor wind weathering on sandstone toranas',
    explanation: 'Situated in a calm rural setting with a dry inland climate, the Great Stupa is exceptionally well preserved under active ASI guardianship.',
    riskFactors: [
      'Wind-blown dust abrasion on carved gateway toranas',
      'Monsoon moss growth on stone hemispherical dome'
    ],
    preservationMeasures: [
      'Periodic biocide washing of stone dome terrace',
      'Dust-suppression landscaping and tree belt around hill base',
      'Sub-millimeter 3D photogrammetry of carved torana reliefs'
    ],
    historicalImportance: '3rd-century BCE Mauryan stupa commissioned by Emperor Ashoka, featuring the finest early Buddhist stone carving in Asia.'
  },

  'hawa-mahal': {
    monumentId: 'hawa-mahal',
    monumentName: 'Hawa Mahal',
    city: 'Jaipur',
    state: 'Rajasthan',
    riskLevel: 'moderate',
    riskScore: 42,
    primaryRisk: 'Street traffic vibration & dust accumulation',
    explanation: 'Facing main Jaipur city street traffic, vehicular vibrations and dust impact the 953 jharokha honeycomb windows made of delicate red and pink sandstone.',
    riskFactors: [
      'Road traffic vibration affecting five-story thin facade',
      'Fine urban dust settling inside 953 jharokha lattice screens'
    ],
    preservationMeasures: [
      'Speed restrictions and heavy vehicle bypass near facade',
      'Air-brush cleaning of intricate carved lattice windows',
      'Traditional lime-surkhi plaster maintenance on rear courtyard'
    ],
    historicalImportance: '1799 Rajput palace facade designed by Lal Chand Ustad with 953 jharokha windows for royal women to observe street processions.'
  },

  'amber-fort': {
    monumentId: 'amber-fort',
    monumentName: 'Amer Fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    riskLevel: 'moderate',
    riskScore: 49,
    primaryRisk: 'Hillside water runoff & glass mirror inlay tarnishing',
    explanation: 'The hill fort faces seasonal torrential rain runoff down Cheel ka Teela. Moisture inside the Sheesh Mahal can tarnish delicate convex mirror inlays.',
    riskFactors: [
      'Rainwater drainage cascades down hill slopes',
      'Moisture tarnishing silver backings of Sheesh Mahal mirror inlays',
      'Elephant & visitor footwear abrasion on courtyard paving'
    ],
    preservationMeasures: [
      'Hillside storm drain channels and catchment basins',
      'Dehumidifiers and glass casing in mirror palace chambers',
      'Periodic stone paving realignment in Jaleb Chowk'
    ],
    historicalImportance: '16th-century Kachwaha Rajput hilltop fort combining Hindu and Mughal courtly architecture.'
  },

  'jaisalmer-fort-dup': {
    monumentId: 'jaisalmer-fort',
    monumentName: 'Jaisalmer Fort',
    city: 'Jaisalmer',
    state: 'Rajasthan',
    riskLevel: 'high',
    riskScore: 79,
    primaryRisk: 'Water seepage & yellow sandstone foundation collapse',
    explanation: 'Modern water supply leaks into clay soil beneath the hill fort.',
    riskFactors: ['Wastewater leakage', 'Subsoil expansion', 'Desert heat'],
    preservationMeasures: ['Sealed sewage pipes', 'Bastion underpinning', 'Moisture sensors'],
    historicalImportance: '12th-century living golden sandstone fort.'
  },

  'bara-imambara': {
    monumentId: 'bara-imambara',
    monumentName: 'Bara Imambara',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    riskLevel: 'moderate',
    riskScore: 53,
    primaryRisk: 'Stucco plaster spalling & labyrinth load balance',
    explanation: 'The vaulted central hall built without wooden beams relies on rice-husk lakhori brick mortar. Dampness during monsoons causes stucco ornamental spalling.',
    riskFactors: [
      'Rainwater seepage into upper Bhulbhulaiya labyrinth corridors',
      'Stucco plaster spalling from Lakhori brickwork',
      'High humidity during Uttar Pradesh monsoon season'
    ],
    preservationMeasures: [
      'Waterproofing membrane application on upper labyrinth roof terrace',
      'Traditional urad-dal, bel-fruit, and lime plaster re-pointing',
      'Structural load distribution checks on central arched vault'
    ],
    historicalImportance: '18th-century Awadh masterpiece featuring the world\'s largest vaulted hall built without central pillars or wooden beams.'
  },

  'victoria-memorial': {
    monumentId: 'victoria-memorial',
    monumentName: 'Victoria Memorial',
    city: 'Kolkata',
    state: 'West Bengal',
    riskLevel: 'low',
    riskScore: 26,
    primaryRisk: 'Urban humidity & atmospheric soot on white marble',
    explanation: 'Kolkata\'s humid climate and urban traffic exhaust deposit fine carbon on the Makrana white marble facade, requiring systematic maintenance.',
    riskFactors: [
      'Humid tropical climate & carbon soot deposition',
      'Algal staining on lower garden balustrades'
    ],
    preservationMeasures: [
      'Periodic Fuller\'s earth clay treatment on marble surfaces',
      '64-acre surrounding manicured garden buffer filtration',
      'Internal climate-controlled museum gallery HVAC'
    ],
    historicalImportance: '20th-century Indo-British marble monument dedicated to Queen Victoria, blending British and Mughal revival styles.'
  },

  'india-gate': {
    monumentId: 'india-gate',
    monumentName: 'India Gate',
    city: 'New Delhi',
    state: 'Delhi',
    riskLevel: 'low',
    riskScore: 28,
    primaryRisk: 'Urban traffic smog & dust accumulation',
    explanation: 'Located at the heart of Kartavya Path, high municipal care and recent Rajpath redevelopment maintain the Bharatpur yellow and red sandstone arch.',
    riskFactors: [
      'Atmospheric dust & vehicular emissions',
      'Public event crowd pressure around base plaza'
    ],
    preservationMeasures: [
      'Low-pressure water jet washing of sandstone surfaces',
      'Redeveloped pedestrian lawns and marble bollard barriers',
      '24/7 municipal security and heritage lighting maintenance'
    ],
    historicalImportance: '1931 war memorial designed by Sir Edwin Lutyens, honoring 84,000 soldiers of the Indian Army.'
  },

  'lotus-temple': {
    monumentId: 'lotus-temple',
    monumentName: 'Lotus Temple',
    city: 'New Delhi',
    state: 'Delhi',
    riskLevel: 'low',
    riskScore: 18,
    primaryRisk: 'Modern marble petal joint sealing maintenance',
    explanation: 'Built in 1986 using white Penteli marble petals and reinforced concrete, the Bahá\'í House of Worship is impeccably maintained with active structural engineering.',
    riskFactors: [
      'Weathering of sealant joints between 27 marble petals',
      'Urban air pollution accumulation on white marble'
    ],
    preservationMeasures: [
      'Annual inspection and re-sealing of petal structural joints',
      'Pure water washing of marble shells',
      '9 surrounding ponds acting as micro-climate temperature buffers'
    ],
    historicalImportance: 'Modern architectural icon shaped as a lotus flower, open to all religions as a sanctuary of silence and meditation.'
  }
};

/**
 * Get risk profile for a given monument ID with fallback.
 */
export function getMonumentRiskProfile(monumentId: string): MonumentRiskProfile {
  const profile = HERITAGE_RISK_DATA[monumentId];
  if (profile) return profile;

  // Fallback defaults if missing
  return {
    monumentId,
    monumentName: 'Heritage Site',
    city: 'India',
    state: 'India',
    riskLevel: 'moderate',
    riskScore: 45,
    primaryRisk: 'Environmental weathering & urban exposure',
    explanation: 'This historic monument is subject to ongoing environmental weathering, atmospheric exposure, and footfall monitoring under official preservation protocols.',
    riskFactors: [
      'Atmospheric weathering & temperature swings',
      'Moisture & rainfall runoff',
      'Visitor footfall monitoring'
    ],
    preservationMeasures: [
      'Continuous structural condition monitoring',
      'Periodic conservation cleaning',
      'Digital 3D documentation & scanning'
    ],
    historicalImportance: 'Protected monument of national cultural significance.'
  };
}

/**
 * Get counts of monuments by risk level across the entire dataset.
 */
export function getRiskSummaryStats(monumentsList: Array<{ id: string }>) {
  let high = 0;
  let moderate = 0;
  let low = 0;

  monumentsList.forEach(m => {
    const prof = getMonumentRiskProfile(m.id);
    if (prof.riskLevel === 'high') high++;
    else if (prof.riskLevel === 'moderate') moderate++;
    else low++;
  });

  return { high, moderate, low, total: monumentsList.length };
}
