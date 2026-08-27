import { StateData, Monument, HeritageTrail, Hotspot } from '../types';

export const SHORE_TEMPLE_HOTSPOTS: Hotspot[] = [
  {
    id: 'main-vimana',
    title: 'Main Vimana (East Tower)',
    subtitle: 'Stepped Dravidian Granite Pyramid',
    position: [0, 3.8, 0],
    architecturalSignificance: 'Rising 60 feet facing the Bay of Bengal, this stepped pyramidal tower exemplifies early structural Dravidian stone architecture, shifting away from rock-cut cave temples to freestanding masonry.',
    detailImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    eraFact: 'Commissioned by Narasimhavarman II Rajasimha (700–728 CE) of the Pallava Dynasty, designed so the first rays of the dawn sun illuminate the deity.',
    audioGuideSnippet: 'Observe the tier upon tier of kuta shrines and barrel-vaulted salas decreasing in size as they reach the octagonal shikhara finial...'
  },
  {
    id: 'nandi-wall',
    title: 'Nandi Bull Enclosure',
    subtitle: 'Over 50 Monolithic Granite Guardian Sculptures',
    position: [3.5, 0.6, 2.2],
    architecturalSignificance: 'The perimeter prakara wall is crowned with an unbroken perimeter of couchant Nandi bulls carved from single blocks of hard granite, serving as sacred threshold sentinels.',
    detailImage: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80',
    eraFact: 'Excavations in 1990 revealed that the submerged portion of this wall originally connected to an expansive ritual bathing tank fed by sea channels.',
    audioGuideSnippet: 'Each Nandi is carved with distinct horn curvature and bell harness ornaments, weathered by thirteen centuries of maritime salt spray.'
  },
  {
    id: 'sanctum-somaskanda',
    title: 'Sanctum & Somaskanda Relief',
    subtitle: 'Inner Garbhagriha & Fluted Basalt Dharalinga',
    position: [0, 1.2, -0.4],
    architecturalSignificance: 'The primary sanctum houses a sixteen-sided fluted polished black basalt Dharalinga. Behind it stands the signature Pallava Somaskanda panel portraying Shiva, Uma, and infant Skanda.',
    detailImage: 'https://images.unsplash.com/photo-1600100397608-f010e4210d63?auto=format&fit=crop&w=800&q=80',
    eraFact: 'Uniquely houses two Shiva shrines and an intervening third shrine dedicated to Vishnu as Anantasayana (reclining on serpent Adisesha).',
    audioGuideSnippet: 'Notice how the interior walls remain deliberately unadorned, directing the devotee’s focus solely toward the glowing icon illuminated by ghee lamps.'
  },
  {
    id: 'sea-breakwater',
    title: 'Ancient Sea Wall & Maritime Groynes',
    subtitle: 'Rock Revetment & Modern Coastal Defense',
    position: [-3.2, 0.4, -2.8],
    architecturalSignificance: 'Positioned right on the edge of the roaring Bay of Bengal, the temple historically functioned both as a sacred shrine and as a lighthouse navigation landmark for Roman, Persian, and Chinese trading galleons.',
    detailImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80',
    eraFact: 'During the 2004 Indian Ocean Tsunami, receding waters briefly exposed ancient stone ruins, lion carvings, and structural foundations of the legendary "Seven Pagodas".',
    audioGuideSnippet: 'Archaeological Survey of India planted Casuarina tree belts and constructed boulder breakwaters to buffer against salt crystallization.'
  }
];

