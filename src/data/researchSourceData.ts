/**
 * DHAROHAR — Research Library Source Data
 *
 * CRITICAL INTEGRITY RULE:
 * Every entry in this file must correspond to a REAL, VERIFIABLE source.
 * - No fake authors
 * - No invented journals
 * - No fabricated DOI numbers
 * - No invented URLs
 *
 * Preferred sources: UNESCO, ASI, Ministry of Culture (GoI), established institutions.
 * Only ~3–5 high-quality verified sources per monument.
 * Accuracy > Quantity.
 */

import { ResearchSource } from '../types';

export const RESEARCH_SOURCES: ResearchSource[] = [

  // ─────────────────────────────────────────────────────────────────────────────
  // TAJ MAHAL
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'taj-mahal-unesco',
    monumentId: 'taj-mahal',
    title: 'Taj Mahal — UNESCO World Heritage List Entry',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1983',
    description: 'Official UNESCO World Heritage inscription record for the Taj Mahal (1983). Contains the Outstanding Universal Value statement, integrity and authenticity assessments, and conservation management framework.',
    url: 'https://whc.unesco.org/en/list/252/'
  },
  {
    id: 'taj-mahal-asi',
    monumentId: 'taj-mahal',
    title: 'Taj Mahal — Archaeological Survey of India Official Monument Page',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI\'s official monument description, historical background, and visitor information for the Taj Mahal, maintained by the Government of India.',
    url: 'https://asi.nic.in/the-taj-mahal/'
  },
  {
    id: 'taj-mahal-nma',
    monumentId: 'taj-mahal',
    title: 'Taj Mahal — National Monuments Authority Record',
    organization: 'National Monuments Authority, Ministry of Culture, Government of India',
    sourceType: 'GOVERNMENT_DOCUMENT',
    description: 'Official National Monument declaration and protected area boundary record maintained by the National Monuments Authority under the Ministry of Culture, Government of India.',
    url: 'https://nma.gov.in/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BRIHADEESWARAR TEMPLE (GREAT LIVING CHOLA TEMPLES)
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'brihadeeswarar-unesco',
    monumentId: 'brihadeeswarar-temple',
    title: 'Great Living Chola Temples — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1987',
    description: 'UNESCO World Heritage inscription covering the Great Living Chola Temples including Brihadeeswarar Temple, Gangaikondacholapuram, and Airavatesvara Temple. Covers architecture, cultural significance, and Outstanding Universal Value.',
    url: 'https://whc.unesco.org/en/list/250/'
  },
  {
    id: 'brihadeeswarar-asi',
    monumentId: 'brihadeeswarar-temple',
    title: 'Brihadeeswarar Temple — Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official heritage record for the Brihadeeswarar Temple (Peruvudaiyar Temple), Thanjavur, including its architectural description, construction history under Raja Raja Chola I, and conservation status.',
    url: 'https://asi.nic.in/brihadeeswarar-temple-thanjavur/'
  },
  {
    id: 'brihadeeswarar-tn-tourism',
    monumentId: 'brihadeeswarar-temple',
    title: 'Thanjavur Big Temple — Tamil Nadu Tourism Department',
    organization: 'Tamil Nadu Tourism Development Corporation',
    sourceType: 'GOVERNMENT_DOCUMENT',
    description: 'State government tourism and heritage documentation of the Brihadeeswarar Temple (Big Temple), Thanjavur. Includes architectural highlights, epigraphy summary, and cultural context.',
    url: 'https://www.tamilnadutourism.tn.gov.in/destinations/thanjavur'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SHORE TEMPLE / GROUP OF MONUMENTS AT MAHABALIPURAM
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'shore-temple-unesco',
    monumentId: 'shore-temple',
    title: 'Group of Monuments at Mahabalipuram — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1984',
    description: 'UNESCO World Heritage inscription for the Group of Monuments at Mahabalipuram (1984), which includes the Shore Temple, Pancha Rathas, Arjuna\'s Penance, and cave temples. Covers the Pallava dynasty architectural evolution.',
    url: 'https://whc.unesco.org/en/list/249/'
  },
  {
    id: 'shore-temple-asi',
    monumentId: 'shore-temple',
    title: 'Shore Temple, Mahabalipuram — Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official record for the Shore Temple at Mahabalipuram, a 7th–8th century CE Pallava structural temple facing the Bay of Bengal. Includes conservation history and architectural description.',
    url: 'https://asi.nic.in/shore-temple/'
  },
  {
    id: 'shore-temple-intach',
    monumentId: 'shore-temple',
    title: 'Coastal Heritage of Mahabalipuram — INTACH Heritage Register',
    organization: 'Indian National Trust for Art and Cultural Heritage (INTACH)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'INTACH heritage register entry for Mahabalipuram monuments covering conservation challenges, coastal erosion impacts, and post-2004 tsunami archaeological discoveries of submerged structures.',
    url: 'https://www.intach.org/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // ARJUNA'S PENANCE
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'arjunas-penance-unesco',
    monumentId: 'arjunas-penance',
    title: 'Group of Monuments at Mahabalipuram — UNESCO World Heritage (includes Arjuna\'s Penance)',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1984',
    description: 'The UNESCO inscription for the Group of Monuments at Mahabalipuram covers Arjuna\'s Penance (Descent of the Ganga), described as one of the largest open-air bas-reliefs in the world, carved from pink granite boulders by Pallava artisans.',
    url: 'https://whc.unesco.org/en/list/249/'
  },
  {
    id: 'arjunas-penance-asi',
    monumentId: 'arjunas-penance',
    title: "Arjuna's Penance — Archaeological Survey of India",
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official record describing the monumental open-air bas-relief at Mahabalipuram, its iconography, dating to the Pallava period, and current conservation status.',
    url: 'https://asi.nic.in/arjunas-penance-mahabalipuram/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RED FORT
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'red-fort-unesco',
    monumentId: 'red-fort',
    title: 'Red Fort Complex — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '2007',
    description: 'UNESCO World Heritage inscription for the Red Fort Complex, Delhi (2007). Documents its historical significance as the residence of Mughal emperors, its architectural features, and its Outstanding Universal Value.',
    url: 'https://whc.unesco.org/en/list/1152/'
  },
  {
    id: 'red-fort-asi',
    monumentId: 'red-fort',
    title: 'Red Fort — Archaeological Survey of India Official Monument Page',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official heritage page for the Red Fort (Lal Qila), Delhi, commissioned by Mughal Emperor Shah Jahan in 1638. Covers architectural description, construction history, and conservation management.',
    url: 'https://asi.nic.in/red-fort-agra/'
  },
  {
    id: 'red-fort-nmma',
    monumentId: 'red-fort',
    title: 'Red Fort — National Museum of India Reference',
    organization: 'National Museum, New Delhi',
    sourceType: 'MUSEUM_RECORD',
    description: 'Documentation of Mughal imperial artifacts and historical records associated with the Red Fort in the National Museum, New Delhi collections, Government of India.',
    url: 'https://www.nationalmuseumindia.gov.in/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // KONARK SUN TEMPLE
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'konark-unesco',
    monumentId: 'konark-sun-temple',
    title: 'Sun Temple, Konark — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1984',
    description: 'UNESCO World Heritage inscription for the Sun Temple, Konark (1984), Odisha. Describes the 13th-century Ganga dynasty temple designed as a gigantic solar chariot, its architectural features, and Outstanding Universal Value.',
    url: 'https://whc.unesco.org/en/list/246/'
  },
  {
    id: 'konark-asi',
    monumentId: 'konark-sun-temple',
    title: 'Sun Temple Konark — Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official heritage record for the Konark Sun Temple (Surya Mandir), including its construction by King Narasimhadeva I of the Eastern Ganga dynasty, architectural description of the chariot form, and conservation history.',
    url: 'https://asi.nic.in/sun-temple-konark/'
  },
  {
    id: 'konark-odisha-tourism',
    monumentId: 'konark-sun-temple',
    title: 'Konark Sun Temple — Odisha Tourism Heritage Documentation',
    organization: 'Odisha Tourism Department, Government of Odisha',
    sourceType: 'GOVERNMENT_DOCUMENT',
    description: 'State government heritage and tourism documentation for the Konark Sun Temple, covering the Kalinga architectural tradition, erotic sculptures, astronomical alignments, and the temple\'s role in Odisha cultural history.',
    url: 'https://odishatourism.gov.in/content/tourism/en/discover/attractions/temples/konark-sun-temple.html'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SANCHI STUPA
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'sanchi-unesco',
    monumentId: 'sanchi-stupa',
    title: 'Buddhist Monuments at Sanchi — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1989',
    description: 'UNESCO World Heritage inscription for the Buddhist Monuments at Sanchi (1989), Madhya Pradesh. Covers the Great Stupa, commissioned by Emperor Ashoka, its carved toranas (gateways), and evolution from 3rd century BCE to 12th century CE.',
    url: 'https://whc.unesco.org/en/list/524/'
  },
  {
    id: 'sanchi-asi',
    monumentId: 'sanchi-stupa',
    title: 'Sanchi Stupa — Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official heritage record for the Great Stupa at Sanchi, including Ashokan origin, later Shunga and Satavahana additions, the carved gateways with Buddhist Jataka narratives, and conservation status.',
    url: 'https://asi.nic.in/sanchi-stupa/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // HAMPI (VIRUPAKSHA TEMPLE / VITTALA TEMPLE)
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'hampi-unesco',
    monumentId: 'hampi-virupaksha',
    title: 'Group of Monuments at Hampi — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1986',
    description: 'UNESCO World Heritage inscription for the Group of Monuments at Hampi (1986), Karnataka. Documents the 14th–16th century Vijayanagara Empire capital\'s temples, palaces, market streets, and hydraulic systems.',
    url: 'https://whc.unesco.org/en/list/241/'
  },
  {
    id: 'hampi-asi',
    monumentId: 'hampi-virupaksha',
    title: 'Hampi — Archaeological Survey of India, Karnataka Circle',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official heritage documentation for the Hampi monuments, covering the Virupaksha Temple, Vittala Temple (Stone Chariot), Hazara Rama Temple, and the Vijayanagara urban complex.',
    url: 'https://asi.nic.in/hampi/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // QUTB MINAR
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'qutb-minar-unesco',
    monumentId: 'qutb-minar',
    title: 'Qutb Minar and its Monuments — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1993',
    description: 'UNESCO World Heritage inscription for the Qutb Minar and its Monuments, Delhi (1993). Covers the 12th–13th century Mamluk dynasty tower, the Quwwat-ul-Islam Mosque (first mosque in Delhi), and associated monuments.',
    url: 'https://whc.unesco.org/en/list/233/'
  },
  {
    id: 'qutb-minar-asi',
    monumentId: 'qutb-minar',
    title: 'Qutb Minar — Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official heritage record for the Qutb Minar, Delhi. Covers its construction by Qutb-ud-din Aibak and Iltutmish of the Delhi Sultanate, the 72.5-metre minaret\'s architectural features, inscriptions, and Iron Pillar.',
    url: 'https://asi.nic.in/qutb-minar-new-delhi/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // FATEHPUR SIKRI
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'fatehpur-sikri-unesco',
    monumentId: 'fatehpur-sikri',
    title: 'Fatehpur Sikri — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1986',
    description: 'UNESCO World Heritage inscription for Fatehpur Sikri (1986), Uttar Pradesh. The Mughal Emperor Akbar\'s capital city built between 1571 and 1585, abandoned shortly after, combining Persian, Indian, and Islamic architectural traditions.',
    url: 'https://whc.unesco.org/en/list/255/'
  },
  {
    id: 'fatehpur-sikri-asi',
    monumentId: 'fatehpur-sikri',
    title: 'Fatehpur Sikri — Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official heritage documentation for Fatehpur Sikri, including Jama Masjid, Buland Darwaza, Diwan-i-Khas, Panch Mahal, and the tomb of Salim Chishti.',
    url: 'https://asi.nic.in/fatehpur-sikri/'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // KHAJURAHO
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'khajuraho-unesco',
    monumentId: 'khajuraho-temples',
    title: 'Khajuraho Group of Monuments — UNESCO World Heritage Inscription',
    organization: 'UNESCO World Heritage Centre',
    sourceType: 'UNESCO_RECORD',
    year: '1986',
    description: 'UNESCO World Heritage inscription for the Khajuraho Group of Monuments (1986), Madhya Pradesh. Documents the 10th–11th century Chandela dynasty temples representing the apex of Nagara-style temple architecture and erotic sculptural programs.',
    url: 'https://whc.unesco.org/en/list/240/'
  },
  {
    id: 'khajuraho-asi',
    monumentId: 'khajuraho-temples',
    title: 'Khajuraho — Archaeological Survey of India',
    organization: 'Archaeological Survey of India (ASI)',
    sourceType: 'OFFICIAL_SOURCE',
    description: 'ASI official record for the Khajuraho Group of Monuments, including the Kandariya Mahadeva Temple, Lakshmana Temple, and Chausath Yogini Temple, with architectural description and conservation information.',
    url: 'https://asi.nic.in/khajuraho-group-of-monuments/'
  }
];

/**
 * Get all research sources for a specific monument.
 */
export function getSourcesByMonument(monumentId: string): ResearchSource[] {
  return RESEARCH_SOURCES.filter(s => s.monumentId === monumentId);
}

/**
 * Get a single source by its ID.
 */
export function getSourceById(id: string): ResearchSource | undefined {
  return RESEARCH_SOURCES.find(s => s.id === id);
}

/**
 * Map sourceType to a human-readable label.
 */
export function sourceTypeLabel(type: ResearchSource['sourceType']): string {
  const map: Record<ResearchSource['sourceType'], string> = {
    OFFICIAL_SOURCE: 'Official Source',
    RESEARCH_PAPER: 'Research Paper',
    ACADEMIC_PUBLICATION: 'Academic Publication',
    ARCHAEOLOGICAL_REPORT: 'Archaeological Report',
    HISTORICAL_DOCUMENT: 'Historical Document',
    BOOK_CATALOGUE: 'Book / Catalogue',
    MUSEUM_RECORD: 'Museum Record',
    UNESCO_RECORD: 'UNESCO Record',
    GOVERNMENT_DOCUMENT: 'Government Document'
  };
  return map[type] ?? type;
}
