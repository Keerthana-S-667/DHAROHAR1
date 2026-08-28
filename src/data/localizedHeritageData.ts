import { Language } from '../types';

export interface LocalizedStateFields {
  name?: string;
  tagline?: string;
  overview?: string;
  architecturalHeritage?: string;
  capital?: string;
  dynasties?: string[];
}

export interface LocalizedDestinationFields {
  name?: string;
  tagline?: string;
  description?: string;
  historicalContext?: string;
  geographicHighlight?: string;
}

export interface LocalizedMonumentFields {
  name?: string;
  tagline?: string;
  culturalSignificance?: string;
  history?: string;
  architectureStyle?: string;
  material?: string;
  period?: string;
  dynasty?: string;
  ruler?: string;
}

export const LOCALIZED_STATES: Record<string, Record<Language, LocalizedStateFields>> = {
  'tamil-nadu': {
    en: {
      name: 'Tamil Nadu',
      tagline: 'The Cradle of Dravidian Temple Splendor & Living Stone Poetry',
      overview: 'Tamil Nadu boasts over two millennia of continuous architectural evolution. From the monolithic rock-cut cave rathas of Mahabalipuram to the sky-piercing granite vimanas of Thanjavur and rainbow gopurams of Madurai, stone masonry reached its spiritual apex here.',
      architecturalHeritage: 'Dravidian Architecture flourished under Pallava cave excavators, Chola granite master masons, and Pandyan & Nayaka gopuram builders.',
      capital: 'Chennai',
      dynasties: ['Pallava Dynasty (4th–9th Century)', 'Chola Empire (9th–13th Century)', 'Pandya Dynasty', 'Nayakas of Madurai']
    },
    ta: {
      name: 'தமிழ்நாடு',
      tagline: 'திராவிடக் கோயில் அற்புதம் & வாழும் கல் கவிதைகளின் தொட்டில்',
      overview: 'தமிழ்நாடு இரண்டு ஆயிரத்திற்கும் மேற்பட்ட ஆண்டுகால கட்டிடக்கலை வளர்ச்சியைக் கொண்டது. மகாபலிபுரத்தின் பாறை குடைவரை கோவில்கள் முதல் தஞ்சாவூரின் பெரிய கோவில் மற்றும் மதுரையின் வானளாவிய கோபுரங்கள் வரை இந்தியாவின் மிகச் சிறந்த கல் சிற்பக் கலை பொக்கிஷங்கள் இங்கு அமைந்துள்ளன.',
      architecturalHeritage: 'பல்லவ, சோழ, பாண்டிய மற்றும் நாயக்க மன்னர்களின் ஆட்சிக் காலத்தில் திராவிடக் கட்டிடக்கலை உலகப் புகழ் பெற்றது.',
      capital: 'சென்னை',
      dynasties: ['பல்லவ வம்சம் (4-9ஆம் நூற்றாண்டு)', 'சோழ பேரரசு (9-13ஆம் நூற்றாண்டு)', 'பாண்டிய வம்சம்', 'மதுரை நாயக்கர்கள்']
    },
    hi: {
      name: 'तमिलनाडु',
      tagline: 'द्रविड़ मंदिर भव्यता और पाषाण कला का उद्गम स्थल',
      overview: 'तमिलनाडु दो हजार से अधिक वर्षों के वास्तुकला विकास का प्रतीक है। महाबलीपुरम के एकाश्मक चट्टानी मंदिरों से लेकर तंजावुर के विशाल विमानों और मदुरै के भव्य गोपुरमों तक यहाँ पाषाण कला का अनुपम खजाना है।',
      architecturalHeritage: 'पल्लव, चोल, पांड्य और नायक राजवंशों के शासनकाल में द्रविड़ वास्तुकला ने सर्वोच्च ऊँचाइयों को छुआ।',
      capital: 'चेन्नई',
      dynasties: ['पल्लव राजवंश (4थी-9वीं सदी)', 'चोल साम्राज्य (9वीं-13वीं सदी)', 'पांड्य राजवंश', 'मदुरै के नायक']
    }
  },
  'karnataka': {
    en: {
      name: 'Karnataka',
      tagline: 'Realm of Chalukya Sculptural Mastery & Vijayanagara Splendor',
      overview: 'Karnataka captures 1,500 years of temple innovations across Badami Chalukyas, Hoysalas, and Vijayanagara emperors, featuring star-shaped shrines and carved musical pillars.',
      architecturalHeritage: 'Famous for Vesara style architecture, Hoysala chloritic schist stone relief carving, and massive Vijayanagara granite monoliths.',
      capital: 'Bengaluru',
      dynasties: ['Badami Chalukyas', 'Rashtrakutas', 'Hoysala Dynasty', 'Vijayanagara Empire']
    },
    ta: {
      name: 'கர்நாடகா',
      tagline: 'சாளுக்கிய சிற்பக் கலை & விஜயநகர பேரரசின் பொற்காலம்',
      overview: 'ஹம்பியின் விஜயநகர இடிபாடுகள் முதல் பேளூர், ஹளபேடு ஹோய்சள நட்சத்ர வடிவக் கோயில்கள் வரை கர்நாடகா ஒப்பற்ற வரலாற்றுச் சின்னங்களைக் கொண்டுள்ளது.',
      architecturalHeritage: 'வேசர பாணி கட்டிடக்கலை, ஹோய்சள நுண் சிற்பக் கலை மற்றும் விஜயநகர பெருங்கற்கள் கொண்ட புகழ்பெற்ற தளம்.',
      capital: 'பெங்களூரு',
      dynasties: ['பாதாமி சாளுக்கியர்கள்', 'ராஷ்டிரகூடர்கள்', 'ஹோய்சள வம்சம்', 'விஜயநகர பேரரசு']
    },
    hi: {
      name: 'कर्नाटक',
      tagline: 'चालुक्य मूर्तिकला और विजयनगर साम्राज्य का वैभव',
      overview: 'हम्पी के विजयनगर अवशेषों से लेकर बेलूर और भलेबीडु के तारांकित होयसल मंदिरों तक कर्नाटक अद्वितीय धरोहरों से समृद्ध है।',
      architecturalHeritage: 'वेसर शैली वास्तुकला, होयसल सूक्ष्म नक्काशी और विजयनगर के विशाल पाषाण स्मारकों के लिए प्रसिद्ध।',
      capital: 'बेंगलुरु',
      dynasties: ['बादामी चालुक्य', 'राष्ट्रकूट', 'होयसल राजवंश', 'विजयनगर साम्राज्य']
    }
  },
  'rajasthan': {
    en: {
      name: 'Rajasthan',
      tagline: 'Land of Rajput Fortresses, Desert Citadel Wonders & Royal Chhatris',
      overview: 'Rajasthan features hilltop fortresses, intricate lattice jali balconies, and yellow sandstone palaces built over 800 years of Rajput chivalry.',
      architecturalHeritage: 'Maha-Maru and Rajput Indo-Islamic styles with massive ramparts, sheesh mahals, and delicate stepwells.',
      capital: 'Jaipur',
      dynasties: ['Kachwaha Rajputs of Jaipur', 'Rathores of Marwar', 'Sisodias of Mewar']
    },
    ta: {
      name: 'ராஜஸ்தான்',
      tagline: 'ராஜபுத்திர கம்பீரம், பாலைவனக் கோட்டைகள் & அரண்மனைகள்',
      overview: 'ஜெய்ப்பூர், ஜோத்பூர் மற்றும் உதய்பூரின் கம்பீரமான கோட்டைகளும் அரண்மனைகளும் ராஜபுத்திர வரலாற்றின் பொற்காலத்தைப் பறைசாற்றுகின்றன.',
      architecturalHeritage: 'மகா-மாரு மற்றும் ராஜபுத்திர பாணி கட்டிடக்கலை, பிரம்மாண்டமான கோட்டைச் சுவர்கள் மற்றும் பளிங்கு அரண்மனைகள்.',
      capital: 'ஜெய்ப்பூர்',
      dynasties: ['ஜெய்ப்பூர் கச்வாஹா ராஜபுத்திரர்கள்', 'மார்வார் ராத்தோர்கள்', 'மேவார் சிசோடியாக்கள்']
    },
    hi: {
      name: 'राजस्थान',
      tagline: 'राजपूत शौर्य, मरुस्थलीय दुर्ग और राजप्रासाद',
      overview: 'जयपुर, जोधपुर और उदयपुर के भव्य किले तथा महल राजपूत राजवंशों के गौरवशाली इतिहास की गाथा गाते हैं।',
      architecturalHeritage: 'महा-मारू और राजपूत शैली स्थापत्य, विशाल परकोटे, शीश महल और भव्य बावड़ियाँ।',
      capital: 'जयपुर',
      dynasties: ['जयपुर के कछवाहा राजपूत', 'मारवाड़ के राठौड़', 'मेवाड़ के सिसौदिया']
    }
  },
  'delhi': {
    en: {
      name: 'Delhi',
      tagline: 'The Seven Sacred Cities of Imperial Monuments & Indo-Islamic Architecture',
      overview: 'Delhi presents iconic monuments spanning Sultanate red sandstone minarets to Mughal imperial mausoleums and grand courtyards.',
      architecturalHeritage: 'Indo-Islamic arcuate architecture featuring red sandstone, calligraphic inscriptions, and double domes.',
      capital: 'New Delhi',
      dynasties: ['Mamluk Sultanate', 'Tughlaq Dynasty', 'Mughal Empire']
    },
    ta: {
      name: 'டெல்லி',
      tagline: 'ஏழு வரலாற்று நகரங்கள் & இந்தோ-இஸ்லாமிய கட்டிடக்கலை பேரதிசயம்',
      overview: 'குதுப் மினார் முதல் செங்கோட்டை மற்றும் ஹுமாயூன் கல்லறை வரை டெல்லி பல நூற்றாண்டுகால இந்தோ-இஸ்லாமிய கட்டிடக்கலையைக் கொண்டுள்ளது.',
      architecturalHeritage: 'சிவப்பு மணற்கல், பாரசீக மற்றும் இந்திய பாணிகளின் கலவையான அற்புத கட்டிடக்கலை.',
      capital: 'புது டெல்லி',
      dynasties: ['மாம்லுக் சுல்தானகம்', 'துக்ளக் வம்சம்', 'முகலாய பேரரசு']
    },
    hi: {
      name: 'दिल्ली',
      tagline: 'सात ऐतिहासिक नगर और इंडो-इस्लामिक स्थापत्य वैभव',
      overview: 'कुतुब मीनार से लेकर लाल किला और हुमायूँ के मकबरे तक दिल्ली शताब्दियों के इंडो-इस्लामिक स्थापत्य का साक्षी है।',
      architecturalHeritage: 'लाल बलुआ पत्थर, फ़ारसी और भारतीय शैलियों का अद्भुत संयोजन।',
      capital: 'नई दिल्ली',
      dynasties: ['मामलुक सल्तनत', 'तुगलक राजवंश', 'मुगल साम्राज्य']
    }
  },
  'odisha': {
    en: {
      name: 'Odisha',
      tagline: 'Sanctuary of Kalinga Temple Architecture & Celestial Chariots',
      overview: 'Odisha exhibits the purest expression of Kalinga architectural geometry, featuring soaring rekha deula towers and the sun chariot of Konark.',
      architecturalHeritage: 'Kalinga architecture with Rekha Deula, Pidha Deula, and Khakhara Deula stone structures.',
      capital: 'Bhubaneswar',
      dynasties: ['Eastern Ganga Dynasty', 'Somavamsi Dynasty', 'Gajapati Kingdom']
    },
    ta: {
      name: 'ஒடிசா',
      tagline: 'கலிங்கக் கோயில் நாகரிகம் & கோனார்க் சூரியக் கோயில்',
      overview: 'கோனார்க் சூரியக் கோயில் மற்றும் புவனேஸ்வர் லிங்கராஜா கோயில் உட்பட கலிங்க கட்டிடக்கலையின் உச்சத்தை ஒடிசாவில் காணலாம்.',
      architecturalHeritage: 'ரேகா தேவுலா, பிடா தேவுலா கட்டிடக்கலை வடிவங்கள் மற்றும் சூரிய தேரின் பெருங்கற்கள்.',
      capital: 'புவனேஸ்வர்',
      dynasties: ['கிழக்கு கங்க வம்சம்', 'சோமவம்சி வம்சம்', 'கஜபதி பேரரசு']
    },
    hi: {
      name: 'ओडिशा',
      tagline: 'कलिंग मंदिर स्थापत्य और कोणार्क सूर्य मंदिर',
      overview: 'कोणार्क सूर्य मंदिर और भुवनेश्वर लिंगराज मंदिर सहित कलिंग स्थापत्य शैली का सर्वोत्कृष्ट रूप ओडिशा में स्थित है।',
      architecturalHeritage: 'रेखा देउल, पिढा देउल मंदिर शैली और पाषाण सूर्य रथ नक्काशी।',
      capital: 'भुवनेश्वर',
      dynasties: ['पूर्वी गंग राजवंश', 'सोमवंशी राजवंश', 'गजपति साम्राज्य']
    }
  }
};