export const MONUMENTS: Record<string, Monument> = {
  'taj-mahal': {
    id: 'taj-mahal',
    name: 'Taj Mahal',
    nativeName: 'ताज महल',
    tagline: 'The Immortal White Marble Symbol of Eternal Devotion & Symmetry',
    stateId: 'uttar-pradesh',
    destinationId: 'agra',
    period: '1631–1653 CE',
    dynasty: 'Mughal Empire',
    ruler: 'Emperor Shah Jahan',
    architectureStyle: 'Indo-Islamic Symmetrical White Marble Architecture',
    material: 'Makrana White Marble & Semi-Precious Pietra Dura Inlays',
    unescoYear: 1983,
    location: {
      city: 'Agra',
      state: 'Uttar Pradesh',
      coordinates: '27.1751° N, 78.0421° E',
      lat: 27.1751,
      lng: 78.0421
    },
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80'
    ],
    culturalSignificance: 'Universally admired masterpiece of world heritage, housing the tombs of Mumtaz Mahal and Shah Jahan with perfect bilateral symmetry.',
    history: 'Commissioned in 1631 by Mughal Emperor Shah Jahan to honor his favorite wife Mumtaz Mahal. Built over 22 years by over 20,000 artisans across Asia.',
    stories: [
      {
        title: 'Optical Symmetry and Shadow Alignment',
        narrative: 'The mausoleum displays perfect four-fold charbagh garden geometry, engineered so its dome appears identical from all main cardinal vistas.',
        type: 'architectural_feat'
      }
    ],
    preservationStatus: {
      healthScore: 94,
      threats: ['Industrial air pollution', 'Insect discoloration'],
      digitalScanStatus: 'Complete Sub-millimeter 3D LiDAR & Drone Photogrammetry',
      currentInitiatives: 'Mud-pack mud-bath therapy to gently extract yellow air pollutant deposits from marble pores.',
      visitorGuidelines: ['Shoe covers required on marble plinth', 'No tripod photography inside inner chamber']
    },
    audioGuide: {
      duration: '4 min 50 sec',
      narrator: 'Dr. Radhika Srinivasan',
      transcript: 'Welcome to the Taj Mahal, standing serene on the banks of the Yamuna River...'
    },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '1eb09052f6cd421caeaa6cb3204cb15d',
    sketchfabUrl: 'https://sketchfab.com/3d-models/taj-mahal-3d-model-1eb09052f6cd421caeaa6cb3204cb15d'
  },

  'brihadeeswarar-temple': {
    id: 'brihadeeswarar-temple',
    name: 'Brihadeeswarar Temple',
    nativeName: 'பெருவுடையார் கோவில்',
    tagline: 'The Great Living Chola Granite Temple of Thanjavur',
    stateId: 'tamil-nadu',
    destinationId: 'thanjavur',
    period: '1003–1010 CE',
    dynasty: 'Chola Dynasty',
    ruler: 'Emperor Raja Raja Chola I',
    architectureStyle: 'High Dravidian Granite Architecture',
    material: 'Interlocking Granite Blocks',
    unescoYear: 1987,
    location: {
      city: 'Thanjavur',
      state: 'Tamil Nadu',
      coordinates: '10.7828° N, 79.1318° E',
      lat: 10.7828,
      lng: 79.1318
    },
    heroImage: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1600&q=85',
    galleryImages: ['https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80'],
    culturalSignificance: 'Features a 216-foot vimana tower capped by an 80-ton single-block granite Kumbam dome, built without mortar.',
    history: 'Consecrated in 1010 CE by Raja Raja Chola I to celebrate imperial naval victories and devotion to Lord Shiva (Peruvudaiyar).',
    stories: [],
    preservationStatus: {
      healthScore: 96,
      threats: ['Monsoon rain runoff'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Structural granite joint inspection & UNESCO conservation monitor.',
      visitorGuidelines: ['Remove footwear before entering outer prakara']
    },
    audioGuide: { duration: '4 min 10 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Look up at the majestic 216-foot vimana...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: 'bcd05c0ac54a460883af7b8d9f4686c7',
    sketchfabUrl: 'https://sketchfab.com/3d-models/brihadeeshwara-mandir-thanjavur-bcd05c0ac54a460883af7b8d9f4686c7'
  },

  'shore-temple': {
    id: 'shore-temple',
    name: 'Shore Temple, Mahabalipuram',
    nativeName: 'கடற்கரைக் கோயில்',
    tagline: 'The 1300-Year Sentinel of the Coromandel Coast',
    stateId: 'tamil-nadu',
    destinationId: 'mahabalipuram',
    period: '700–728 CE',
    dynasty: 'Pallava Dynasty',
    ruler: 'King Narasimhavarman II (Rajasimha)',
    architectureStyle: 'Early Structural Dravidian Stone Architecture',
    material: 'Dressed Granitic Gneiss stone blocks',
    unescoYear: 1984,
    location: {
      city: 'Mahabalipuram',
      state: 'Tamil Nadu',
      coordinates: '12.6163° N, 80.1994° E',
      lat: 12.6163,
      lng: 80.1994
    },
    heroImage: '/images/mahabalipuram-hero.jpg',
    galleryImages: [
      '/images/mahabalipuram-hero.jpg',
      '/images/gallery/shore-temple-1.png',
      '/images/gallery/shore-temple-2.png',
      '/images/gallery/shore-temple-3.jpg',
      '/images/gallery/shore-temple-4.png'
    ],
    imageGallery: [
      {
        url: '/images/mahabalipuram-hero.jpg',
        source: 'DHAROHAR Cultural Archive',
        photographer: 'User Collection',
        license: 'Heritage Archive'
      },
      {
        url: '/images/gallery/shore-temple-1.png',
        source: 'DHAROHAR Cultural Archive',
        photographer: 'User Collection',
        license: 'Heritage Archive'
      },
      {
        url: '/images/gallery/shore-temple-2.png',
        source: 'DHAROHAR Cultural Archive',
        photographer: 'User Collection',
        license: 'Heritage Archive'
      },
      {
        url: '/images/gallery/shore-temple-3.jpg',
        source: 'DHAROHAR Cultural Archive',
        photographer: 'User Collection',
        license: 'Heritage Archive'
      },
      {
        url: '/images/gallery/shore-temple-4.png',
        source: 'DHAROHAR Cultural Archive',
        photographer: 'User Collection',
        license: 'Heritage Archive'
      }
    ],
    culturalSignificance: 'Marks the transition from rock-cut cave temples to structural granite towers facing maritime trade routes.',
    history: 'Built during the reign of Rajasimha of the Pallava dynasty between 700 and 728 CE as a coastal shrine and lighthouse.',
    stories: [
      {
        title: 'The Legend of the Seven Pagodas',
        narrative: 'Centuries-old accounts described seven magnificent towers along this coast. The 2004 tsunami briefly exposed submerged ruins.',
        type: 'mythology'
      }
    ],
    preservationStatus: {
      healthScore: 92,
      threats: ['Sea salt efflorescence', 'Coastal wind erosion'],
      digitalScanStatus: 'Complete Sub-millimeter LiDAR Scan (2024)',
      currentInitiatives: 'Sacrificial clay packs to extract marine salts from structural granite.',
      visitorGuidelines: ['Do not touch weathered Nandi statues']
    },
    audioGuide: { duration: '4 min 20 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Welcome to the Shore Temple...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '4a6a5c0795034b7fa91bbbd384b5ab28',
    sketchfabUrl: 'https://sketchfab.com/3d-models/shore-temple-mamallapurammahabalipuram-4a6a5c0795034b7fa91bbbd384b5ab28',
    hotspots: SHORE_TEMPLE_HOTSPOTS
  },

  'konark-sun-temple': {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple',
    nativeName: 'କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର',
    tagline: 'The Celestial Stone Chariot of Surya',
    stateId: 'odisha',
    destinationId: 'konark',
    period: '1250 CE',
    dynasty: 'Eastern Ganga Dynasty',
    ruler: 'King Narasimhadeva I',
    architectureStyle: 'Kalinga Stone Architecture',
    material: 'Khondalite & Chlorite Stone',
    unescoYear: 1984,
    location: {
      city: 'Konark',
      state: 'Odisha',
      coordinates: '19.8876° N, 86.0945° E',
      lat: 19.8876,
      lng: 86.0945
    },
    heroImage: '/images/konark-hero.jpg',
    galleryImages: [
      '/images/konark-hero.jpg',
      '/images/gallery/konark-1.png',
      '/images/gallery/konark-2.jpg',
      '/images/gallery/konark-4.jpg',
      '/images/gallery/konark-5.png'
    ],
    imageGallery: [
      { url: '/images/konark-hero.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/konark-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/konark-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/konark-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/konark-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Conceived as a giant 24-wheeled stone chariot drawn by 7 horses, calculating precise solar time.',
    history: 'Built by King Narasimhadeva I in the 13th century on the Bay of Bengal shore as a sanctuary of light.',
    stories: [],
    preservationStatus: {
      healthScore: 88,
      threats: ['Structural sand weight', 'Humid ocean air'],
      digitalScanStatus: 'Complete LiDAR Scan',
      currentInitiatives: 'Removing interior sand fill under ASI & international conservation experts.',
      visitorGuidelines: ['Stay within designated walking paths']
    },
    audioGuide: { duration: '4 min 0 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Observe the 24 carved sundial wheels...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '6cc905be2ae34e8091eb1eaa84a17738',
    sketchfabUrl: 'https://sketchfab.com/3d-models/sun-temple-konark-6cc905be2ae34e8091eb1eaa84a17738'
  },

  'charminar': {
    id: 'charminar',
    name: 'Charminar',
    nativeName: 'चारमीनार',
    tagline: 'The Four Minarets Gateway of Hyderabad',
    stateId: 'telangana',
    destinationId: 'hyderabad',
    period: '1591 CE',
    dynasty: 'Qutb Shahi Dynasty',
    ruler: 'Sultan Muhammad Quli Qutb Shah',
    architectureStyle: 'Indo-Islamic Architecture',
    material: 'Granite, Mortar & Pulverized Marble',
    location: {
      city: 'Hyderabad',
      state: 'Telangana',
      coordinates: '17.3616° N, 78.4747° E',
      lat: 17.3616,
      lng: 78.4747
    },
    heroImage: '/images/charminar-hero.jpg',
    galleryImages: [
      '/images/gallery/charminar-2.png',
      '/images/gallery/charminar-3.png',
      '/images/gallery/charminar-6.png',
      '/images/gallery/charminar-7.png'
    ],
    imageGallery: [
      { url: '/images/gallery/charminar-2.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/charminar-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/charminar-6.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/charminar-7.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'The signature emblem of Hyderabad, featuring 4 grand 48-meter minarets over a square arched center.',
    history: 'Built in 1591 to commemorate the end of a deadly plague epidemic and mark the founding of Hyderabad city.',
    stories: [],
    preservationStatus: {
      healthScore: 91,
      threats: ['Traffic vibration', 'Plaster flaking'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Pedestrianized heritage zone around the monument base.',
      visitorGuidelines: ['Ascend minaret staircases in batches']
    },
    audioGuide: { duration: '3 min 30 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Welcome to the heart of Hyderabad...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: 'bb880d064036496ca14ebac08a243af0',
    sketchfabUrl: 'https://sketchfab.com/3d-models/charminar-bb880d064036496ca14ebac08a243af0'
  },

  'india-gate': {
    id: 'india-gate',
    name: 'India Gate',
    nativeName: 'इंडिया गेट',
    tagline: 'The Triumphal Arch Memorial of Valor',
    stateId: 'delhi',
    destinationId: 'new-delhi',
    period: '1921–1931 CE',
    dynasty: 'British Colonial Era',
    ruler: 'Sir Edwin Lutyens (Architect)',
    architectureStyle: 'Neoclassical Triumphal Arch Architecture',
    material: 'Red & Pale Bharatpur Sandstone',
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      coordinates: '28.6129° N, 77.2295° E',
      lat: 28.6129,
      lng: 77.2295
    },
    heroImage: '/images/india-gate-hero.jpg',
    galleryImages: [
      '/images/gallery/india-gate-1.png',
      '/images/gallery/india-gate-2.jpg',
      '/images/gallery/india-gate-3.png',
      '/images/gallery/india-gate-4.png',
      '/images/gallery/india-gate-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/india-gate-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/india-gate-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/india-gate-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/india-gate-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/india-gate-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Standing 42 meters high, it honors 84,000 soldiers of the British Indian Army who lost their lives in WWI.',
    history: 'Foundation stone laid in 1921 by the Duke of Connaught; inaugurated in 1931 as the central node of Rajpath.',
    stories: [],
    preservationStatus: {
      healthScore: 97,
      threats: ['Urban smog discoloration'],
      digitalScanStatus: 'Complete 3D Scan Registered',
      currentInitiatives: 'Kartavya Path redevelopment & periodic waterjet conservation cleaning.',
      visitorGuidelines: ['Respect the eternal flame zone']
    },
    audioGuide: { duration: '3 min 15 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'You are standing before the 42-meter memorial arch...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: 'fb44c4d59c954cd7a561dbbfed26dcfc',
    sketchfabUrl: 'https://sketchfab.com/3d-models/india-gate-3d-model-fb44c4d59c954cd7a561dbbfed26dcfc'
  },

  'red-fort': {
    id: 'red-fort',
    name: 'Red Fort',
    nativeName: 'लाल किला',
    tagline: 'The Red Sandstone Citadel of Imperial Mughals',
    stateId: 'delhi',
    destinationId: 'old-delhi',
    period: '1638–1648 CE',
    dynasty: 'Mughal Empire',
    ruler: 'Emperor Shah Jahan',
    architectureStyle: 'Mughal Imperial Palace Fort Architecture',
    material: 'Red Sandstone & Marble Pavilions',
    unescoYear: 2007,
    location: {
      city: 'Old Delhi',
      state: 'Delhi',
      coordinates: '28.6562° N, 77.2410° E',
      lat: 28.6562,
      lng: 77.2410
    },
    heroImage: '/images/red-fort-hero.jpg',
    galleryImages: [
      '/images/gallery/red-fort-1.png',
      '/images/gallery/red-fort-2.jpg',
      '/images/gallery/red-fort-3.jpg',
      '/images/gallery/red-fort-4.jpg',
      '/images/gallery/red-fort-5.jpg'
    ],
    imageGallery: [
      { url: '/images/gallery/red-fort-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/red-fort-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/red-fort-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/red-fort-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/red-fort-5.jpg', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Iconic seat of Indian sovereignty where the Prime Minister unfurls the tricolor on Independence Day.',
    history: 'Built when Shah Jahan shifted his capital from Agra to Shahjahanabad (Old Delhi) in 1638.',
    stories: [],
    preservationStatus: {
      healthScore: 93,
      threats: ['Pollution', 'High footfall'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Restoration of Diwan-i-Khas marble and Stream of Paradise water channels.',
      visitorGuidelines: ['Follow security checkpoints at Lahori Gate']
    },
    audioGuide: { duration: '4 min 15 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Pass through the formidable Lahori Gate...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '2ad9ae0a1b524a37a2c3ab245b0e5423',
    sketchfabUrl: 'https://sketchfab.com/3d-models/red-fort-model-2ad9ae0a1b524a37a2c3ab245b0e5423'
  },

  'qutb-minar': {
    id: 'qutb-minar',
    name: 'Qutub Minar',
    nativeName: 'कुतुब मीनार',
    tagline: 'The World’s Tallest Brick Minaret',
    stateId: 'delhi',
    destinationId: 'mehrauli',
    period: '1192–1220 CE',
    dynasty: 'Delhi Sultanate (Mamluk Dynasty)',
    ruler: 'Qutb al-Din Aibak & Iltutmish',
    architectureStyle: 'Indo-Islamic Fluted Tower Architecture',
    material: 'Red Sandstone & White Marble',
    unescoYear: 1993,
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      coordinates: '28.5245° N, 77.1855° E',
      lat: 28.5245,
      lng: 77.1855
    },
    heroImage: 'https://images.unsplash.com/photo-1545232979-fbf30fe367c5?auto=format&fit=crop&w=1600&q=85',
    galleryImages: ['https://images.unsplash.com/photo-1545232979-fbf30fe367c5?auto=format&fit=crop&w=1200&q=80'],
    culturalSignificance: 'Rises 72.5 meters with 5 distinct storeys covered in intricate Quranic epigraphy and stalactite balconies.',
    history: 'Started in 1192 by Qutb-ud-din Aibak after defeating Prithviraj Chauhan; expanded by Iltutmish and Firoz Shah Tughlaq.',
    stories: [],
    preservationStatus: {
      healthScore: 95,
      threats: ['Mild structural tilt', 'Lightning strikes'],
      digitalScanStatus: 'Complete Sub-millimeter LiDAR Scan',
      currentInitiatives: 'Seismic tilt sensors & lightning conductor retrofitting.',
      visitorGuidelines: ['Keep clear of the Iron Pillar railing']
    },
    audioGuide: { duration: '4 min 0 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Observe the five fluted storeys rising into the sky...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '8777afc0c80549d1abb7c0f28832bb4b',
    sketchfabUrl: 'https://sketchfab.com/3d-models/qutubminar-8777afc0c80549d1abb7c0f28832bb4b'
  },

  'gateway-of-india': {
    id: 'gateway-of-india',
    name: 'Gateway of India',
    nativeName: 'गेटवे ऑफ इंडिया',
    tagline: 'The Waterfront Arch of Bombay',
    stateId: 'maharashtra',
    destinationId: 'mumbai',
    period: '1911–1924 CE',
    dynasty: 'British Colonial Era',
    ruler: 'George Wittet (Architect)',
    architectureStyle: 'Indo-Saracenic Architecture',
    material: 'Yellow Basalt & Concrete',
    location: {
      city: 'Mumbai',
      state: 'Maharashtra',
      coordinates: '18.9220° N, 72.8347° E',
      lat: 18.9220,
      lng: 72.8347
    },
    heroImage: '/images/gateway-of-india-hero.jpg',
    galleryImages: [
      '/images/gallery/gateway-1.jpg',
      '/images/gallery/gateway-2.png',
      '/images/gallery/gateway-3.jpg',
      '/images/gallery/gateway-4.jpg',
      '/images/gallery/gateway-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/gateway-1.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gateway-2.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gateway-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gateway-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gateway-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Built to commemorate the visit of King George V and Queen Mary to Mumbai in 1911.',
    history: 'Inaugurated in 1924; later served as the ceremonial exit point for the last British troops in 1948.',
    stories: [],
    preservationStatus: {
      healthScore: 92,
      threats: ['Sea air weathering'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Chemical basalt cleaning & sea wall fortification.',
      visitorGuidelines: ['Security screening at Apollo Bunder plaza']
    },
    audioGuide: { duration: '3 min 10 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Overlooking the Arabian Sea, this 26-meter archway...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '38a652e9f3bf49039026ef65ef61ac92',
    sketchfabUrl: 'https://sketchfab.com/3d-models/gateway-of-india-mumbai-38a652e9f3bf49039026ef65ef61ac92'
  },

  'mysore-palace': {
    id: 'mysore-palace',
    name: 'Mysore Palace',
    nativeName: 'ಮೈಸೂರು ಅರಮನೆ',
    tagline: 'The Grand Royal Seat of the Wadiyar Dynasty',
    stateId: 'karnataka',
    destinationId: 'mysore',
    period: '1897–1912 CE',
    dynasty: 'Wadiyar Dynasty',
    ruler: 'Maharani Vani Vilas Sannidhana & Henry Irwin',
    architectureStyle: 'Indo-Saracenic Royal Palace Architecture',
    material: 'Gray Granite with Pink Marble Domes',
    location: {
      city: 'Mysore',
      state: 'Karnataka',
      coordinates: '12.3052° N, 76.6552° E',
      lat: 12.3052,
      lng: 76.6552
    },
    heroImage: '/images/mysore-palace-hero.jpg',
    galleryImages: [
      '/images/gallery/mysore-1.jpg',
      '/images/gallery/mysore-2.jpg',
      '/images/gallery/mysore-3.jpg',
      '/images/gallery/mysore-4.jpg',
      '/images/gallery/mysore-5.jpg'
    ],
    imageGallery: [
      { url: '/images/gallery/mysore-1.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/mysore-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/mysore-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/mysore-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/mysore-5.jpg', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Famous for its 100,000 illumination bulbs lit during Dasara celebrations.',
    history: 'Rebuilt after the old wooden palace burned down during a royal wedding in 1897.',
    stories: [],
    preservationStatus: {
      healthScore: 96,
      threats: ['Electrical wiring wear'],
      digitalScanStatus: 'Complete 3D Scan Registered',
      currentInitiatives: 'Upgrading illumination bulbs to low-heat solar LEDs.',
      visitorGuidelines: ['No interior photography without permit']
    },
    audioGuide: { duration: '4 min 10 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Step inside the Durbar Hall with stained glass ceilings...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '0439ee6964c94a10bf9767088469bb94',
    sketchfabUrl: 'https://sketchfab.com/3d-models/mysore-palace-0439ee6964c94a10bf9767088469bb94'
  },

  'ellora-caves': {
    id: 'ellora-caves',
    name: 'Ellora Caves',
    nativeName: 'एलोरा गुफाएँ',
    tagline: 'The Rock-Cut Monolithic Miracle of Kailash',
    stateId: 'maharashtra',
    destinationId: 'chhatrapati-sambhajinagar',
    period: '600–1000 CE',
    dynasty: 'Rashtrakuta & Yadava Dynasties',
    ruler: 'King Krishna I',
    architectureStyle: 'Monolithic Rock-Cut Cave Architecture',
    material: 'Basaltic Cliff Outcrop',
    unescoYear: 1983,
    location: {
      city: 'Sambhaji Nagar',
      state: 'Maharashtra',
      coordinates: '20.0268° N, 75.1771° E',
      lat: 20.0268,
      lng: 75.1771
    },
    heroImage: '/images/ellora-caves-hero.jpg',
    galleryImages: [
      '/images/gallery/ellora-1.jpg',
      '/images/gallery/ellora-2.png',
      '/images/gallery/ellora-3.png',
      '/images/gallery/ellora-4.jpg',
      '/images/gallery/ellora-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/ellora-1.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ellora-2.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ellora-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ellora-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ellora-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: "Cave 16 (Kailasa Temple) is the world's largest single monolithic rock excavation, carved top-down.",
    history: 'Carved over 300 years by Hindu, Buddhist, and Jain monastic guilds.',
    stories: [],
    preservationStatus: {
      healthScore: 94,
      threats: ['Water seepage', 'Basalt flaking'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Micro-drainage channels to divert rainwater away from Cave 16.',
      visitorGuidelines: ['Do not touch rock relief sculptures']
    },
    audioGuide: { duration: '4 min 45 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'You are standing inside the hollowed mountain of Kailasa...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '1a5ec1e212f9451e80dc051e97164d17',
    sketchfabUrl: 'https://sketchfab.com/3d-models/ellora-caves-india-1a5ec1e212f9451e80dc051e97164d17'
  },

  'rani-ki-vav': {
    id: 'rani-ki-vav',
    name: 'Rani Ki Vav',
    nativeName: 'રાણીકી વાવ',
    tagline: 'The Inverted Subterranean Stepwell Temple',
    stateId: 'gujarat',
    destinationId: 'patan',
    period: '1063 CE',
    dynasty: 'Chaulukya Dynasty',
    ruler: 'Queen Udayamati',
    architectureStyle: 'Maru-Gurjara Subterranean Architecture',
    material: 'Sandstone Steps & Carved Sculptures',
    unescoYear: 2014,
    location: {
      city: 'Patan',
      state: 'Gujarat',
      coordinates: '23.8589° N, 72.1018° E',
      lat: 23.8589,
      lng: 72.1018
    },
    heroImage: '/images/rani-ki-vav-hero.jpg',
    galleryImages: [
      '/images/gallery/rani-ki-vav-1.png',
      '/images/gallery/rani-ki-vav-2.jpg',
      '/images/gallery/rani-ki-vav-3.png',
      '/images/gallery/rani-ki-vav-4.png',
      '/images/gallery/rani-ki-vav-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/rani-ki-vav-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/rani-ki-vav-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/rani-ki-vav-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/rani-ki-vav-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/rani-ki-vav-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Designed as an inverted temple honoring sacred water, with over 500 principal sculptures.',
    history: 'Built by Queen Udayamati in memory of King Bhimdev I; buried under Saraswati river silt for centuries.',
    stories: [],
    preservationStatus: {
      healthScore: 97,
      threats: ['Soil moisture shifts'],
      digitalScanStatus: 'Complete Sub-millimeter Scan (CyArk)',
      currentInitiatives: 'Sub-surface water table monitoring.',
      visitorGuidelines: ['Follow stepwell balcony barriers']
    },
    audioGuide: { duration: '3 min 50 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Descend seven terraces into the earth...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '4c877ded197f4e0faff92c43ce8a1ced',
    sketchfabUrl: 'https://sketchfab.com/3d-models/rani-ki-vav-patan-gujarat-4c877ded197f4e0faff92c43ce8a1ced'
  },

  'lotus-temple': {
    id: 'lotus-temple',
    name: 'Lotus Temple',
    nativeName: 'कमल मंदिर',
    tagline: 'The Blooming Petals of Global Harmony',
    stateId: 'delhi',
    destinationId: 'new-delhi',
    period: '1986 CE',
    dynasty: 'Modern Era',
    ruler: 'Fariborz Sahba (Architect)',
    architectureStyle: 'Modern Expressionist Architecture',
    material: 'Pentelic White Marble & Concrete',
    location: {
      city: 'New Delhi',
      state: 'Delhi',
      coordinates: '28.5535° N, 77.2588° E',
      lat: 28.5535,
      lng: 77.2588
    },
    heroImage: '/images/lotus-temple-hero.jpg',
    galleryImages: [
      '/images/gallery/lotus-temple-1.jpg',
      '/images/gallery/lotus-temple-2.png',
      '/images/gallery/lotus-temple-3.png',
      '/images/gallery/lotus-temple-4.png',
      '/images/gallery/lotus-temple-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/lotus-temple-1.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/lotus-temple-2.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/lotus-temple-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/lotus-temple-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/lotus-temple-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Composed of 27 free-standing marble-clad "petals" arranged in clusters of three to form nine doors.',
    history: 'Opened in 1986 as a Baháʼí House of Worship open to all faiths.',
    stories: [],
    preservationStatus: {
      healthScore: 98,
      threats: ['Smog surface residue'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Periodic non-abrasive pure water washing of marble petals.',
      visitorGuidelines: ['Maintain silence inside the central hall']
    },
    audioGuide: { duration: '3 min 0 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Observe the 27 blooming marble petals...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: 'bf5edd0ef1a74bc3be8c2a52ac2f0362',
    sketchfabUrl: 'https://sketchfab.com/3d-models/lotus-temple-bf5edd0ef1a74bc3be8c2a52ac2f0362'
  },

  'victoria-memorial': {
    id: 'victoria-memorial',
    name: 'Victoria Memorial',
    nativeName: 'ভিক্টোরিয়া মেমোরিয়াল',
    tagline: 'The White Marble Monument of Kolkata',
    stateId: 'west-bengal',
    destinationId: 'kolkata',
    period: '1906–1921 CE',
    dynasty: 'British Colonial Era',
    ruler: 'Sir William Emerson',
    architectureStyle: 'Indo-Saracenic & Renaissance Revival',
    material: 'Makrana White Marble',
    location: {
      city: 'Kolkata',
      state: 'West Bengal',
      coordinates: '22.5448° N, 88.3426° E',
      lat: 22.5448,
      lng: 88.3426
    },
    heroImage: '/images/victoria-memorial-hero.jpg',
    galleryImages: [
      '/images/gallery/victoria-1.png',
      '/images/gallery/victoria-2.jpg',
      '/images/gallery/victoria-3.jpg',
      '/images/gallery/victoria-4.png',
      '/images/gallery/victoria-5.jpg'
    ],
    imageGallery: [
      { url: '/images/gallery/victoria-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/victoria-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/victoria-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/victoria-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/victoria-5.jpg', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Set in 64 acres of gardens, housing a massive museum of art and history.',
    history: "Conceived by Lord Curzon after Queen Victoria's death in 1901.",
    stories: [],
    preservationStatus: {
      healthScore: 93,
      threats: ['Atmospheric pollution'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Air quality monitoring & garden conservation.',
      visitorGuidelines: ['Follow museum gallery route']
    },
    audioGuide: { duration: '3.5 min', narrator: 'Dr. Radhika Srinivasan', transcript: "Welcome to Kolkata's grandest marble palace..." },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '1b3ec6a1a07949d08221f718fd1919d4',
    sketchfabUrl: 'https://sketchfab.com/3d-models/victoria-memorial-kolkata-1b3ec6a1a07949d08221f718fd1919d4'
  },

  'bara-imambara': {
    id: 'bara-imambara',
    name: 'Bara Imambara',
    nativeName: 'बड़ा इमामबाड़ा',
    tagline: 'The Gravity-Defying Vaulted Labyrinth',
    stateId: 'uttar-pradesh',
    destinationId: 'lucknow',
    period: '1784 CE',
    dynasty: 'Nawabs of Awadh',
    ruler: 'Nawab Asaf-ud-Daula',
    architectureStyle: 'Mughal & Awadhi Architecture',
    material: 'Lakhauri Bricks & Lime Stucco',
    location: {
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      coordinates: '26.8689° N, 80.9129° E',
      lat: 26.8689,
      lng: 80.9129
    },
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
    galleryImages: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'],
    culturalSignificance: "Contains the Bhulbhulaiya labyrinth and the world's largest arched hall unsupported by beams.",
    history: 'Built as a famine relief project in 1784 to provide employment to over 20,000 citizens.',
    stories: [],
    preservationStatus: {
      healthScore: 90,
      threats: ['Plaster decay'],
      digitalScanStatus: 'Complete 3D Mesh Scanned',
      currentInitiatives: 'Traditional lime mortar re-plastering.',
      visitorGuidelines: ['Hire an official guide for the Bhulbhulaiya maze']
    },
    audioGuide: { duration: '3 min 40 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Explore the 1000 passageways of the labyrinth...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '323a5337a59643aabc17849d7a68e8b5',
    sketchfabUrl: 'https://sketchfab.com/3d-models/bara-imambara-323a5337a59643aabc17849d7a68e8b5'
  },

  'ajanta-caves': {
    id: 'ajanta-caves',
    name: 'Ajanta Caves',
    nativeName: 'अजिंता गुंफा',
    tagline: 'The Ancient Fresco Shrines of the Deccan',
    stateId: 'maharashtra',
    destinationId: 'chhatrapati-sambhajinagar',
    period: '2nd Century BCE – 5th Century CE',
    dynasty: 'Satavahana & Vakataka Dynasties',
    ruler: 'Emperor Harishena',
    architectureStyle: 'Rock-Cut Buddhist Cave Architecture',
    material: 'Basalt Rock Cliff',
    unescoYear: 1983,
    location: { city: 'Sambhaji Nagar', state: 'Maharashtra', coordinates: '20.5523° N, 75.7004° E', lat: 20.5523, lng: 75.7004 },
    heroImage: '/images/ajanta-caves-hero.jpg',
    galleryImages: [
      '/images/gallery/ajanta-1.jpg',
      '/images/gallery/ajanta-2.jpg',
      '/images/gallery/ajanta-3.jpg',
      '/images/gallery/ajanta-4.jpg',
      '/images/gallery/ajanta-5.jpg'
    ],
    imageGallery: [
      { url: '/images/gallery/ajanta-1.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ajanta-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ajanta-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ajanta-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/ajanta-5.jpg', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Renowned for world-famous Jataka tale wall mural paintings and masterfully carved chaitya halls.',
    history: 'Carved into a horseshoe-shaped gorge along the Waghur River across two distinct Buddhist artistic waves.',
    stories: [],
    preservationStatus: { healthScore: 92, threats: ['Humidity', 'Fresco fading'], digitalScanStatus: 'Complete High-Res Scan', currentInitiatives: 'Fiber-optic cool lighting inside caves.', visitorGuidelines: ['No flash photography'] },
    audioGuide: { duration: '4 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Gaze upon the Bodhisattva Padmapani fresco...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabUrl: 'https://sketchfab.com/search?type=models&q=Ajanta+Caves+India'
  },

  'sanchi-stupa': {
    id: 'sanchi-stupa',
    name: 'Sanchi Stupa',
    nativeName: 'सांची का स्तूप',
    tagline: 'The Great Cosmic Dome of Buddhist Heritage',
    stateId: 'madhya-pradesh',
    destinationId: 'sanchi',
    period: '3rd Century BCE',
    dynasty: 'Maurya & Satavahana Dynasties',
    ruler: 'Emperor Ashoka the Great',
    architectureStyle: 'Ancient Buddhist Stupa & Torana Architecture',
    material: 'Sandstone Hemispherical Dome',
    unescoYear: 1989,
    location: { city: 'Sanchi', state: 'Madhya Pradesh', coordinates: '23.4793° N, 77.7397° E', lat: 23.4793, lng: 77.7397 },
    heroImage: '/images/sanchi-stupa-hero.jpg',
    galleryImages: [
      '/images/gallery/sanchi-1.jpg',
      '/images/gallery/sanchi-2.png',
      '/images/gallery/sanchi-3.png',
      '/images/gallery/sanchi-4.png',
      '/images/gallery/sanchi-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/sanchi-1.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/sanchi-2.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/sanchi-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/sanchi-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/sanchi-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'The oldest stone structure in India, featuring four intricately carved ceremonial Torana gateways.',
    history: 'Commissioned by Emperor Ashoka in the 3rd century BCE to enshrine relics of the Buddha.',
    stories: [],
    preservationStatus: { healthScore: 96, threats: ['Weathering'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'ASI structural stone consolidation.', visitorGuidelines: ['Circumambulate in clockwise direction'] },
    audioGuide: { duration: '3.5 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Walk around the ancient pradakshina patha...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: 'a8347d4f5272439bb2396ea40551cfc9',
    sketchfabUrl: 'https://sketchfab.com/3d-models/the-great-stupa-at-sanchi-a8347d4f5272439bb2396ea40551cfc9'
  },

  'hawa-mahal': {
    id: 'hawa-mahal',
    name: 'Hawa Mahal',
    nativeName: 'हवा महल',
    tagline: 'The Palace of Winds with 953 Jharokhas',
    stateId: 'rajasthan',
    destinationId: 'jaipur',
    period: '1799 CE',
    dynasty: 'Kachwaha Rajput Dynasty',
    ruler: 'Maharaja Sawai Pratap Singh',
    architectureStyle: 'Rajput Thermodynamic Architecture',
    material: 'Red and Pink Sandstone',
    location: { city: 'Jaipur', state: 'Rajasthan', coordinates: '26.9239° N, 75.8267° E', lat: 26.9239, lng: 75.8267 },
    heroImage: '/images/hawa-mahal-hero.jpg',
    galleryImages: [
      '/images/gallery/hawa-mahal-1.png',
      '/images/gallery/hawa-mahal-2.jpg',
      '/images/gallery/hawa-mahal-3.jpg',
      '/images/gallery/hawa-mahal-4.jpg',
      '/images/gallery/hawa-mahal-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/hawa-mahal-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hawa-mahal-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hawa-mahal-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hawa-mahal-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hawa-mahal-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Designed as a five-story honeycomb screen allowing royal women to observe street festivals via the Venturi cooling effect.',
    history: 'Built in 1799 by Lal Chand Ustad under the patronage of Sawai Pratap Singh.',
    stories: [],
    preservationStatus: { healthScore: 94, threats: ['Urban dust'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'Pink lime wash preservation.', visitorGuidelines: ['Explore upper terrace viewing balconies'] },
    audioGuide: { duration: '3.5 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Feel the cool breeze passing through 953 jharokhas...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabUrl: 'https://sketchfab.com/search?type=models&q=Hawa+Mahal+India'
  },

  'amber-fort': {
    id: 'amber-fort',
    name: 'Amer Fort',
    nativeName: 'आमेर किला',
    tagline: 'The Hilltop Citadel of Sheesh Mahal',
    stateId: 'rajasthan',
    destinationId: 'jaipur',
    period: '1592 CE',
    dynasty: 'Kachwaha Rajput Dynasty',
    ruler: 'Raja Man Singh I',
    architectureStyle: 'Rajput Hilltop Citadel Architecture',
    material: 'Red Sandstone & Marble',
    unescoYear: 2013,
    location: { city: 'Amer, Jaipur', state: 'Rajasthan', coordinates: '26.9855° N, 75.8513° E', lat: 26.9855, lng: 75.8513 },
    heroImage: '/images/amber-fort-hero.jpg',
    galleryImages: [
      '/images/gallery/amber-fort-1.png',
      '/images/gallery/amber-fort-2.png',
      '/images/gallery/amber-fort-3.png',
      '/images/gallery/amber-fort-4.png',
      '/images/gallery/amber-fort-5.jpg'
    ],
    imageGallery: [
      { url: '/images/gallery/amber-fort-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/amber-fort-2.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/amber-fort-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/amber-fort-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/amber-fort-5.jpg', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Overlooks Maota Lake and houses the spectacular Sheesh Mahal (Hall of Mirrors).',
    history: 'Established in 1592 on Maota Lake hill by Raja Man Singh I.',
    stories: [],
    preservationStatus: { healthScore: 95, threats: ['Tourist congestion'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'Electric shuttle transport & rampart monitoring.', visitorGuidelines: ['Respect mirror hall artwork'] },
    audioGuide: { duration: '4 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Enter the magnificent Ganesh Pol gateway...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabUrl: 'https://sketchfab.com/search?type=models&q=Amer+Fort+India'
  },

  'jaisalmer-fort': {
    id: 'jaisalmer-fort',
    name: 'Jaisalmer Fort',
    nativeName: 'जैसलमेर किला',
    tagline: 'The Golden Living Citadel of the Thar Desert',
    stateId: 'rajasthan',
    destinationId: 'jaisalmer',
    period: '1156 CE',
    dynasty: 'Bhati Rajput Dynasty',
    ruler: 'Rawal Jaisal',
    architectureStyle: 'Rajput Living Citadel Architecture',
    material: 'Yellow Sandstone',
    unescoYear: 2013,
    location: { city: 'Jaisalmer', state: 'Rajasthan', coordinates: '26.9124° N, 70.9126° E', lat: 26.9124, lng: 70.9126 },
    heroImage: '/images/jaisalmer-fort-hero.jpg',
    galleryImages: [
      '/images/gallery/jaisalmer-1.png',
      '/images/gallery/jaisalmer-2.jpg',
      '/images/gallery/jaisalmer-3.jpg',
      '/images/gallery/jaisalmer-4.png',
      '/images/gallery/jaisalmer-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/jaisalmer-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/jaisalmer-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/jaisalmer-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/jaisalmer-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/jaisalmer-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: "One of the world's few living forts, housing over a quarter of the old city's population.",
    history: 'Founded in 1156 CE on Trikuta Hill along Thar Desert caravan routes.',
    stories: [],
    preservationStatus: { healthScore: 89, threats: ['Water seepage', 'Structural weight'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'Modernizing fort drainage & sewage systems.', visitorGuidelines: ['Use designated heritage walkways'] },
    audioGuide: { duration: '4 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Walk through the golden sandstone bastions...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '6561fb4f292741d29c972aa7f69be30f',
    sketchfabUrl: 'https://sketchfab.com/3d-models/jaisalmer-fort-replica-6561fb4f292741d29c972aa7f69be30f'
  },

  'gol-gumbaz': {
    id: 'gol-gumbaz',
    name: 'Gol Gumbaz',
    nativeName: 'ಗೋಳ ಗುಮ್ಮಟ',
    tagline: 'The Acoustic Whispering Gallery of Bijapur',
    stateId: 'karnataka',
    destinationId: 'vijayapura',
    period: '1656 CE',
    dynasty: 'Adil Shahi Dynasty',
    ruler: 'Sultan Mohammed Adil Shah',
    architectureStyle: 'Deccani Islamic Architecture',
    material: 'Dark Gray Basalt',
    location: { city: 'Vijayapura', state: 'Karnataka', coordinates: '16.8306° N, 75.7360° E', lat: 16.8306, lng: 75.7360 },
    heroImage: '/images/gol-gumbaz-hero.jpg',
    galleryImages: [
      '/images/gallery/gol-gumbaz-1.png',
      '/images/gallery/gol-gumbaz-2.png',
      '/images/gallery/gol-gumbaz-3.png',
      '/images/gallery/gol-gumbaz-4.jpg',
      '/images/gallery/gol-gumbaz-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/gol-gumbaz-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gol-gumbaz-2.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gol-gumbaz-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gol-gumbaz-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/gol-gumbaz-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Houses the second largest dome in pre-modern history, featuring a gallery where whispers echo 11 times.',
    history: 'Completed in 1656 as the tomb of Mohammed Adil Shah by architect Yaqut of Dabul.',
    stories: [],
    preservationStatus: { healthScore: 93, threats: ['Acoustical vandalism'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'Acoustic monitoring & dome masonry sealant.', visitorGuidelines: ['Refrain from loud shouting in whispering gallery'] },
    audioGuide: { duration: '3.5 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Listen to the remarkable 11-fold acoustic echo...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabUrl: 'https://sketchfab.com/search?type=models&q=Gol+Gumbaz+India'
  },

  'meenakshi-temple': {
    id: 'meenakshi-temple',
    name: 'Meenakshi Amman Temple',
    nativeName: 'மீனாட்சி அம்மன் கோவில்',
    tagline: 'The Rainbow Gopuram Sanctuary of Madurai',
    stateId: 'tamil-nadu',
    destinationId: 'madurai',
    period: '1190–1650 CE',
    dynasty: 'Pandyan & Nayak Dynasties',
    ruler: 'King Thirumalai Nayak',
    architectureStyle: 'Late Dravidian Temple Architecture',
    material: 'Granite & Sculpted Stucco Gopurams',
    location: { city: 'Madurai', state: 'Tamil Nadu', coordinates: '9.9195° N, 78.1193° E', lat: 9.9195, lng: 78.1193 },
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [],
    culturalSignificance: 'Encloses 14 towering gopurams decorated with thousands of colorful mythological stucco figures.',
    history: 'Historic epicenter of Madurai, rebuilt and expanded by Thirumalai Nayak in the 17th century.',
    stories: [],
    preservationStatus: { healthScore: 96, threats: ['High daily visitor density'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'Stucco sculpture repainting & herbal conservation.', visitorGuidelines: ['Strict traditional dress code enforced'] },
    audioGuide: { duration: '4.5 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Welcome to the Hall of 1000 Pillars...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabUrl: 'https://sketchfab.com/search?type=models&q=Meenakshi+Temple+India'
  },

  'virupaksha-temple': {
    id: 'virupaksha-temple',
    name: 'Hampi / Vijayanagara Ruins',
    nativeName: 'ಹಂಪಿ ವಿರೂಪಾಕ್ಷ',
    tagline: 'The Boulder Capital of Musical Pillars & Stone Chariots',
    stateId: 'karnataka',
    destinationId: 'hampi',
    period: '1336–1565 CE',
    dynasty: 'Vijayanagara Empire',
    ruler: 'Emperor Krishnadevaraya',
    architectureStyle: 'Vijayanagara Dravidian Architecture',
    material: 'Granite Boulders',
    unescoYear: 1986,
    location: { city: 'Hampi', state: 'Karnataka', coordinates: '15.3350° N, 76.4600° E', lat: 15.3350, lng: 76.4600 },
    heroImage: '/images/hampi-hero.jpg',
    galleryImages: [
      '/images/gallery/hampi-1.jpg',
      '/images/gallery/hampi-2.jpg',
      '/images/gallery/hampi-3.jpg',
      '/images/gallery/hampi-4.jpg',
      '/images/gallery/hampi-5.jpg'
    ],
    imageGallery: [
      { url: '/images/gallery/hampi-1.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hampi-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hampi-3.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hampi-4.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/hampi-5.jpg', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'Sprawling 4,100-hectare UNESCO sanctuary featuring musical pillars, stone chariots, and grand bazaars.',
    history: 'Capital of the Vijayanagara Empire, described by Portuguese traveler Paes as larger and wealthier than Rome.',
    stories: [],
    preservationStatus: { healthScore: 92, threats: ['Structural weathering', 'Encroachment'], digitalScanStatus: 'Complete Sub-millimeter LiDAR Scan', currentInitiatives: 'Hampi World Heritage Area Management Authority oversight.', visitorGuidelines: ['Do not tap the musical pillars'] },
    audioGuide: { duration: '4 min 30 sec', narrator: 'Dr. Radhika Srinivasan', transcript: 'Explore the vast boulder landscape of Vijayanagara...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: 'dfaf413f0ce845a3b798b0bb4079962a',
    sketchfabUrl: 'https://sketchfab.com/3d-models/stone-chariot-in-hampi-india-dfaf413f0ce845a3b798b0bb4079962a'
  },

  'fatehpur-sikri': {
    id: 'fatehpur-sikri',
    name: 'Fatehpur Sikri',
    nativeName: 'फ़तेहपुर सीकरी',
    tagline: 'The Imperial Victory Capital in Red Sandstone',
    stateId: 'uttar-pradesh',
    destinationId: 'agra',
    period: '1571–1585 CE',
    dynasty: 'Mughal Empire',
    ruler: 'Emperor Akbar the Great',
    architectureStyle: 'Syncretic Mughal & Hindu Architecture',
    material: 'Red Sandstone',
    unescoYear: 1986,
    location: { city: 'Fatehpur Sikri', state: 'Uttar Pradesh', coordinates: '27.0945° N, 77.6679° E', lat: 27.0945, lng: 77.6679 },
    heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
    galleryImages: [],
    culturalSignificance: 'Home to Buland Darwaza (54m high gateway of victory), Panch Mahal, and Salim Chishti Dargah.',
    history: 'Built by Akbar as his short-lived royal capital to honor Sufi saint Salim Chishti.',
    stories: [],
    preservationStatus: { healthScore: 93, threats: ['Sandstone erosion'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'Chemical stone washing & Buland Darwaza masonry check.', visitorGuidelines: ['Remove shoes near tomb of Salim Chishti'] },
    audioGuide: { duration: '4 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Stand before the colossal Buland Darwaza...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabUrl: 'https://sketchfab.com/search?type=models&q=Fatehpur+Sikri+India'
  },

  'nalanda-mahavihara': {
    id: 'nalanda-mahavihara',
    name: 'Nalanda Mahavihara',
    nativeName: 'नालंदा महाविहार',
    tagline: 'The Ancient Seat of Global Learning & Monastic Wisdom',
    stateId: 'bihar',
    destinationId: 'nalanda',
    period: '5th Century BCE – 1200 CE',
    dynasty: 'Gupta & Pala Dynasties',
    ruler: 'Emperor Kumaragupta I',
    architectureStyle: 'Ancient Monastic Brick Architecture',
    material: 'Red Clay Bricks & Stucco',
    unescoYear: 2016,
    location: { city: 'Nalanda', state: 'Bihar', coordinates: '25.1357° N, 85.4439° E', lat: 25.1357, lng: 85.4439 },
    heroImage: '/images/nalanda-mahavihara-hero.jpg',
    galleryImages: [
      '/images/gallery/nalanda-1.png',
      '/images/gallery/nalanda-2.jpg',
      '/images/gallery/nalanda-3.png',
      '/images/gallery/nalanda-4.png',
      '/images/gallery/nalanda-5.png'
    ],
    imageGallery: [
      { url: '/images/gallery/nalanda-1.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/nalanda-2.jpg', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/nalanda-3.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/nalanda-4.png', source: 'DHAROHAR Cultural Archive' },
      { url: '/images/gallery/nalanda-5.png', source: 'DHAROHAR Cultural Archive' }
    ],
    culturalSignificance: 'First international residential university in world history, housing 10,000 students and 2,000 teachers.',
    history: 'Flourished for over 700 years until its destruction in 1193; visited by Xuanzang and Faxian.',
    stories: [],
    preservationStatus: { healthScore: 91, threats: ['Brick salt crystallization'], digitalScanStatus: 'Complete 3D Mesh Scanned', currentInitiatives: 'ASI brick conservation & moisture barriers.', visitorGuidelines: ['Walk along designated brick monastery paths'] },
    audioGuide: { duration: '4 min', narrator: 'Dr. Radhika Srinivasan', transcript: 'Walk through the ancient brick stupas and monastic cells...' },
    has3DModel: true,
    threeDStatus: 'available',
    sketchfabId: '351d2dd76fa84bf5b63d9d9a68d1e476',
    sketchfabUrl: 'https://sketchfab.com/3d-models/nalanda-gedige-351d2dd76fa84bf5b63d9d9a68d1e476'
  }
};


export const STATES_DATA: StateData[] = [
  {
    id: 'uttar-pradesh',
    name: 'Uttar Pradesh',
    nativeName: 'उत्तर प्रदेश',
    capital: 'Lucknow',
    tagline: 'The Epitome of Mughal Imperial Symmetry and Awadhi Elegance',
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1600&q=80',
    accentColor: '#D9A441',
    overview: 'Uttar Pradesh represents the peak of symmetrical Mughal palace architecture and marble inlay art. From the white marble Taj Mahal in Agra to the labyrinthine Bara Imambara in Lucknow and Akbar’s victory capital of Fatehpur Sikri.',
    dynasties: ['Mughal Empire (16th–18th Century)', 'Suryavanshi Dynasties', 'Nawabs of Awadh'],
    architecturalHeritage: 'Mughal Symmetrical Architecture characterized by white marble double domes, intricate floral Pietra dura stone inlays, grand red sandstone gateways, and vaulted Awadhi labyrinths.',
    destinations: [
      {
        id: 'agra',
        name: 'Agra',
        nativeName: 'आगरा',
        stateId: 'uttar-pradesh',
        tagline: 'The Heart of Mughal Imperial Grandeur',
        heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
        description: "Positioned on the banks of Yamuna River, Agra is home to the world's most famous white marble mausoleum and red sandstone imperial citadels.",
        historicalContext: 'Served as the main capital of the Mughal Empire under Akbar, Jahangir, and Shah Jahan.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['taj-mahal', 'fatehpur-sikri'],
        geographicHighlight: 'Yamuna River floodplains and Gangetic alluvial plains'
      },
      {
        id: 'lucknow',
        name: 'Lucknow',
        nativeName: 'लखनऊ',
        stateId: 'uttar-pradesh',
        tagline: 'The City of Nawabs & Vaulted Labyrinths',
        heroImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
        description: 'Famous for Awadhi culture, refined poetry, and the gravity-defying vaulted arches of Bara Imambara.',
        historicalContext: 'Capital of the Nawabs of Awadh during the 18th and 19th centuries.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['bara-imambara'],
        geographicHighlight: 'Gomti River basin'
      }
    ]
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu',
    nativeName: 'தமிழ்நாடு',
    capital: 'Chennai',
    tagline: 'The Cradle of Dravidian Temple Splendor & Living Stone Poetry',
    heroImage: '/images/mahabalipuram-hero.jpg',
    accentColor: '#D4A85A',
    overview: 'Tamil Nadu boasts over two millennia of continuous architectural evolution. From the monolithic rock-cut cave rathas of Mahabalipuram to the sky-piercing granite vimanas of Thanjavur and rainbow gopurams of Madurai.',
    dynasties: ['Pallava Dynasty (4th–9th Century)', 'Chola Empire (9th–13th Century)', 'Pandya Dynasty', 'Nayakas of Madurai'],
    architecturalHeritage: 'Dravidian Architecture characterized by pyramidal Vimanas, soaring Gopuram gateways, monolithic rock rathas, and pillared thousand-column Mandapas.',
    destinations: [
      {
        id: 'mahabalipuram',
        name: 'Mahabalipuram (Mamallapuram)',
        nativeName: 'மாமல்லபுரம்',
        stateId: 'tamil-nadu',
        tagline: 'Where Stone Became Story',
        heroImage: '/images/mahabalipuram-hero.jpg',
        description: 'Perched on the Coromandel coast, Mahabalipuram is an open-air museum of 7th- and 8th-century Pallava art.',
        historicalContext: 'Founded as a thriving maritime seaport by the Pallava kings.',
        bestTimeToVisit: 'November to February',
        monumentIds: ['shore-temple'],
        geographicHighlight: 'Coromandel Coastal Shorelines & Granite Rock Outcrops',
        imageGallery: [
          { url: '/images/mahabalipuram-hero.jpg', source: 'DHAROHAR Archives' },
          { url: '/images/gallery/shore-temple-1.png', source: 'DHAROHAR Archives' },
          { url: '/images/gallery/shore-temple-2.png', source: 'DHAROHAR Archives' },
          { url: '/images/gallery/shore-temple-3.jpg', source: 'DHAROHAR Archives' },
          { url: '/images/gallery/shore-temple-4.png', source: 'DHAROHAR Archives' }
        ]
      },
      {
        id: 'thanjavur',
        name: 'Thanjavur',
        nativeName: 'தஞ்சாவூர்',
        stateId: 'tamil-nadu',
        tagline: 'The Great Chola Rice Bowl & Granite Citadel',
        heroImage: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=1200&q=80',
        description: 'The royal capital of the Imperial Cholas, home to the 216-foot Brihadeeswarar Temple.',
        historicalContext: 'Capital of Raja Raja Chola I and Rajendra Chola I.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['brihadeeswarar-temple'],
        geographicHighlight: 'Kaveri River Delta'
      },
      {
        id: 'madurai',
        name: 'Madurai',
        nativeName: 'மதுரை',
        stateId: 'tamil-nadu',
        tagline: 'The Lotus City of Rainbow Gopurams',
        heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        description: 'One of the oldest continuously inhabited cities in the world, centered around Meenakshi Amman Temple.',
        historicalContext: 'Ancient capital of the Pandyan Kings.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['meenakshi-temple'],
        geographicHighlight: 'Vaigai River Plain'
      }
    ]
  },
  {
    id: 'odisha',
    name: 'Odisha',
    nativeName: 'ଓଡ଼ିଶା',
    capital: 'Bhubaneswar',
    tagline: 'The Cosmic Sun Chariots and Sacred Kalinga Temple Deulas',
    heroImage: '/images/konark-hero.jpg',
    accentColor: '#C4943C',
    overview: 'Odisha represents the pristine evolution of Kalinga temple architecture, featuring the colossal 24-wheeled stone sun chariot at Konark.',
    dynasties: ['Eastern Ganga Dynasty (11th-15th Century)', 'Somavamshi Dynasty'],
    architecturalHeritage: 'Kalinga Architecture characterized by curvilinear Rekha Deula towers and pidha deulas.',
    destinations: [
      {
        id: 'konark',
        name: 'Konark',
        nativeName: 'କୋଣାର୍କ',
        stateId: 'odisha',
        tagline: 'The Golden Sands of the Celestial Sun Chariot',
        heroImage: '/images/konark-hero.jpg',
        description: "Coastal sanctuary of the 13th-century Sun Temple designed as Surya's celestial chariot.",
        historicalContext: 'Maritime port for Eastern Ganga merchants.',
        bestTimeToVisit: 'November to February',
        monumentIds: ['konark-sun-temple'],
        geographicHighlight: 'Bay of Bengal Shoreline',
        imageGallery: [
          { url: '/images/konark-hero.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/konark-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/konark-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/konark-4.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/konark-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'telangana',
    name: 'Telangana',
    nativeName: 'తెలంగాణ',
    capital: 'Hyderabad',
    tagline: 'The Minarets of Qutb Shahi Heritage & Deccan Culture',
    heroImage: '/images/charminar-hero.jpg',
    accentColor: '#B85D3B',
    overview: 'Telangana stands as the cultural heart of Deccan architecture, famed for the 48-meter four-minaret arch of Charminar in Hyderabad.',
    dynasties: ['Qutb Shahi Dynasty', 'Asaf Jahi Nizam Empire', 'Kakatiya Dynasty'],
    architecturalHeritage: 'Indo-Islamic Deccani Architecture combining granite strength with stucco filigree.',
    destinations: [
      {
        id: 'hyderabad',
        name: 'Hyderabad',
        nativeName: 'హైదరాబాద్',
        stateId: 'telangana',
        tagline: 'The City of Pearls & Charminar',
        heroImage: '/images/charminar-hero.jpg',
        description: 'Founded in 1591 by Muhammad Quli Qutb Shah, famous for pearls, biryani, and Charminar.',
        historicalContext: 'Capital of the Qutb Shahi and Nizam rulers.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['charminar'],
        geographicHighlight: 'Musi River & Deccan Plateau',
        imageGallery: [
          { url: '/images/gallery/charminar-2.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/charminar-3.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/charminar-6.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/charminar-7.png', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'delhi',
    name: 'Delhi',
    nativeName: 'दिल्ली',
    capital: 'New Delhi',
    tagline: 'The Palimpsest of Seven Empires and Soaring Minarets',
    heroImage: '/images/india-gate-hero.jpg',
    accentColor: '#D15A5A',
    overview: 'Delhi has served as the capital of seven continuous historical empires, containing 73-meter brick minarets, red sandstone palaces, and modern memorials.',
    dynasties: ['Delhi Sultanate', 'Mughal Empire', 'British Colonial Era'],
    architecturalHeritage: 'Indo-Islamic, Mughal Fortified, and Neoclassical Triumphal Arch Architecture.',
    destinations: [
      {
        id: 'new-delhi',
        name: 'New Delhi',
        nativeName: 'नई दिल्ली',
        stateId: 'delhi',
        tagline: 'The Capital City of Triumphal Arches',
        heroImage: '/images/india-gate-hero.jpg',
        description: 'Designed by Lutyens and Baker, housing India Gate and the Lotus Temple.',
        historicalContext: 'Inaugurated as national capital in 1931.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['india-gate', 'lotus-temple'],
        geographicHighlight: 'Yamuna Basin & Rajpath',
        imageGallery: [
          { url: '/images/gallery/india-gate-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/india-gate-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/india-gate-3.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/india-gate-4.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/india-gate-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      },
      {
        id: 'old-delhi',
        name: 'Old Delhi (Shahjahanabad)',
        nativeName: 'पुरानी दिल्ली',
        stateId: 'delhi',
        tagline: 'The Red Sandstone Citadel of Shah Jahan',
        heroImage: '/images/red-fort-hero.jpg',
        description: 'Historic walled city of Shahjahanabad, housing the Red Fort.',
        historicalContext: 'Mughal imperial capital from 1638 to 1857.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['red-fort'],
        geographicHighlight: 'Chandni Chowk & Yamuna',
        imageGallery: [
          { url: '/images/gallery/red-fort-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/red-fort-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/red-fort-3.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/red-fort-4.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/red-fort-5.jpg', source: 'DHAROHAR Cultural Archive' }
        ]
      },
      {
        id: 'mehrauli',
        name: 'Mehrauli',
        nativeName: 'महरौली',
        stateId: 'delhi',
        tagline: 'The First City of the Sultanate',
        heroImage: 'https://images.unsplash.com/photo-1545232979-fbf30fe367c5?auto=format&fit=crop&w=1200&q=80',
        description: 'Oldest fortified zone of Delhi, home to the Qutub Minar complex.',
        historicalContext: 'Seat of Mamluk Sultan Qutb-ud-din Aibak.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['qutb-minar'],
        geographicHighlight: 'Aravalli Ridge'
      }
    ]
  },
  {
    id: 'maharashtra',
    name: 'Maharashtra',
    nativeName: 'महाराष्ट्र',
    capital: 'Mumbai',
    tagline: 'The Deccan Basalt Caves & Waterfront Gateways',
    heroImage: '/images/gateway-of-india-hero.jpg',
    accentColor: '#D47B3A',
    overview: 'Maharashtra spans from the basaltic cliff excavations of Ajanta and Ellora to the coastal Saracenic arch of Gateway of India in Mumbai.',
    dynasties: ['Rashtrakuta Dynasty', 'Satavahana Empire', 'Vakataka Dynasty', 'Maratha Empire'],
    architecturalHeritage: 'Monolithic Rock-Cut Cave Excavations and Indo-Saracenic Basalt Architecture.',
    destinations: [
      {
        id: 'mumbai',
        name: 'Mumbai',
        nativeName: 'मुंबई',
        stateId: 'maharashtra',
        tagline: 'The Financial Gateway of India',
        heroImage: '/images/gateway-of-india-hero.jpg',
        description: 'Port metropolis on the Arabian Sea, home to Gateway of India.',
        historicalContext: 'Key colonial trading harbor of the Western coast.',
        bestTimeToVisit: 'November to February',
        monumentIds: ['gateway-of-india'],
        geographicHighlight: 'Arabian Sea Shoreline',
        imageGallery: [
          { url: '/images/gallery/gateway-1.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gateway-2.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gateway-3.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gateway-4.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gateway-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      },
      {
        id: 'chhatrapati-sambhajinagar',
        name: 'Chhatrapati Sambhajinagar',
        nativeName: 'छत्रपती संभाजीनगर',
        stateId: 'maharashtra',
        tagline: 'The Cave Capital of Ajanta & Ellora',
        heroImage: '/images/ellora-caves-hero.jpg',
        description: 'Gateway to UNESCO world heritage cave sanctuaries of Ellora and Ajanta.',
        historicalContext: 'Medieval seat of Rashtrakuta and Yadava rulers.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['ellora-caves', 'ajanta-caves'],
        geographicHighlight: 'Deccan Basalt Plateau',
        imageGallery: [
          { url: '/images/gallery/ellora-1.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/ellora-2.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/ellora-3.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/ellora-4.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/ellora-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'karnataka',
    name: 'Karnataka',
    nativeName: 'ಕರ್ನಾಟಕ',
    capital: 'Bengaluru',
    tagline: 'The Golden City of Vijayanagara & Whispering Domes',
    heroImage: '/images/mysore-palace-hero.jpg',
    accentColor: '#B58A52',
    overview: 'From the dramatic boulder hills of Hampi to the pink-domed Mysore Palace and the acoustic whispering dome of Gol Gumbaz in Bijapur.',
    dynasties: ['Vijayanagara Empire (1336–1646 CE)', 'Wadiyar Dynasty', 'Adil Shahi Sultanate'],
    architecturalHeritage: 'Vijayanagara Dravidian Granite Style, Indo-Saracenic Royal Palace Architecture, and Deccani Islamic Domes.',
    destinations: [
      {
        id: 'mysore',
        name: 'Mysore (Mysuru)',
        nativeName: 'ಮೈಸೂರು',
        stateId: 'karnataka',
        tagline: 'The Royal Cultural Capital of Karnataka',
        heroImage: '/images/mysore-palace-hero.jpg',
        description: 'Famous for Mysore Palace, silk sarees, and Dasara celebrations.',
        historicalContext: 'Capital of the Wadiyar dynasty.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['mysore-palace'],
        geographicHighlight: 'Chamundi Hills Foothills',
        imageGallery: [
          { url: '/images/gallery/mysore-1.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/mysore-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/mysore-3.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/mysore-4.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/mysore-5.jpg', source: 'DHAROHAR Cultural Archive' }
        ]
      },
      {
        id: 'vijayapura',
        name: 'Vijayapura (Bijapur)',
        nativeName: 'ವಿಜಯಪುರ',
        stateId: 'karnataka',
        tagline: 'The Citadel of Gol Gumbaz',
        heroImage: '/images/gol-gumbaz-hero.jpg',
        description: 'Deccan city famous for the 11-fold acoustic echoing dome of Gol Gumbaz.',
        historicalContext: 'Capital of the Adil Shahi Sultanate.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['gol-gumbaz'],
        geographicHighlight: 'Deccan Plains',
        imageGallery: [
          { url: '/images/gallery/gol-gumbaz-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gol-gumbaz-2.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gol-gumbaz-3.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gol-gumbaz-4.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/gol-gumbaz-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      },
      {
        id: 'hampi',
        name: 'Hampi (Vijayanagara)',
        nativeName: 'ಹಂಪಿ',
        stateId: 'karnataka',
        tagline: 'The Empire of Stone Chariots & Musical Pillars',
        heroImage: '/images/hampi-hero.jpg',
        description: '4,100-hectare UNESCO sanctuary of Vijayanagara temples.',
        historicalContext: 'Capital of the Vijayanagara Empire.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['virupaksha-temple'],
        geographicHighlight: 'Tungabhadra River Basin',
        imageGallery: [
          { url: '/images/gallery/hampi-1.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/hampi-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/hampi-3.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/hampi-4.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/hampi-5.jpg', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'gujarat',
    name: 'Gujarat',
    nativeName: 'ગુજરાત',
    capital: 'Gandhinagar',
    tagline: 'The Subterranean Stepwells & Maru-Gurjara Craft',
    heroImage: '/images/rani-ki-vav-hero.jpg',
    accentColor: '#E09F3E',
    overview: 'Gujarat features the UNESCO subterranean stepwell Rani Ki Vav in Patan, built by Queen Udayamati with over 500 sculpted stone panels.',
    dynasties: ['Chaulukya (Solanki) Dynasty', 'Maitrakas of Vallabhi'],
    architecturalHeritage: 'Maru-Gurjara Subterranean Stepwell Architecture.',
    destinations: [
      {
        id: 'patan',
        name: 'Patan',
        nativeName: 'પાટણ',
        stateId: 'gujarat',
        tagline: 'The Subterranean Capital of Stepwells',
        heroImage: '/images/rani-ki-vav-hero.jpg',
        description: 'Ancient Solanki capital housing Rani Ki Vav stepwell.',
        historicalContext: 'Capital of the Solanki rulers of Gujarat.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['rani-ki-vav'],
        geographicHighlight: 'Saraswati River Plain',
        imageGallery: [
          { url: '/images/gallery/rani-ki-vav-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/rani-ki-vav-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/rani-ki-vav-3.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/rani-ki-vav-4.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/rani-ki-vav-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'west-bengal',
    name: 'West Bengal',
    nativeName: 'পশ্চিমবঙ্গ',
    capital: 'Kolkata',
    tagline: 'The Cultural & Architectural Marvels of the East',
    heroImage: '/images/victoria-memorial-hero.jpg',
    accentColor: '#3A86C8',
    overview: 'West Bengal showcases the white marble Renaissance splendor of Victoria Memorial in Kolkata amidst lush gardens and cultural history.',
    dynasties: ['Pala Dynasty', 'Sena Dynasty', 'Nawabs of Bengal', 'British Colonial Era'],
    architecturalHeritage: 'Indo-Saracenic & Classical Renaissance Revival Architecture.',
    destinations: [
      {
        id: 'kolkata',
        name: 'Kolkata',
        nativeName: 'কলকাতা',
        stateId: 'west-bengal',
        tagline: 'The City of Joy & Marble Palaces',
        heroImage: '/images/victoria-memorial-hero.jpg',
        description: 'Cultural capital of India, home to Victoria Memorial.',
        historicalContext: 'Capital of British India until 1911.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['victoria-memorial'],
        geographicHighlight: 'Hooghly River Bank',
        imageGallery: [
          { url: '/images/gallery/victoria-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/victoria-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/victoria-3.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/victoria-4.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/victoria-5.jpg', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh',
    nativeName: 'मध्य प्रदेश',
    capital: 'Bhopal',
    tagline: 'The Heartland of Ancient Buddhist Domes & Stupas',
    heroImage: '/images/sanchi-stupa-hero.jpg',
    accentColor: '#9B51E0',
    overview: 'Madhya Pradesh houses India’s oldest stone structure: the Great Stupa at Sanchi, commissioned by Emperor Ashoka in the 3rd century BCE.',
    dynasties: ['Maurya Empire', 'Shunga & Satavahana Dynasties', 'Chandela Dynasty'],
    architecturalHeritage: 'Ancient Buddhist Stupa and Torana Gateway Architecture.',
    destinations: [
      {
        id: 'sanchi',
        name: 'Sanchi',
        nativeName: 'सांची',
        stateId: 'madhya-pradesh',
        tagline: 'The Cosmic Stupa Sanctuary of Ashoka',
        heroImage: '/images/sanchi-stupa-hero.jpg',
        description: 'Hillside Buddhist sanctuary containing the Great Stupa.',
        historicalContext: 'Commissioned by Emperor Ashoka the Great.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['sanchi-stupa'],
        geographicHighlight: 'Betwa River Valley',
        imageGallery: [
          { url: '/images/gallery/sanchi-1.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/sanchi-2.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/sanchi-3.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/sanchi-4.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/sanchi-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'rajasthan',
    name: 'Rajasthan',
    nativeName: 'राजस्थान',
    capital: 'Jaipur',
    tagline: 'The Land of Desert Fortresses, Mirror Palaces and Jharokhas',
    heroImage: '/images/hawa-mahal-hero.jpg',
    accentColor: '#E07C30',
    overview: 'Rajasthan represents the apex of thermodynamic architecture and hilltop fort military planning, from Jaipur’s Hawa Mahal and Amer Fort to Jaisalmer’s Golden Living Citadel.',
    dynasties: ['Kachwaha Rajput Dynasty', 'Bhati Rajput Dynasty', 'Mewar & Rathore Dynasties'],
    architecturalHeritage: 'Rajput Fortification, Belgian Mirror Halls (Sheesh Mahal), and Jharokha screens.',
    destinations: [
      {
        id: 'jaipur',
        name: 'Jaipur (Pink City)',
        nativeName: 'जयपुर',
        stateId: 'rajasthan',
        tagline: 'The Astronomical Wonder and Pink Citadel',
        heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        description: 'Vastu-planned city containing Hawa Mahal and Amer Fort.',
        historicalContext: 'Founded by Sawai Jai Singh II in 1727.',
        bestTimeToVisit: 'November to February',
        monumentIds: ['hawa-mahal', 'amber-fort'],
        geographicHighlight: 'Aravalli Hills'
      },
      {
        id: 'jaisalmer',
        name: 'Jaisalmer',
        nativeName: 'जैसलमेर',
        stateId: 'rajasthan',
        tagline: 'The Golden Citadel of the Thar Desert',
        heroImage: '/images/jaisalmer-fort-hero.jpg',
        description: 'Living sandstone fort rising out of the Thar desert sands.',
        historicalContext: 'Founded by Rawal Jaisal in 1156 CE.',
        bestTimeToVisit: 'November to February',
        monumentIds: ['jaisalmer-fort'],
        geographicHighlight: 'Thar Desert Sand Dunes',
        imageGallery: [
          { url: '/images/gallery/jaisalmer-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/jaisalmer-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/jaisalmer-3.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/jaisalmer-4.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/jaisalmer-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  },
  {
    id: 'bihar',
    name: 'Bihar',
    nativeName: 'बिहार',
    capital: 'Patna',
    tagline: 'The Ancient Cradle of Global Learning & Monastic Mahaviharas',
    heroImage: '/images/nalanda-mahavihara-hero.jpg',
    accentColor: '#27AE60',
    overview: 'Bihar houses the ancient Nalanda Mahavihara, the world’s first residential international university flourishing from the 5th century CE.',
    dynasties: ['Gupta Empire', 'Pala Dynasty', 'Maurya Empire'],
    architecturalHeritage: 'Ancient Monastic Red Brick Stupa Architecture.',
    destinations: [
      {
        id: 'nalanda',
        name: 'Nalanda',
        nativeName: 'नालंदा',
        stateId: 'bihar',
        tagline: 'The Ancient Mahavihara Seat of Knowledge',
        heroImage: '/images/nalanda-mahavihara-hero.jpg',
        description: 'Ancient university complex featuring red brick stupas and monastic cells.',
        historicalContext: 'Established under Gupta Emperor Kumaragupta I.',
        bestTimeToVisit: 'October to March',
        monumentIds: ['nalanda-mahavihara'],
        geographicHighlight: 'Gangetic Plains',
        imageGallery: [
          { url: '/images/gallery/nalanda-1.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/nalanda-2.jpg', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/nalanda-3.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/nalanda-4.png', source: 'DHAROHAR Cultural Archive' },
          { url: '/images/gallery/nalanda-5.png', source: 'DHAROHAR Cultural Archive' }
        ]
      }
    ]
  }
];


export const HERITAGE_TRAILS: HeritageTrail[] = [
  {
    id: 'pallava-architecture-trail',
    title: 'The Pallava Shore & Monolithic Trail',
    subtitle: 'From Structural Pyramids to Experimental Chariots',
    region: 'Tamil Nadu • Mahabalipuram',
    duration: '2 Hours',
    difficulty: 'Easy',
    distance: '3.5 km',
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    theme: 'Early Structural Masonry & Rock Bas-Reliefs',
    description: 'Walk through Mamallapuram’s golden Pallava-period monuments. Observe how master sculptors moved from carving rock outcrops to building freestanding granite towers facing the sea.',
    stops: [
      {
        monumentId: 'shore-temple',
        name: 'Shore Temple Complex',
        order: 1,
        durationMinutes: 45,
        keyHighlight: 'Examine the early structural dressed granite blocks and the ocean breakwater',
        audioTrackTitle: 'Track 1: Morning Light on the Dravidian Vimana',
        tipForVisitor: 'Best visited at 6:30 AM to catch the sunrise directly illuminating the eastern Shiva lingam'
      },
      {
        monumentId: 'pancha-rathas',
        name: "Arjuna's Penance (Descent of the Ganga)",
        order: 2,
        durationMinutes: 30,
        distanceFromPrevious: '900m walk through Casuarina avenues',
        keyHighlight: 'World’s largest open-air relief with over 100 celestial beings and life-size elephants',
        audioTrackTitle: 'Track 2: The Flow of the Celestial River in Stone',
        tipForVisitor: 'Look closely at the central cleft where natural rainwater simulates the descending Ganga'
      },
      {
        monumentId: 'pancha-rathas',
        name: 'Pancha Rathas (Five Chariots)',
        order: 3,
        durationMinutes: 40,
        distanceFromPrevious: '1.2 km walk southward',
        keyHighlight: 'Compare the 5 distinct experimental Dravidian roof styles carved from pink granite mounds',
        audioTrackTitle: 'Track 3: The King’s Monolithic Laboratory',
        tipForVisitor: 'Walk clockwise around Dharmaraja Ratha to observe King Narasimhavarman’s royal portrait inscriptions'
      }
    ],
    historicalNarrative: 'In the 7th century, King Mahendravarman I proudly inscribed: "This temple was made without bricks, timber, metals, or mortar." Under his son Mamalla and great-grandson Rajasimha, this trail captures humanity’s boldest leap into lasting stone architecture.'
  },
  {
    id: 'vijayanagara-splendor-trail',
    title: 'Vijayanagara Sacred & Royal Trail',
    subtitle: 'Along the Boulders of Tungabhadra and Acoustic Halls',
    region: 'Karnataka • Hampi',
    duration: '2 Hours 30 Min',
    difficulty: 'Moderate',
    distance: '3.8 km',
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010e4210d63?auto=format&fit=crop&w=1200&q=80',
    theme: 'Sacred Geography & High Medieval Metallurgy & Acoustics',
    description: 'Explore the sacred axis linking continuous 1300-year devotion at Virupaksha with the acoustic wonder of Vittala Temple along the ancient riverside bazaar colonnades.',
    stops: [
      {
        monumentId: 'virupaksha-temple',
        name: 'Virupaksha Temple Complex',
        order: 1,
        durationMinutes: 45,
        keyHighlight: 'Observe the medieval camera obscura inverted shadow and active temple elephant blessings',
        audioTrackTitle: 'Track 1: Chants Across 13 Centuries',
        tipForVisitor: 'Visit the rear corridor at 11:00 AM when the inverted shadow is crispest'
      },
      {
        monumentId: 'vittala-temple',
        name: 'Kampa Bhupa’s Riverside Path & Achyutaraya Temple',
        order: 2,
        durationMinutes: 40,
        distanceFromPrevious: '1.5 km scenic boulder trail',
        keyHighlight: 'Sule Bazaar and dramatic views of Matanga Hill',
        audioTrackTitle: 'Track 2: The Wealth of the Global Diamond Bazaars',
        tipForVisitor: 'Wear comfortable walking shoes with good grip on granite stones'
      },
      {
        monumentId: 'vittala-temple',
        name: 'Vittala Temple & Stone Chariot',
        order: 3,
        durationMinutes: 65,
        distanceFromPrevious: '1.2 km riverside trail',
        keyHighlight: 'The 56 SaReGaMa musical pillars and the iconic Garuda stone chariot',
        audioTrackTitle: 'Track 3: The Harmonic Resonances of Vijayanagara',
        tipForVisitor: 'Listen to the acoustic audio demonstration on your digital guide'
      }
    ],
    historicalNarrative: 'Vijayanagara’s kings built an empire where nature, religion, and urban power merged into an invincible boulder city praised by Persian, Italian, and Russian emissaries.'
  },
  {
    id: 'rajput-astronomical-trail',
    title: 'The Rajput Cosmic & Fortification Trail',
    subtitle: 'From Honeycombed Breezes to Aravalli Mountain Bastions',
    region: 'Rajasthan • Jaipur',
    duration: '2 Hours',
    difficulty: 'Easy',
    distance: '11 km (Drive + Walking)',
    heroImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    theme: 'Thermodynamic Architecture & Hilltop Military Strategy',
    description: 'Discover how Rajput rulers mastered desert thermodynamics at Hawa Mahal, mapped the cosmos, and established impregnable fortified palaces in the Aravalli hills.',
    stops: [
      {
        monumentId: 'hawa-mahal',
        name: 'Hawa Mahal (Palace of Winds)',
        order: 1,
        durationMinutes: 35,
        keyHighlight: 'Stand behind the 953 jharokhas and experience the passive cooling breeze',
        audioTrackTitle: 'Track 1: Honeycombs in Pink Sandstone',
        tipForVisitor: 'Visit in the early morning for optimal sunlight illumination across the eastern facade'
      },
      {
        monumentId: 'amber-fort',
        name: 'Amber Fort & Sheesh Mahal',
        order: 2,
        durationMinutes: 85,
        distanceFromPrevious: '10.5 km via historic Delhi-Jaipur highway',
        keyHighlight: 'Gaze into the thousands of imported Belgian concave mirrors in the Hall of Mirrors',
        audioTrackTitle: 'Track 2: The Starry Heavens of Amber',
        tipForVisitor: 'Hire an audio guide or use DHAROHAR 3D scanner at the Maota Lake pavilion'
      }
    ],
    historicalNarrative: 'Combining Rajput valor with Mughal administrative sophistication, Maharaja Sawai Jai Singh and his architects turned Jaipur into an urban symphony of mathematics, astronomy, and stone.'
  }
];

export const AI_CULTURAL_KNOWLEDGE_BASE = [
  {
    topic: 'Shore Temple 3D & Architecture',
    keywords: ['shore temple', 'vimana', 'pallava', 'mahabalipuram', 'mamallapuram', 'granite', 'stone', 'tsunami'],
    title: 'The Architectural Genius of the Shore Temple',
    summary: 'The Shore Temple at Mahabalipuram (700–728 CE) marks the definitive shift in Indian architecture from rock-cut cave temples to structural stone masonry. Built from carved granitic gneiss blocks by Pallava King Narasimhavarman II Rajasimha, it houses three distinct sanctums.',
    details: [
      'The main eastern Vimana rises 60 feet in a stepped pyramid towards an octagonal shikhara finial.',
      'Unlike later Dravidian temples with giant entrance gopurams, in early Pallava architecture the sanctum Vimana tower itself was the towering focal point.',
      'The inner sanctum features a 16-sided fluted basalt Dharalinga and the iconic Somaskanda family panel of Shiva, Parvati, and infant Skanda.',
      'During the 2004 Indian Ocean Tsunami, receding sea waters temporarily revealed submerged stone structures and lion carvings, verifying ancient legends of the "Seven Pagodas".'
    ],
    deepDivePrompt: 'Would you like to inspect the 3D model hotspots or hear about the sacrificial clay preservation method used to extract salt crystals?'
  },
  {
    topic: 'Musical Pillars of Hampi',
    keywords: ['musical', 'pillars', 'vittala', 'hampi', 'sound', 'saregama', 'acoustics', 'granite'],
    title: 'The Acoustic Marvel of the 56 SaReGaMa Columns',
    summary: 'In the Maha Mandapa of Vittala Temple (Hampi), 56 monolithic granite pillars are sculpted with clusters of slender auxiliary colonnettes. When tapped gently, each sub-pillar emits specific acoustic musical frequencies corresponding to Indian classical swaras.',
    details: [
      'Geological analysis shows varying densities of silica and iron ore deposits within the single granite boulders were intentionally selected by 16th-century sculptors.',
      'Pillars are divided into percussion pillars (emitting Mridangam-like beats) and melodic pillars (emitting flute and bell tones).',
      'The British colonial government cut open two pillars in disbelief to check for internal hollow bronze chambers, finding only homogeneous solid rock.'
    ],
    deepDivePrompt: 'Would you like to explore the Vijayanagara Heritage Trail or examine the Stone Chariot’s astronomical alignments?'
  },
  {
    topic: 'Venturi Cooling Effect in Hawa Mahal',
    keywords: ['hawa mahal', 'cooling', 'jharokha', 'jaipur', 'rajput', 'wind', 'temperature'],
    title: 'Ancient Climate Engineering at Hawa Mahal',
    summary: 'Built in 1799 by Maharaja Sawai Pratap Singh, Hawa Mahal is a five-story thermodynamic structure that stays cool in 45°C Rajasthani summers without electricity.',
    details: [
      'The 953 jharokha casements utilize the Venturi principle: forcing hot wind through constricted apertures drops its pressure and temperature.',
      'Interior water fountains and wet Khus grass mats further drop ambient temperature by up to 8°C through evaporative cooling.',
      'The structure is only one room thick on the top three floors, acting as a lightweight cooling screen.'
    ],
    deepDivePrompt: 'Would you like to see how Rajput fortresses compared with Mughal garden tombs in thermal comfort?'
  },
  {
    topic: 'Preservation & Digital Twins in India',
    keywords: ['preservation', 'lidar', 'scan', 'asi', 'protect', 'threats', 'salt', 'damage'],
    title: 'DHAROHAR Digital Preservation Framework',
    summary: 'India’s archaeological monuments face modern challenges including atmospheric pollution, saline crystallization, seismic activity, and high tourist volume. Digital twin preservation creates permanent millimetric 3D archives.',
    details: [
      'Terrestrial LiDAR scanning captures up to 2 million spatial coordinates per second with sub-millimeter precision.',
      'Sacrificial paper-pulp clay packs extract deeply embedded marine salts from coastal granite without mechanical abrasion.',
      'Digital preservation ensures that even in the event of natural disasters, precise structural restorations can be faithfully executed.'
    ],
    deepDivePrompt: 'Would you like to read the Responsible Visitor Code or generate a personalized heritage exploration itinerary?'
  }
];
