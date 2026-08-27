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
  ],
  'arjunas-penance': [
    {
      id: 'central-fissure',
      name: 'The River Ganga Fissure',
      shortDescription: 'Natural cleft between two boulders representing the celestial descent of River Ganga from the heavens.',
      historicalSignificance: 'Used by 7th-century Pallava engineers as a functional water channel during festivals and rainstorms.',
      architecturalSignificance: 'Carved with flowing serpent gods (Nagas and Naginis) swimming upwards toward the descending waters.',
      story: 'Legend says water collected in a hilltop tank flowed down this gap, giving the illusion of a living river falling from Shiva’s locks.',
      position: [0, 2.0, 0]
    },
    {
      id: 'elephant-herd',
      name: 'Life-Sized Elephant Herd',
      shortDescription: 'Remarkable life-sized bull elephant and cow with playful baby calves walking toward the sacred river.',
      historicalSignificance: 'Considered one of the finest naturalistic animal sculptures in ancient Indian art history.',
      architecturalSignificance: 'Carved with anatomical precision on the lower right monolith, using the natural curve of the granite rock face.',
      story: 'Notice the little baby elephants playing between the legs of their mother, showing the Pallava sculptors’ deep love of nature.',
      position: [2.5, 0.8, 1.2]
    },
    {
      id: 'ascetic-shiva',
      name: 'Arjuna / Bhagiratha & Lord Shiva',
      shortDescription: 'Relief depicting the emaciated ascetic standing on one leg with hands raised in intense penance beside Lord Shiva.',
      historicalSignificance: 'Central focal point of the relief illustrating devotion, austerity, and divine blessing.',
      architecturalSignificance: 'Lord Shiva is shown granting boon with his right hand while holding his trident (Trishula).',
      story: 'Debated by scholars for centuries: Is it Arjuna praying for the Pasupata weapon, or Bhagiratha bringing down the river Ganga?',
      position: [-1.8, 2.2, 0.5]
    },
    {
      id: 'vishnu-shrine',
      name: 'Miniature Dravidian Vishnu Shrine',
      shortDescription: 'Small carved shrine at the base housing Lord Vishnu with worshipping saints and disciples below.',
      historicalSignificance: 'Early prototype of Dravidian temple architecture carved directly into the rock face.',
      architecturalSignificance: 'Features a curved barrel-vaulted roof (Kuta) supported by miniature pilasters.',
      story: 'Devotees and ascetics gather around the shrine, representing the harmony between divine worship and worldly life.',
      position: [-1.2, 0.9, 0.2]
    },
    {
      id: 'cat-penance',
      name: 'The Cat’s Fake Penance (Satirical Relief)',
      shortDescription: 'Whimsical relief of a cat standing on one leg imitating Arjuna’s penance while mice play unsuspectingly at its feet.',
      historicalSignificance: 'Demonstrates the rich sense of humor and satire embedded in ancient Pallava rock art.',
      architecturalSignificance: 'Carved near the elephant’s feet as a lighthearted commentary on hypocritical devotion.',
      story: 'The cat pretends to meditate like a saint to trick the naive mice into coming close so it can pounce!',
      position: [1.8, 0.5, 0.8]
    }
  ],
  'meenakshi-temple': [
    {
      id: 'west-gopuram',
      name: 'Nine-Tiered West Gopuram (170ft)',
      shortDescription: 'The tallest multi-colored gateway tower (170ft) adorned with 1,511 intricate polychrome statues.',
      historicalSignificance: 'Rebuilt by Viswanatha Nayak in 1559 CE as the primary ceremonial gateway facing the historic city center.',
      architecturalSignificance: 'Layered Dravidian pyramid construction featuring vivid stucco sculptures of Puranic legends, celestial dancers, and guardian deities.',
      story: 'Legend says master sculptors painted each statue with natural plant dyes mixed with herbs that retained brilliance for centuries.',
      position: [0, 3.5, 3.0]
    },
    {
      id: 'golden-lotus-tank',
      name: 'Potramarai Kulam (Golden Lotus Tank)',
      shortDescription: 'Sacred rectangular temple reservoir featuring a central golden brass lotus sculpture.',
      historicalSignificance: 'The ancient meeting ground of the Tamil Sangam literary academy where legendary poets evaluated classic literature.',
      architecturalSignificance: 'Surrounded by granite pillared corridors displaying historic Nayak period fresco murals illustrating the 64 miracles of Shiva (Thiruvilaiyadal).',
      story: 'Ancient tradition held that manuscripts placed in the sacred water would float if grammatically flawless, but sink if flawed.',
      position: [0, 0.5, -2.0]
    },
    {
      id: 'thousand-pillar-hall',
      name: 'Hall of 1,000 Pillars (Aayiram Kaal Mandapam)',
      shortDescription: 'Monumental pillared assembly hall housing 985 exquisitely carved granite columns and the Art Museum.',
      historicalSignificance: 'Engineered in 1569 CE by Ariyanatha Mudaliar, prime minister of Madurai Nayak Kingdom.',
      architecturalSignificance: 'Pillars are sculpted with life-sized figures of Yali lion-monsters, warrior knights on horseback, and musical resonance pillars.',
      story: 'Tapping specific granite pillars in the hall yields musical tones corresponding to the classic Indian saptaswara scale.',
      position: [2.5, 1.2, 0]
    },
    {
      id: 'meenakshi-sanctum',
      name: 'Garbhagriha of Goddess Meenakshi',
      shortDescription: 'The inner sanctum enshrining the green granite idol of Goddess Meenakshi holding a royal parrot.',
      historicalSignificance: 'The principal shrine of Madurai, worshiped continuously for over two millennia as the divine queen of the city.',
      architecturalSignificance: 'Crowned by a gilded shrine dome and surrounded by heavy granite prakara walls.',
      story: 'Every evening, an ornate golden palanquin procession carries the idol of Lord Sundareswarar to Meenakshi’s shrine in a grand nocturnal ritual.',
      position: [-1.8, 1.5, 0.5]
    },
    {
      id: 'golden-vimana',
      name: 'Gold-Plated Ananda Vimanam',
      shortDescription: 'The pure gold-sheathed Cella dome towering above the sanctum sanctorum of Lord Sundareswarar.',
      historicalSignificance: 'Gilded by Pandya and Nayak rulers to signify imperial patronage and spiritual sovereignty.',
      architecturalSignificance: 'Encased in gold plates displaying carved relief images of the 32 forms of Lord Shiva.',
      story: 'Devotees believe looking at the golden peak of the Ananda Vimana bestows blessings equal to visiting sacred mountain peaks.',
      position: [-0.8, 3.0, -0.8]
    }
  ],
  'virupaksha-temple': [
    {
      id: 'bistappayya-gopuram',
      name: '165-Foot East Raya Gopuram',
      shortDescription: 'Nine-tiered gateway tower built in 1510 CE by Emperor Krishnadevaraya to celebrate his coronation.',
      historicalSignificance: 'Stands as the primary entrance facing the 1km long ancient Hampi Bazaar avenue.',
      architecturalSignificance: 'Constructed with a heavy granite stone base supporting nine stepped plaster and brick upper tiers crowned by a barrel-vaulted roof.',
      story: 'Renovated in 1510 CE, the gopuram survived the 1565 sack of Vijayanagara and remains fully intact today.',
      position: [0, 3.2, 2.8]
    },
    {
      id: 'pinhole-camera-obscura',
      name: 'Inverted Shadow Pinhole Chamber',
      shortDescription: 'Medieval optical phenomenon where a wall aperture projects an inverted shadow of the 165ft gopuram.',
      historicalSignificance: 'Engineered by 16th-century Vijayanagara architects demonstrating advanced understanding of optics and light ray refraction.',
      architecturalSignificance: 'Located in the dark rear sanctum corridor facing the western courtyard.',
      story: 'Visitors gather daily around 11 AM when sunlight strikes the outer tower, casting a perfectly crisp inverted silhouette on the inner plaster wall.',
      position: [-1.5, 1.2, -1.8]
    },
    {
      id: 'ranga-mandapa',
      name: 'Krishnadevaraya Ranga Mandapa',
      shortDescription: 'Grand 100-pillared coronation hall decorated with 16th-century ceiling frescoes depicting puranic legends.',
      historicalSignificance: 'Built by Krishnadevaraya in 1510 CE to mark his accession to the throne of Vijayanagara.',
      architecturalSignificance: 'Granite pillars sculpted with Yali lion riders and mythic warriors supporting timber ceiling frames painted with mineral dyes.',
      story: 'The ceiling panel depicts Lord Shiva’s wedding procession and the ten avatars of Lord Vishnu.',
      position: [1.8, 1.0, 0.5]
    },
    {
      id: 'pampa-sanctum',
      name: 'Sanctum Sanctorum of Lord Virupaksha',
      shortDescription: 'The 7th-century rock shrine enshrining the ancient Shiva Lingam and Goddess Pampa Devi.',
      historicalSignificance: 'One of the oldest continuously worshiped shrines in India, preceding the Vijayanagara Empire by over 600 years.',
      architecturalSignificance: 'Heavy dark granite garbhagriha surrounded by narrow, candle-lit ambulatory cloisters.',
      story: 'Legend says Goddess Pampa performed severe penance on Hemakuta Hill to win the hand of Lord Shiva as Virupaksha.',
      position: [-0.5, 0.8, -0.2]
    },
    {
      id: 'hampi-bazaar',
      name: 'Pampa Patha & Hampi Bazaar Avenue',
      shortDescription: '1km long double-story stone colonnade where medieval traders exchanged diamonds, silk, and spices.',
      historicalSignificance: 'Described by Portuguese traveler Domingos Paes as one of the busiest trade avenues in the 16th-century world.',
      architecturalSignificance: 'Monolithic granite double-tier pillared pavilions extending eastwards from the main gopuram.',
      story: 'During annual temple festivals, giant wooden chariot cars (Rathas) are pulled along this wide stone boulevard by thousands of devotees.',
      position: [2.8, 0.5, 3.5]
    }
  ],
  'vittala-temple': [
    {
      id: 'stone-chariot',
      name: 'Garuda Monolithic Stone Chariot',
      shortDescription: 'World-famous monolithic granite shrine carved in the shape of a sacred procession chariot.',
      historicalSignificance: 'Commissioned by Emperor Krishnadevaraya in 1513 CE after his victory over the Gajapati kingdom of Odisha.',
      architecturalSignificance: 'Composed of giant granite blocks so precisely interlocked that seams are invisible; features revolving granite wheels.',
      story: 'Legend holds that the stone chariot once possessed magical powers and moving its wheels would bring the end of the current epoch.',
      position: [0, 1.2, 2.5]
    },
    {
      id: 'musical-pillars',
      name: '56 SaReGaMa Musical Acoustic Columns',
      shortDescription: 'Monolithic granite pillars carved with slender auxiliary colonnettes that emit classical musical notes when tapped.',
      historicalSignificance: 'Acoustic engineering marvel of 16th-century Vijayanagara sculptors using varying metallic mineral concentrations in solid rock.',
      architecturalSignificance: 'Located in the Maha Mandapa hall, each main column is encircled by seven minor sub-pillars generating distinct swara frequencies.',
      story: 'British colonial officers cut open two pillars in disbelief to inspect for bronze tubes, finding only solid natural granite.',
      position: [-2.0, 1.5, 0.2]
    },
    {
      id: 'achyutaraya-gopuram',
      name: 'Achyutaraya Temple Valley Gateway',
      shortDescription: 'Secluded 1534 CE valley temple complex built by King Achyuta Deva Raya at the foot of Matanga Hill.',
      historicalSignificance: 'Constructed during the late Golden Age of Vijayanagara, featuring the famous Courtesans’ Bazaar (Sule Bazaar).',
      architecturalSignificance: 'Surrounded by twin prakara granite walls and soaring terracotta and stone gopurams nestled within boulder slopes.',
      story: 'Surrounded by dramatic granite rock formations, the valley temple served as a peaceful retreat for royal meditation.',
      position: [2.2, 2.8, -1.5]
    },
    {
      id: 'underground-shiva',
      name: 'Prasanna Virupaksha (Underground Shiva Temple)',
      shortDescription: 'Sunken 14th-century granite temple built below ground level, surrounded by natural spring water channels.',
      historicalSignificance: 'Built during the early founding era of the Vijayanagara Empire by Harihara Raya I.',
      architecturalSignificance: 'Constructed in a natural subterranean basin so that the sanctum lingam remains perpetually submerged in clear groundwater.',
      story: 'Devotees wade through knee-deep cool spring water to reach the inner sanctum during ritual worship hours.',
      position: [-1.2, 0.4, 3.0]
    },
    {
      id: 'maha-mandapa',
      name: 'Great Whispering Assembly Mandapa',
      shortDescription: 'Open 100-pillared audience hall sculpted with life-sized Yali lion riders and mythic warriors.',
      historicalSignificance: 'Hosted imperial dance performances, musical recitals, and royal state receptions.',
      architecturalSignificance: 'Raised carved granite plinth featuring multi-layered base moldings (Adhisthana) decorated with relief panels of elephants and horses.',
      story: 'Dharohar acoustic scans reveal that sound waves reflected off the granite ceiling reverberate cleanly across the entire 40-meter hall.',
      position: [0.5, 1.8, -0.8]
    }
  ],
  'achyutaraya-path': [
    {
      id: 'kampa-bhupa-path',
      name: 'Kampa Bhupa’s Paved Riverside Path',
      shortDescription: 'Monolithic granite paved riverbank walkway engineered in 1378 CE by King Kampa I along the Tungabhadra river.',
      historicalSignificance: 'One of pre-modern India’s finest civil engineering works for stone paved pedestrian transport.',
      architecturalSignificance: 'Carved out of natural riverbed granite boulders with raised stone causeways and resting pavilions.',
      story: 'Kampa I paved the path so pilgrims could walk safely between the Virupaksha and Achyutaraya shrines even during high water.',
      position: [-2.2, 0.8, 2.5]
    },
    {
      id: 'achyutaraya-gopuram-tower',
      name: 'Achyutaraya Terracotta & Granite Gopuram',
      shortDescription: 'Multi-tiered entrance gopuram consecrated in 1534 CE by Officer Salakaraju Tirumalaraja.',
      historicalSignificance: 'Stands as the majestic portal opening into the secluded Achyutaraya temple courtyard.',
      architecturalSignificance: 'Features a massive granite entrance doorway supporting multi-tiered terracotta upper brick superstructures.',
      story: 'Surrounded by the natural amphitheater of Matanga Hill, the gopuram framed the sunset view for royal processions.',
      position: [0, 3.0, 1.5]
    },
    {
      id: 'pushkarani-stepwell',
      name: 'Sacred Pushkarani & Water Mandapa',
      shortDescription: 'Symmetrical granite stepwell reservoir featuring a central island pavilion.',
      historicalSignificance: 'Served as the ritual immersion tank for temple deity float festivals (Teppotsavam).',
      architecturalSignificance: 'Enclosed by double-tiered granite colonnades with multi-stepped stone stairways leading into the water.',
      story: 'Groundwater springs continuously fed the tank, keeping the central mandapa submerged in clear water year-round.',
      position: [1.8, 0.5, -1.8]
    },
    {
      id: 'sule-bazaar-street',
      name: 'Sule Bazaar (Courtesans’ Marketplace)',
      shortDescription: '500-meter long pillared bazaar avenue stretching in front of the temple complex.',
      historicalSignificance: 'Renowned in 16th-century Portuguese travelogues as Hampi’s principal market for gold, precious gems, and silks.',
      architecturalSignificance: 'Flanked on both sides by continuous double-story granite stone shops and colonnades.',
      story: 'Foreign merchants traded rubies, diamonds, and horses along this grand avenue during annual royal festivals.',
      position: [3.0, 0.4, 0]
    },
    {
      id: 'tiruvengalanatha-sanctum',
      name: 'Sanctum Sanctorum of Tiruvengalanatha',
      shortDescription: 'Inner granite sanctum dedicated to Lord Vishnu as Tiruvengalanatha (Venkateswara).',
      historicalSignificance: 'The core royal shrine of King Achyuta Deva Raya, decorated with fine relief carvings of Vishnu avatars.',
      architecturalSignificance: 'Enclosed by heavy dark granite prakara walls with carved pillars depicting Yali riders.',
      story: 'Dharohar conservationists stabilized the granite ceiling slabs, preserving 16th-century relief carvings intact.',
      position: [-1.0, 1.2, -0.5]
    }
  ]
};
