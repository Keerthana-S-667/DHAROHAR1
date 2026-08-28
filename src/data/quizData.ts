/**
 * DHAROHAR — Heritage Quest Quiz Data
 *
 * INTEGRITY RULE:
 * All questions and answers are derived from verified historical facts
 * present in the monument data (heritageData.ts) or UNESCO/ASI records.
 * NO fabricated facts. If unsure, omit.
 *
 * 4 Levels per monument:
 * - explorer:   Basic identification facts
 * - historian:  Historical understanding
 * - researcher: Evidence-based understanding
 * - scholar:    Analytical / comparative
 */

import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [

  // ─────────────────────────────────────────────────────────────────────────────
  // TAJ MAHAL
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'taj-e1',
    monumentId: 'taj-mahal',
    level: 'explorer',
    type: 'mcq',
    question: 'Who commissioned the construction of the Taj Mahal?',
    options: ['Akbar', 'Shah Jahan', 'Humayun', 'Aurangzeb'],
    correctIndex: 1,
    explanation: 'Mughal Emperor Shah Jahan commissioned the Taj Mahal in 1631 as a mausoleum for his favourite wife, Mumtaz Mahal, who died during childbirth.',
    sourceNote: 'UNESCO World Heritage List — Taj Mahal (whc.unesco.org/en/list/252)'
  },
  {
    id: 'taj-e2',
    monumentId: 'taj-mahal',
    level: 'explorer',
    type: 'mcq',
    question: 'In which city is the Taj Mahal located?',
    options: ['Delhi', 'Jaipur', 'Agra', 'Lucknow'],
    correctIndex: 2,
    explanation: 'The Taj Mahal stands on the southern bank of the Yamuna River in Agra, Uttar Pradesh, India.',
    sourceNote: 'ASI Official Monument Record'
  },
  {
    id: 'taj-e3',
    monumentId: 'taj-mahal',
    level: 'explorer',
    type: 'true_false',
    question: 'The Taj Mahal was designated a UNESCO World Heritage Site in 1983.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'The Taj Mahal was inscribed on the UNESCO World Heritage List in 1983, recognised for its Outstanding Universal Value as a masterpiece of Mughal architecture.',
    sourceNote: 'UNESCO World Heritage List — Taj Mahal (whc.unesco.org/en/list/252)'
  },
  {
    id: 'taj-h1',
    monumentId: 'taj-mahal',
    level: 'historian',
    type: 'mcq',
    question: 'Approximately how many artisans worked on the Taj Mahal\'s construction?',
    options: ['2,000', '5,000', '20,000', '50,000'],
    correctIndex: 2,
    explanation: 'Historical accounts indicate that over 20,000 artisans, craftsmen, and workers from across Asia were engaged in building the Taj Mahal over approximately 22 years (1631–1653).',
    sourceNote: 'ASI Official Monument Record'
  },
  {
    id: 'taj-h2',
    monumentId: 'taj-mahal',
    level: 'historian',
    type: 'mcq',
    question: 'The main dome of the Taj Mahal is approximately how tall?',
    options: ['35 metres', '44 metres', '58 metres', '73 metres'],
    correctIndex: 1,
    explanation: 'The central onion dome rises approximately 44 metres above its drum base (73 metres above ground), creating the monument\'s iconic silhouette.',
    sourceNote: 'UNESCO World Heritage List Entry'
  },
  {
    id: 'taj-r1',
    monumentId: 'taj-mahal',
    level: 'researcher',
    type: 'mcq',
    question: 'What conservation treatment has been used to address yellowing of the Taj Mahal\'s marble?',
    options: [
      'Chemical bleaching agents',
      'Multani mitti (Fuller\'s earth) mud-pack treatment',
      'High-pressure water washing',
      'Laser ablation technology'
    ],
    correctIndex: 1,
    explanation: 'The Archaeological Survey of India has applied Multani mitti (Fuller\'s earth) mud-pack therapy to gently draw out embedded pollutants and restore whiteness to the marble surface.',
    sourceNote: 'ASI Conservation Records'
  },
  {
    id: 'taj-r2',
    monumentId: 'taj-mahal',
    level: 'researcher',
    type: 'mcq',
    question: 'What primary marble was used in constructing the Taj Mahal?',
    options: ['Carrara marble from Italy', 'Makrana marble from Rajasthan', 'Jaisalmer sandstone', 'Narmada limestone'],
    correctIndex: 1,
    explanation: 'The Taj Mahal was built using Makrana white marble from Rajasthan, renowned for its translucent quality and ability to change colour with the light throughout the day.',
    sourceNote: 'UNESCO World Heritage Documentation'
  },
  {
    id: 'taj-s1',
    monumentId: 'taj-mahal',
    level: 'scholar',
    type: 'mcq',
    question: 'The decorative inlay technique used extensively on the Taj Mahal, incorporating semi-precious stones into marble, is known as:',
    options: ['Fresco', 'Pietra dura', 'Arabesque', 'Muqarnas'],
    correctIndex: 1,
    explanation: 'Pietra dura (parchinkari in Persian/Urdu) is the inlay technique used, with semi-precious stones such as lapis lazuli, carnelian, malachite, and mother-of-pearl set into carved marble recesses to create floral and geometric patterns.',
    sourceNote: 'UNESCO World Heritage Documentation'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // BRIHADEESWARAR TEMPLE
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'bri-e1',
    monumentId: 'brihadeeswarar-temple',
    level: 'explorer',
    type: 'mcq',
    question: 'Who built the Brihadeeswarar Temple at Thanjavur?',
    options: ['Rajendra Chola', 'Raja Raja Chola I', 'Vikramaditya', 'Pulakesi II'],
    correctIndex: 1,
    explanation: 'The Brihadeeswarar Temple was built by Emperor Raja Raja Chola I and consecrated in 1010 CE to celebrate his military victories and express devotion to Lord Shiva.',
    sourceNote: 'UNESCO — Great Living Chola Temples (whc.unesco.org/en/list/250)'
  },
  {
    id: 'bri-e2',
    monumentId: 'brihadeeswarar-temple',
    level: 'explorer',
    type: 'mcq',
    question: 'What is the approximate height of the Brihadeeswarar Temple\'s vimana tower?',
    options: ['100 feet', '160 feet', '216 feet', '300 feet'],
    correctIndex: 2,
    explanation: 'The 13-tiered stepped Dravidian granite vimana tower rises to approximately 216 feet (66 metres), making it one of the tallest temple towers in the world at the time of its construction.',
    sourceNote: 'UNESCO World Heritage Inscription'
  },
  {
    id: 'bri-e3',
    monumentId: 'brihadeeswarar-temple',
    level: 'explorer',
    type: 'true_false',
    question: 'The Brihadeeswarar Temple was built using mortar to bind its granite blocks.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'The temple was built entirely of interlocking granite blocks without mortar or cement — an extraordinary feat of ancient engineering that has allowed it to stand for over 1,000 years.',
    sourceNote: 'ASI — Brihadeeswarar Temple Record'
  },
  {
    id: 'bri-h1',
    monumentId: 'brihadeeswarar-temple',
    level: 'historian',
    type: 'mcq',
    question: 'The Brihadeeswarar Temple is part of which UNESCO-inscribed group of monuments?',
    options: [
      'Group of Monuments at Mahabalipuram',
      'Great Living Chola Temples',
      'Buddhist Monuments of Tamil Nadu',
      'Dravidian Heritage Sites of South India'
    ],
    correctIndex: 1,
    explanation: 'The Brihadeeswarar Temple is part of the UNESCO World Heritage Site "Great Living Chola Temples" (inscribed 1987, extended 2004), which also includes Gangaikondacholapuram and Airavatesvara temples.',
    sourceNote: 'UNESCO (whc.unesco.org/en/list/250)'
  },
  {
    id: 'bri-h2',
    monumentId: 'brihadeeswarar-temple',
    level: 'historian',
    type: 'mcq',
    question: 'The single capstone (Kumbam) placed at the apex of the Brihadeeswarar vimana weighs approximately:',
    options: ['10 tonnes', '40 tonnes', '80 tonnes', '120 tonnes'],
    correctIndex: 2,
    explanation: 'The single-block granite Kumbam (finial capstone) at the summit of the 216-foot vimana weighs approximately 80 tonnes. How it was raised to the top remains a subject of historical study.',
    sourceNote: 'UNESCO World Heritage Documentation'
  },
  {
    id: 'bri-r1',
    monumentId: 'brihadeeswarar-temple',
    level: 'researcher',
    type: 'mcq',
    question: 'The Raja Raja Chola inscription at Thanjavur — one of the longest medieval South Indian inscriptions — records what type of information?',
    options: [
      'Astronomical observations',
      'Gifts, endowments, and management of the temple',
      'Military conquests only',
      'Architectural construction methods'
    ],
    correctIndex: 1,
    explanation: 'The Thanjavur inscription is one of the longest Chola-era epigraphs, recording in detail the vast gifts of gold, silver, land, cattle, and women donated to the temple, as well as administrative arrangements made by Raja Raja Chola I.',
    sourceNote: 'UNESCO Great Living Chola Temples Inscription Dossier'
  },
  {
    id: 'bri-s1',
    monumentId: 'brihadeeswarar-temple',
    level: 'scholar',
    type: 'mcq',
    question: 'The architectural style of the Brihadeeswarar Temple is classified as:',
    options: ['Vesara', 'Nagara', 'High Dravidian', 'Kalinga'],
    correctIndex: 2,
    explanation: 'The Brihadeeswarar Temple exemplifies the High Dravidian (Dravida) style at its peak: a multi-tiered pyramidal vimana, a single large garbhagriha, and an enclosure with perimeter wall (prakara), representing the mature Chola refinement of South Indian temple architecture.',
    sourceNote: 'UNESCO World Heritage Inscription Documentation'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SHORE TEMPLE
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'shore-e1',
    monumentId: 'shore-temple',
    level: 'explorer',
    type: 'mcq',
    question: 'The Shore Temple at Mahabalipuram was built by which dynasty?',
    options: ['Chola Dynasty', 'Pallava Dynasty', 'Vijayanagara Empire', 'Rashtrakuta Dynasty'],
    correctIndex: 1,
    explanation: 'The Shore Temple was built by the Pallava Dynasty, specifically under King Narasimhavarman II (Rajasimha), between approximately 700 and 728 CE.',
    sourceNote: 'UNESCO — Group of Monuments at Mahabalipuram (whc.unesco.org/en/list/249)'
  },
  {
    id: 'shore-e2',
    monumentId: 'shore-temple',
    level: 'explorer',
    type: 'true_false',
    question: 'The Shore Temple faces the Bay of Bengal.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'The Shore Temple is positioned directly on the Coromandel Coast, with its main vimana tower facing east toward the Bay of Bengal, so the first light of dawn illuminates its sanctum.',
    sourceNote: 'UNESCO Group of Monuments at Mahabalipuram'
  },
  {
    id: 'shore-h1',
    monumentId: 'shore-temple',
    level: 'historian',
    type: 'mcq',
    question: 'The Shore Temple is significant in Indian architectural history because it represents:',
    options: [
      'The first use of brick in South Indian temples',
      'The transition from rock-cut cave temples to freestanding structural stone temples',
      'The earliest example of Mughal influence in South India',
      'The first Buddhist stupa in Tamil Nadu'
    ],
    correctIndex: 1,
    explanation: 'The Shore Temple marks a pivotal transition in Pallava architecture: the shift from rock-cut cave temples (rathas) to fully structural, freestanding stone temples — a defining moment in the history of Dravidian architecture.',
    sourceNote: 'UNESCO World Heritage Inscription'
  },
  {
    id: 'shore-r1',
    monumentId: 'shore-temple',
    level: 'researcher',
    type: 'mcq',
    question: 'During the 2004 Indian Ocean Tsunami, what significant archaeological discovery was made at Mahabalipuram?',
    options: [
      'A bronze idol of Pallava royalty',
      'Receding waters briefly exposed ancient submerged stone structures and ruins',
      'A previously unknown cave temple was uncovered',
      'Roman coins confirming ancient trade were found'
    ],
    correctIndex: 1,
    explanation: 'During the 2004 tsunami, the temporary recession of the sea exposed ancient stone walls, sculptures, and ruins just offshore from Mahabalipuram — lending archaeological weight to the legend of the "Seven Pagodas" (six temples submerged by the sea).',
    sourceNote: 'UNESCO and ASI post-tsunami archaeological documentation'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // KONARK SUN TEMPLE
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'konark-e1',
    monumentId: 'konark-sun-temple',
    level: 'explorer',
    type: 'mcq',
    question: 'The Konark Sun Temple was built by which dynasty?',
    options: ['Ganga Dynasty', 'Chola Dynasty', 'Gupta Dynasty', 'Kakatiya Dynasty'],
    correctIndex: 0,
    explanation: 'The Konark Sun Temple was built by King Narasimhadeva I of the Eastern Ganga dynasty around 1250 CE, dedicated to the Sun God Surya.',
    sourceNote: 'UNESCO — Sun Temple, Konark (whc.unesco.org/en/list/246)'
  },
  {
    id: 'konark-e2',
    monumentId: 'konark-sun-temple',
    level: 'explorer',
    type: 'mcq',
    question: 'The Konark Sun Temple was designed in the form of:',
    options: [
      'A stepped pyramid',
      'A giant solar chariot with 24 wheels',
      'A lotus-shaped mandala',
      'A riverside ghat complex'
    ],
    correctIndex: 1,
    explanation: 'The temple is conceived as a massive stone chariot of the Sun God Surya, with 24 intricately carved stone wheels (representing the hours of the day) and seven horses pulling the divine vehicle.',
    sourceNote: 'UNESCO Sun Temple, Konark — Outstanding Universal Value Statement'
  },
  {
    id: 'konark-h1',
    monumentId: 'konark-sun-temple',
    level: 'historian',
    type: 'mcq',
    question: 'The Konark Sun Temple was designated a UNESCO World Heritage Site in:',
    options: ['1978', '1984', '1989', '1993'],
    correctIndex: 1,
    explanation: 'The Sun Temple at Konark was inscribed on the UNESCO World Heritage List in 1984, recognised for its Outstanding Universal Value as a masterpiece of Kalinga architecture.',
    sourceNote: 'UNESCO (whc.unesco.org/en/list/246)'
  },
  {
    id: 'konark-r1',
    monumentId: 'konark-sun-temple',
    level: 'researcher',
    type: 'mcq',
    question: 'The architectural style of the Konark Sun Temple belongs to which tradition?',
    options: ['Dravidian', 'Vesara', 'Kalinga (Odisha) Nagara', 'Indo-Saracenic'],
    correctIndex: 2,
    explanation: 'The Konark Sun Temple belongs to the Kalinga (or Odishan Nagara) tradition, characterised by the curvilinear deul tower, the jagamohana (assembly hall), and the natamandira (dance hall), and elaborate sculptural programs.',
    sourceNote: 'UNESCO Sun Temple, Konark Inscription Dossier'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // RED FORT
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'red-fort-e1',
    monumentId: 'red-fort',
    level: 'explorer',
    type: 'mcq',
    question: 'The Red Fort was built by which Mughal Emperor?',
    options: ['Babur', 'Akbar', 'Shah Jahan', 'Aurangzeb'],
    correctIndex: 2,
    explanation: 'The Red Fort (Lal Qila) was commissioned by Mughal Emperor Shah Jahan in 1638 as the main residence of the Mughal emperors when the capital was moved from Agra to Shahjahanabad (present-day Old Delhi).',
    sourceNote: 'UNESCO Red Fort Complex (whc.unesco.org/en/list/1152)'
  },
  {
    id: 'red-fort-e2',
    monumentId: 'red-fort',
    level: 'explorer',
    type: 'true_false',
    question: 'The Red Fort was completed in 1648 CE.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'Construction of the Red Fort began in 1638 and major construction was completed in 1648, when Shah Jahan moved his court from Agra to Shahjahanabad.',
    sourceNote: 'ASI Red Fort Official Record'
  },
  {
    id: 'red-fort-h1',
    monumentId: 'red-fort',
    level: 'historian',
    type: 'mcq',
    question: 'The Red Fort was designated a UNESCO World Heritage Site in:',
    options: ['1993', '2000', '2007', '2010'],
    correctIndex: 2,
    explanation: 'The Red Fort Complex was inscribed on the UNESCO World Heritage List in 2007, recognised for its representation of Mughal creative genius and the political and cultural power of Mughal imperial rule.',
    sourceNote: 'UNESCO (whc.unesco.org/en/list/1152)'
  },
  {
    id: 'red-fort-r1',
    monumentId: 'red-fort',
    level: 'researcher',
    type: 'mcq',
    question: 'What historically significant event takes place at the Red Fort every year on 15 August?',
    options: [
      'Eid celebrations',
      'India\'s Prime Minister hoists the national flag on Independence Day',
      'The Diwali light festival',
      'The Republic Day parade'
    ],
    correctIndex: 1,
    explanation: 'Since India\'s independence in 1947, every Prime Minister has hoisted the national flag from the ramparts of the Red Fort on 15 August (Independence Day), making it one of the most symbolically important sites in the Indian Republic.',
    sourceNote: 'UNESCO Red Fort Complex — Outstanding Universal Value Statement'
  },
  {
    id: 'red-fort-s1',
    monumentId: 'red-fort',
    level: 'scholar',
    type: 'mcq',
    question: 'The primary construction material used for the Red Fort\'s outer walls, which gives it its name, is:',
    options: ['Sandstone', 'Red Agra marble', 'Red Lakhori brick', 'Red Rajput sandstone from Dholpur'],
    correctIndex: 3,
    explanation: 'The imposing outer defensive walls of the Red Fort were built from red Dholpur sandstone, quarried from Dholpur in Rajasthan — giving the fort its distinctive crimson-red appearance and its name, Lal Qila (Red Fort).',
    sourceNote: 'UNESCO Red Fort Complex Documentation'
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // SANCHI STUPA
  // ─────────────────────────────────────────────────────────────────────────────

  {
    id: 'sanchi-e1',
    monumentId: 'sanchi-stupa',
    level: 'explorer',
    type: 'mcq',
    question: 'Who originally commissioned the Great Stupa at Sanchi?',
    options: ['Chandragupta Maurya', 'Emperor Ashoka', 'Kanishka I', 'Samudragupta'],
    correctIndex: 1,
    explanation: 'The Great Stupa at Sanchi was originally commissioned by Emperor Ashoka of the Maurya Empire in the 3rd century BCE as a reliquary monument enshrining the relics of the Buddha.',
    sourceNote: 'UNESCO Buddhist Monuments at Sanchi (whc.unesco.org/en/list/524)'
  },
  {
    id: 'sanchi-h1',
    monumentId: 'sanchi-stupa',
    level: 'historian',
    type: 'mcq',
    question: 'The ornate carved gateways (toranas) of Sanchi were added during which dynasty?',
    options: ['Maurya', 'Gupta', 'Shunga and Satavahana', 'Kushan'],
    correctIndex: 2,
    explanation: 'The four elaborately carved toranas (gateways) at Sanchi were added during the Shunga and Satavahana periods, from the 1st century BCE to the 1st century CE, depicting Jataka tales and scenes from the Buddha\'s life.',
    sourceNote: 'UNESCO Buddhist Monuments at Sanchi'
  }
];