export const LOCALIZED_MONUMENTS: Record<string, Record<Language, LocalizedMonumentFields>> = {
  'shore-temple': {
    en: {
      name: 'Shore Temple, Mahabalipuram',
      tagline: 'The 1300-Year Sentinel of the Coromandel Coast',
      culturalSignificance: 'Standing sentinel on the Bay of Bengal for over thirteen centuries, this structural stone masterpiece transitioned from cave excavations to skyward granite vimanas.',
      history: 'Commissioned by Narasimhavarman II Rajasimha (700–728 CE) of the Pallava Dynasty, designed so the first rays of the dawn sun illuminate the deity.',
      architectureStyle: 'Early Structural Dravidian Stone Architecture',
      material: 'Dressed Granitic Gneiss stone blocks',
      period: '700–728 CE',
      dynasty: 'Pallava Dynasty',
      ruler: 'King Narasimhavarman II (Rajasimha)'
    },
    ta: {
      name: 'கடற்கரைக் கோயில், மகாபலிபுரம்',
      tagline: 'வங்காள விரிகுடாவில் 1300 ஆண்டுகளாக கம்பீரமாக நிற்கும் கல் அற்புதம்',
      culturalSignificance: 'வங்கக் கடலின் கரையில் 13 நூற்றாண்டுகளுக்கும் மேலாக கம்பீரமாக வீற்றிருக்கும் பல்லவர் கால திராவிடக் கட்டிடக்கலையின் தலையாய சான்று.',
      history: 'இரண்டாம் நரசிம்மவர்மன் (ராஜசிம்மன்) காலத்தில் கி.பி 700–728 இல் கட்டப்பட்ட இக்கோயில், விடியற்காலைச் சூரியனின் முதல் கதிர்கள் மூலவர் மீது விழும் வண்ணம் அமைக்கப்பட்டது.',
      architectureStyle: 'ஆரம்பகால திராவிடக் கட்டிடக்கலை',
      material: 'செதுக்கப்பட்ட கருங்கல் பாறைகள்',
      period: 'கி.பி 700–728',
      dynasty: 'பல்லவ வம்சம்',
      ruler: 'இரண்டாம் நரசிம்மவர்மன் (ராஜசிம்மன்)'
    },
    hi: {
      name: 'शोर मंदिर, महाबलीपुरम',
      tagline: 'बंगाल की खाड़ी के तट पर 1300 वर्षों से अडिग पाषाण मंदिर',
      culturalSignificance: 'बंगाल की खाड़ी के तट पर 13 शताब्दियों से खड़ा यह मंदिर पल्लव कालीन द्रविड़ स्थापत्य कला का सर्वोत्कृष्ट उदाहरण है।',
      history: 'पल्लव राजवंश के राजा नरसिंहवर्मन द्वितीय (राजसिंह) द्वारा 700–728 ईस्वी में निर्मित, जिसकी रचना सूर्य की पहली किरणों के स्वागत हेतु की गई।',
      architectureStyle: 'प्रारंभिक द्रविड़ स्थापत्य शैली',
      material: 'तराशे गए ग्रेनाइट पत्थर',
      period: '700–728 ईस्वी',
      dynasty: 'पल्लव राजवंश',
      ruler: 'राजा नरसिंहवर्मन द्वितीय (राजसिंह)'
    }
  },
  'brihadeeswarar-temple': {
    en: {
      name: 'Brihadeeswarar Temple',
      tagline: 'The Great Living Chola Granite Temple of Thanjavur',
      culturalSignificance: 'A triumph of imperial Chola architecture built entirely from interlocking granite blocks without mortar, featuring a 216-foot vimana.',
      history: 'Built by Emperor Raja Raja Chola I between 1003 and 1010 CE as a grand statement of Chola economic, naval, and spiritual authority.',
      architectureStyle: 'High Dravidian Granite Architecture',
      material: 'Interlocking Granite Blocks',
      period: '1003–1010 CE',
      dynasty: 'Chola Dynasty',
      ruler: 'Emperor Raja Raja Chola I'
    },
    ta: {
      name: 'தஞ்சைப் பெரிய கோயில் (பெருவுடையார் கோயில்)',
      tagline: 'ராஜராஜ சோழனின் பிரம்மாண்டமான தஞ்சை பெருவுடையார் கோயில்',
      culturalSignificance: '216 அடி உயர விமானத்துடன், சிமெண்ட் அல்லது சாந்து இன்றி முழுமையாக கருங்கற்களால் பிணைத்து கட்டப்பட்ட சோழர் கால கட்டிடக்கலை சாதனை.',
      history: 'முதலாம் ராஜராஜ சோழனால் கி.பி 1003 முதல் 1010 வரை சோழ பேரரசின் ஆன்மீக மற்றும் கட்டிடக்கலை ஆற்றலை உலகிற்கு பறைசாற்ற கட்டப்பட்டது.',
      architectureStyle: 'உயர் திராவிட சோழர் கட்டிடக்கலை',
      material: 'ஒன்றோடொன்று பிணைக்கப்பட்ட கருங்கற்கள்',
      period: 'கி.பி 1003–1010',
      dynasty: 'சோழ பேரரசு',
      ruler: 'முதலாம் ராஜராஜ சோழன்'
    },
    hi: {
      name: 'बृहदेश्वर मंदिर, तंजावुर',
      tagline: 'राजराज चोल का भव्य ग्रेनाइट मंदिर',
      culturalSignificance: '216 फीट ऊँचे विमान के साथ बिना चूने-गारे के केवल ग्रेनाइट पत्थरों को जोड़कर बनाया गया चोल वास्तुकला का अनुपम चमत्कार।',
      history: 'सम्राट राजराज चोल प्रथम द्वारा 1003 से 1010 ईस्वी के मध्य निर्मित, जो चोल साम्राज्य की शक्ति और धार्मिक आस्था का प्रतीक है।',
      architectureStyle: 'द्रविड़ चोल स्थापत्य कला',
      material: 'इंटरलॉकिंग ग्रेनाइट ब्लॉक',
      period: '1003–1010 ईस्वी',
      dynasty: 'चोल साम्राज्य',
      ruler: 'सम्राट राजराज चोल प्रथम'
    }
  },
  'taj-mahal': {
    en: {
      name: 'Taj Mahal',
      tagline: 'The Immortal White Marble Symbol of Eternal Devotion & Symmetry',
      culturalSignificance: 'Universally admired masterpiece of world heritage, housing the tombs of Mumtaz Mahal and Shah Jahan with perfect bilateral symmetry.',
      history: 'Commissioned in 1631 by Mughal Emperor Shah Jahan to honor his favorite wife Mumtaz Mahal. Built over 22 years by over 20,000 artisans across Asia.',
      architectureStyle: 'Indo-Islamic Symmetrical White Marble Architecture',
      material: 'Makrana White Marble & Semi-Precious Pietra Dura Inlays',
      period: '1631–1653 CE',
      dynasty: 'Mughal Empire',
      ruler: 'Emperor Shah Jahan'
    },
    ta: {
      name: 'தாஜ்மஹால், ஆக்ரா',
      tagline: 'வெண் பளிங்கு கல்லால் ஆன உலகப் புகழ்பெற்ற காதல் சின்னம்',
      culturalSignificance: 'மும்தாஜ் மஹால் மற்றும் ஷாஜஹான் நினைவாக அமைக்கப்பட்ட, உலகின் ஏழு அதிசயங்களில் ஒன்றான பளிங்கு மாளிகை.',
      history: 'முகலாய பேரரசர் ஷாஜஹானால் 1631 ஆம் ஆண்டு தொடங்கப்பட்டு 22 ஆண்டுகள் 20,000 க்கும் மேற்பட்ட கலைஞர்களால் உருவாக்கப்பட்டது.',
      architectureStyle: 'இந்தோ-இஸ்லாமிய பளிங்கு கட்டிடக்கலை',
      material: 'மகரானா வெண் பளிங்கு & நவரத்தினக் கற்கள்',
      period: 'கி.பி 1631–1653',
      dynasty: 'முகலாய பேரரசு',
      ruler: 'பேரரசர் ஷாஜஹான்'
    },
    hi: {
      name: 'ताज महल, आगरा',
      tagline: 'अमर प्रेम और अद्भुत सममिति का संगमरमर प्रतीक',
      culturalSignificance: 'विश्व धरोहर का अनुपम शाहकार, जो मुमताज महल और शाहजहाँ का मकबरा है।',
      history: 'मुगल सम्राट शाहजहाँ द्वारा 1631 में मुमताज महल की स्मृति में निर्मित, जिसे 20,000 कारीगरों ने 22 वर्षों में पूरा किया।',
      architectureStyle: 'इंडो-इस्लामिक संगमरमर वास्तुकला',
      material: 'मकराना सफेद संगमरमर एवं कीमती पत्थर',
      period: '1631–1653 ईस्वी',
      dynasty: 'मुगल साम्राज्य',
      ruler: 'सम्राट शाहजहाँ'
    }
  },
  'qutb-minar': {
    en: {
      name: 'Qutb Minar Complex',
      tagline: 'The Soaring 73-Metre Red Sandstone Victory Minaret of Delhi',
      culturalSignificance: 'The tallest brick minaret in the world, surrounded by ancient ruins, intricate calligraphy, and the legendary rust-resistant Iron Pillar.',
      history: 'Initiated by Qutb-ud-din Aibak in 1192 CE and expanded by Iltutmish and Alauddin Khalji as a victory monument of the Delhi Sultanate.',
      architectureStyle: 'Indo-Islamic Fluted Minaret Architecture',
      material: 'Red Sandstone & Grey Quartzite',
      period: '1192–1368 CE',
      dynasty: 'Mamluk & Tughlaq Sultanates',
      ruler: 'Qutb-ud-din Aibak & Iltutmish'
    },
    ta: {
      name: 'குதுப் மினார், டெல்லி',
      tagline: '73 மீட்டர் உயரமுள்ள உலகின் மிகப்பெரிய செங்கல் கோபுரம்',
      culturalSignificance: 'உலகின் மிக உயரமான செங்கல் கோபுரம், பழங்கால துருப்பிடிக்காத இரும்புத் தூண் மற்றும் இந்தோ-இஸ்லாமிய கல்வெட்டுகள் கொண்டது.',
      history: 'கி.பி 1192 இல் குதுப்-உத்-தின் ஐபக்கால் தொடங்கப்பட்டு இல்துத்மிஷ் மற்றும் அலாவுதீன் கல்ஜியால் விரிவுபடுத்தப்பட்டது.',
      architectureStyle: 'இந்தோ-இஸ்லாமிய கோபுர கட்டிடக்கலை',
      material: 'சிவப்பு மணற்கல் & சாம்பல் நிறக் பாறைகள்',
      period: 'கி.பி 1192–1368',
      dynasty: 'மாம்லுக் சுல்தானகம்',
      ruler: 'குதுப்-உத்-தின் ஐபக் & இல்துத்மிஷ்'
    },
    hi: {
      name: 'कुतुब मीनार परिसर, दिल्ली',
      tagline: '73 मीटर ऊँची विश्व प्रसिद्ध लाल बलुआ पत्थर की मीनार',
      culturalSignificance: 'विश्व की सबसे ऊँची ईंट मीनार, जिसके परिसर में प्रसिद्ध जंग-रोधी लोह स्तंभ स्थित है।',
      history: '1192 ईस्वी में कुतुबुद्दीन ऐबक द्वारा प्रारंभ तथा इल्तुतमिश द्वारा विस्तारित विजय स्तंभ।',
      architectureStyle: 'इंडो-इस्लामिक मीनार स्थापत्य',
      material: 'लाल बलुआ पत्थर एवं क्वार्टज़ाइट',
      period: '1192–1368 ईस्वी',
      dynasty: 'मामलुक सल्तनत',
      ruler: 'कुतुबुद्दीन ऐबक एवं इल्तुतमिश'
    }
  },
  'konark-sun-temple': {
    en: {
      name: 'Konark Sun Temple',
      tagline: 'The Monumental 12-Wheeled Stone Chariot of Surya Bhagavan',
      culturalSignificance: 'Designed as a colossal 24-wheeled chariot pulled by 7 stone horses, dedicated to the Sun God Surya on the shores of the Bay of Bengal.',
      history: 'Commissioned by King Narasimhadeva I of the Eastern Ganga Dynasty in 1250 CE, taking 12 years of craftsmanship.',
      architectureStyle: 'Kalinga Sun Chariot Temple Architecture',
      material: 'Khondalite Stone & Chlorite Sculptures',
      period: '1250 CE',
      dynasty: 'Eastern Ganga Dynasty',
      ruler: 'King Narasimhadeva I'
    },
    ta: {
      name: 'கோனார்க் சூரியக் கோயில், ஒடிசா',
      tagline: '24 கல் சக்கரங்கள் கொண்ட சூரிய பகவானின் பிரம்மாண்டமான கல் தேர் கோயில்',
      culturalSignificance: '7 கல் குதிரைகள் இழுக்கும் 24 பெரிய கல் சக்கரங்கள் கொண்ட பிரம்மாண்டமான சூரிய தேராக வடிவமைக்கப்பட்ட கட்டிடக்கலை அற்புதம்.',
      history: 'கிழக்கு கங்க மன்னன் முதலாம் நரசிம்மதேவனால் கி.பி 1250 இல் 12 ஆண்டுகால தீவிர கலை முயற்சியால் கட்டப்பட்டது.',
      architectureStyle: 'கலிங்க சூரிய தேர் கட்டிடக்கலை',
      material: 'கொண்டலைட் கல் & குளோரைட் சிற்பங்கள்',
      period: 'கி.பி 1250',
      dynasty: 'கிழக்கு கங்க வம்சம்',
      ruler: 'முதலாம் நரசிம்மதேவன்'
    },
    hi: {
      name: 'कोणार्क सूर्य मंदिर, ओडिशा',
      tagline: 'भगवान सूर्य का 24 पहियों वाला विशाल पाषाण रथ मंदिर',
      culturalSignificance: '7 पत्थरों के घोड़ों द्वारा खींचे जाने वाले 24 विशाल नक्काशीदार पहियों वाले रथ के रूप में निर्मित।',
      history: 'पूर्वी गंग राजवंश के राजा नरसिंहदेव प्रथम द्वारा 1250 ईस्वी में निर्मित कलिंग कला का उत्कृष्ट नमूना।',
      architectureStyle: 'कलिंग सूर्य रथ मंदिर स्थापत्य',
      material: 'खोंडोलाइट पत्थर एवं क्लोराइट मूर्तियाँ',
      period: '1250 ईस्वी',
      dynasty: 'पूर्वी गंग राजवंश',
      ruler: 'राजा नरसिंहदेव प्रथम'
    }
  }
};