/**
 * Get all quiz questions for a specific monument.
 */
export function getQuizByMonument(monumentId: string): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.monumentId === monumentId);
}

/**
 * Get questions for a specific monument and level.
 */
export function getQuizByMonumentAndLevel(monumentId: string, level: QuizQuestion['level']): QuizQuestion[] {
  return QUIZ_QUESTIONS.filter(q => q.monumentId === monumentId && q.level === level);
}

/**
 * Check if quiz data is available for a monument.
 */
export function hasQuizData(monumentId: string): boolean {
  return QUIZ_QUESTIONS.some(q => q.monumentId === monumentId);
}

export const QUIZ_LEVEL_CONFIG: Record<QuizQuestion['level'], { label: string; description: string; color: string }> = {
  explorer: {
    label: 'Level 1 — Explorer',
    description: 'Basic identification facts about the monument',
    color: '#22c55e'
  },
  historian: {
    label: 'Level 2 — Historian',
    description: 'Historical understanding and context',
    color: '#3b82f6'
  },
  researcher: {
    label: 'Level 3 — Researcher',
    description: 'Evidence-based and conservation questions',
    color: '#a855f7'
  },
  scholar: {
    label: 'Level 4 — Scholar',
    description: 'Analytical and architectural terminology',
    color: '#f59e0b'
  }
};
