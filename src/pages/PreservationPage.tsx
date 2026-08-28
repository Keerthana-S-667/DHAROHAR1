import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { MONUMENTS } from '../data/heritageData';
import { 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Layers, 
  Compass, 
  MapPin, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  Award, 
  Download, 
  X, 
  Landmark,
  User,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface PreservationPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

// Initial demo reports structure (matches the specified data model)
const INITIAL_DEMO_REPORTS = [
  {
    id: 'DH-2026-00128',
    monumentId: 'taj-mahal',
    monumentName: 'Taj Mahal',
    state: 'Uttar Pradesh',
    issueType: 'Structural Damage',
    severity: 'High',
    description: 'Hairline cracks observed on the outer marble pillar facing the Yamuna river. The crack seems to run along the load-bearing masonry joint.',
    image: null,
    latitude: 27.1751,
    longitude: 78.0421,
    submittedBy: 'Ananya Roy',
    submittedAt: '2026-08-20',
    status: 'under-review', // under-review, assigned, resolved
    aiAssessment: 'Potential structural fissure. Recommendation: Inspect foundations for moisture-induced load shifts.',
    assignedTo: null,
    resolutionNote: null,
    resolvedAt: null
  },
  {
    id: 'DH-2026-00124',
    monumentId: 'shore-temple',
    monumentName: 'Shore Temple',
    state: 'Tamil Nadu',
    issueType: 'Surface Erosion',
    severity: 'Medium',
    description: 'Noticeable salt crust formation and minor flaking on the lower perimeter Nandi bull statues facing the sea wind.',
    image: null,
    latitude: 12.6163,
    longitude: 80.1994,
    submittedBy: 'Karthik Subramanian',
    submittedAt: '2026-08-22',
    status: 'under-review',
    aiAssessment: 'Salt spray crystallization eroding external granite wall reliefs. Recommendation: Apply sacrificial clay pack.',
    assignedTo: null,
    resolutionNote: null,
    resolvedAt: null
  },
  {
    id: 'DH-2026-00119',
    monumentId: 'hampi-monuments',
    monumentName: 'Hampi Group of Monuments',
    state: 'Karnataka',
    issueType: 'Structural Damage',
    severity: 'High',
    description: 'Deep vertical fissure visible near the base of the musical pillar assembly in the main hall of Vittala temple.',
    image: null,
    latitude: 15.3350,
    longitude: 76.4600,
    submittedBy: 'Meera Rao',
    submittedAt: '2026-08-15',
    status: 'assigned',
    aiAssessment: 'Stress hairline crack detected on upper Vittala temple column. Urgency level: High.',
    assignedTo: 'ASI Hampi Regional Conservation Wing',
    resolutionNote: 'Assigned to the engineering team for physical scaffolding installation and structural assessment.',
    resolvedAt: null
  },
  {
    id: 'DH-2026-00108',
    monumentId: 'konark-temple',
    monumentName: 'Konark Sun Temple',
    state: 'Odisha',
    issueType: 'Water Damage',
    severity: 'Medium',
    description: 'Water standing around the 3rd sundial wheel after heavy monsoon showers due to blocked drainage canal.',
    image: null,
    latitude: 19.8876,
    longitude: 86.0945,
    submittedBy: 'Rahul Patnaik',
    submittedAt: '2026-08-10',
    status: 'resolved',
    aiAssessment: 'Rainwater accumulation around stone sundial wheel base. Minor moisture infiltration hazard.',
    assignedTo: 'Odisha Heritage & Drainage Works Division',
    resolutionNote: 'Drainage pipes cleared and silt deposits removed. Runoff water is now draining freely.',
    resolvedAt: '2026-08-12'
  }
];

const INITIAL_DEMO_STORIES = [
  {
    id: 'ST-001',
    title: 'The Whispering Pillars of Vittala',
    monumentId: 'hampi-monuments',
    location: 'Hampi, Karnataka',
    category: 'Local Tradition',
    story: 'My grandmother used to tell us that the musical pillars in Vittala Temple were not just decorative. When she was young, local musicians would tap them lightly to create accompaniment during evening prayers. Each pillar had a distinct frequency, matching traditional instruments like the mridangam, flute, and veena. The British actually cut open two of them to see if there was metal inside, but found only solid stone. It is a mystery of ancient acoustics that we must preserve.',
    contributorName: 'Srinivas Murthy',
    image: null,
    submittedAt: '2026-08-18',
    status: 'approved',
    moderationNote: 'Verified and approved for publication.'
  },
  {
    id: 'ST-002',
    title: 'The Submerged Pagodas of Mamallapuram',
    monumentId: 'shore-temple',
    location: 'Mahabalipuram, Tamil Nadu',
    category: 'Family Memory',
    story: 'Our family has been living in Mahabalipuram for generations. My grandfather, who was a fisherman, always maintained that the Shore Temple was only one of seven sister temples. He claimed that on extremely clear and calm days, if you rowed out far enough, you could see the dark silhouettes of submerged stone vimanas reflecting under the water. When the 2004 tsunami hit, and the sea receded just before the wave, the exposed seabed revealed carved blocks and a large stone elephant, proving the legend of the Seven Pagodas was real.',
    contributorName: 'Rajendran Fisher',
    image: null,
    submittedAt: '2026-08-25',
    status: 'approved',
    moderationNote: 'Approved for publishing.'
  }
];

export const PreservationPage: React.FC<PreservationPageProps> = ({ onNavigate, language }) => {
  const t = TRANSLATIONS[language].preservation;
  const monumentsList = Object.values(MONUMENTS);

  // active sub-section navigation tab
  const [activeTab, setActiveTab] = useState<'report' | 'ledger' | 'stories'>('report');

  const { session, profile } = useAuthStore();

  // Persistence States
  const [reports, setReports] = useState<any[]>([]);

  const loadReportsFromSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('heritage_reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reports from Supabase:', error);
        return;
      }

      if (data) {
        const mapped = data.map((row: any) => ({
          id: row.report_id || `DH-2026-${row.id.substring(0, 5)}`,
          dbId: row.id,
          monumentId: row.monument_id,
          monumentName: row.monument_name,
          state: row.state,
          issueType: row.issue_type,
          severity: row.severity ? row.severity.charAt(0).toUpperCase() + row.severity.slice(1) : 'Medium',
          description: row.description,
          image: row.visual_evidence?.[0] || null,
          latitude: row.gps_latitude,
          longitude: row.gps_longitude,
          submittedBy: row.reporter_name || 'DHAROHAR Citizen Guardian',
          submittedAt: new Date(row.created_at).toISOString().split('T')[0],
          status: row.status === 'submitted' ? 'under-review' : row.status === 'under_review' ? 'under-review' : row.status.replace('_', '-')
        }));
        setReports(mapped);
      }
    } catch (err) {
      console.error('Error loading reports:', err);
    }
  };

  useEffect(() => {
    loadReportsFromSupabase();
  }, []);

  const [stories, setStories] = useState<any[]>(() => {
    const raw = localStorage.getItem('dharohar_community_stories');
    if (raw) return JSON.parse(raw);
    localStorage.setItem('dharohar_community_stories', JSON.stringify(INITIAL_DEMO_STORIES));
    return INITIAL_DEMO_STORIES;
  });

  // Report Form States
  const [reportMonumentId, setReportMonumentId] = useState('');
  const [issueType, setIssueType] = useState('');
  const [severity, setSeverity] = useState('');
  const [description, setDescription] = useState('');
  const [reportImage, setReportImage] = useState<string | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'capturing' | 'captured' | 'denied'>('idle');
  const [reportSuccess, setReportSuccess] = useState<any | null>(null);
  const [reportErrors, setReportErrors] = useState<string[]>([]);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Ledger Filter States & Detail Modal
  const [ledgerFilter, setLedgerFilter] = useState<'all' | 'under-review' | 'assigned' | 'resolved'>('all');
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Story Form States
  const [storyTitle, setStoryTitle] = useState('');
  const [storyMonumentId, setStoryMonumentId] = useState('');
  const [storyCategory, setStoryCategory] = useState('');
  const [storyText, setStoryText] = useState('');
  const [storyContributor, setStoryContributor] = useState('');
  const [storySuccess, setStorySuccess] = useState(false);
  const [storyErrors, setStoryErrors] = useState<string[]>([]);
  const [isSubmittingStory, setIsSubmittingStory] = useState(false);

  // Guardian Pledge states
  const [pledgeName, setPledgeName] = useState(() => {
    return localStorage.getItem('dharohar_pledge_name') || '';
  });
  const [pledged, setPledged] = useState(() => {
    return localStorage.getItem('dharohar_pledged') === 'true';
  });
  const [credentialId, setCredentialId] = useState(() => {
    return localStorage.getItem('dharohar_pledge_credential_id') || `DH-2026-${(Math.random() * 90000 + 10000).toFixed(0)}`;
  });
  const [pledgeDate, setPledgeDate] = useState(() => {
    return localStorage.getItem('dharohar_pledge_date') || new Date().toLocaleDateString();
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  // Geolocation Handler
  const captureLocation = () => {
    setGpsStatus('capturing');
    if (!navigator.geolocation) {
      setGpsStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsStatus('captured');
      },
      (error) => {
        console.error('GPS error:', error);
        setGpsStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  // Image Upload Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setReportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReportErrors([]);

    const errors = [];
    if (!reportMonumentId) errors.push('Please select a heritage site.');
    if (!issueType) errors.push('Please select an issue/damage type.');
    if (!severity) errors.push('Please specify severity.');
    if (!description.trim()) errors.push('Please describe the damage observed.');

    if (errors.length > 0) {
      setReportErrors(errors);
      return;
    }

    setIsSubmittingReport(true);

    const selectedMonument = monumentsList.find(m => m.id === reportMonumentId);
    
    try {
      const { data, error } = await supabase
        .from('heritage_reports')
        .insert({
          monument_id: reportMonumentId,
          monument_name: selectedMonument?.name || 'Unknown Monument',
          state: selectedMonument?.location.state || 'Unknown State',
          issue_type: issueType,
          severity: severity.toLowerCase(),
          description: description,
          visual_evidence: reportImage ? [reportImage] : [],
          gps_latitude: latitude,
          gps_longitude: longitude,
          reporter_name: profile?.full_name || profile?.username || 'DHAROHAR Citizen Guardian',
          reporter_email: profile?.email || session?.user?.email || null,
          user_id: session?.user?.id || null
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      const createdReport = {
        id: data.report_id || `DH-2026-${data.id.substring(0, 5)}`,
        dbId: data.id,
        monumentId: data.monument_id,
        monumentName: data.monument_name,
        state: data.state,
        issueType: data.issue_type,
        severity: data.severity ? data.severity.charAt(0).toUpperCase() + data.severity.slice(1) : 'Medium',
        description: data.description,
        image: data.visual_evidence?.[0] || null,
        latitude: data.gps_latitude,
        longitude: data.gps_longitude,
        submittedBy: data.reporter_name || 'DHAROHAR Citizen Guardian',
        submittedAt: new Date(data.created_at).toISOString().split('T')[0],
        status: 'under-review'
      };

      setReportSuccess(createdReport);
      
      // Clear Form fields
      setReportMonumentId('');
      setIssueType('');
      setSeverity('');
      setDescription('');
      setReportImage(null);
      setLatitude(null);
      setLongitude(null);
      setGpsStatus('idle');

      // Reload reports ledger list
      loadReportsFromSupabase();

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          colors: ['#b65a3a', '#aa7b3f']
        });
      } catch {}
    } catch (err: any) {
      console.error('Error submitting report to Supabase:', err);
      setReportErrors(['Unable to submit your heritage report. Please try again. (' + (err.message || 'Database error') + ')']);
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // Story Submission
  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStoryErrors([]);

    const errors = [];
    if (!storyTitle.trim()) errors.push('Please provide a story title.');
    if (!storyMonumentId) errors.push('Please select a heritage site.');
    if (!storyCategory) errors.push('Please choose a submission category.');
    if (!storyText.trim()) errors.push('Please share your story or tradition.');

    if (errors.length > 0) {
      setStoryErrors(errors);
      return;
    }

    setIsSubmittingStory(true);

    setTimeout(() => {
      const selectedMonument = monumentsList.find(m => m.id === storyMonumentId);
      const newStory = {
        id: `ST-${(Math.random() * 9000 + 1000).toFixed(0)}`,
        title: storyTitle,
        monumentId: storyMonumentId,
        location: `${selectedMonument?.location.city || 'Unknown Location'}, ${selectedMonument?.location.state || ''}`,
        category: storyCategory,
        story: storyText,
        contributorName: storyContributor.trim() || 'Anonymous Contributor',
        image: null,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'pending-review',
        moderationNote: null
      };

      const updated = [newStory, ...stories];
      setStories(updated);
      localStorage.setItem('dharohar_community_stories', JSON.stringify(updated));

      setStorySuccess(true);
      setStoryTitle('');
      setStoryMonumentId('');
      setStoryCategory('');
      setStoryText('');
      setStoryContributor('');
      setIsSubmittingStory(false);
    }, 1000);
  };

  // Guardian Pledge Handler
  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) return;

    const id = `DH-2026-${(Math.random() * 90000 + 10000).toFixed(0)}`;
    const date = new Date().toLocaleDateString();

    localStorage.setItem('dharohar_pledge_name', pledgeName);
    localStorage.setItem('dharohar_pledged', 'true');
    localStorage.setItem('dharohar_pledge_credential_id', id);
    localStorage.setItem('dharohar_pledge_date', date);

    setCredentialId(id);
    setPledgeDate(date);
    setPledged(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#b65a3a', '#aa7b3f', '#d5b990', '#22c55e']
      });
    } catch {}
  };

  // Badge download as PNG using html-to-image
  const handleDownloadBadge = async () => {
    if (!badgeRef.current) return;
    setIsDownloading(true);
    try {
      // Small timeout to allow styles to settle
      await new Promise((resolve) => setTimeout(resolve, 400));
      
      const dataUrl = await toPng(badgeRef.current, {
        quality: 0.95,
        pixelRatio: 2, // Double resolution for high quality crisp rendering
        backgroundColor: '#f5f0e6',
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: '512px',
          height: '340px'
        }
      });
      
      const link = document.createElement('a');
      link.download = `DHAROHAR-Heritage-Guardian-${pledgeName.trim().replace(/\s+/g, '-') || 'Guardian'}.png`;
      link.href = dataUrl;
      link.click();

      try {
        confetti({
          particleCount: 30,
          spread: 40,
          colors: ['#b65a3a', '#aa7b3f']
        });
      } catch {}
    } catch (error) {
      console.error('Failed to generate PNG badge:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const getStepStatus = (currentStatus: string, stepKey: string) => {
    const statuses = ['submitted', 'under-review', 'assigned', 'resolved'];
    const currentIdx = statuses.indexOf(currentStatus);
    const stepIdx = statuses.indexOf(stepKey);
    return stepIdx <= currentIdx;
  };

  const filteredReports = reports.filter(r => {
    if (ledgerFilter === 'all') return true;
    return r.status === ledgerFilter;
  });

  const publishedStories = stories.filter(s => s.status === 'approved');

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* INTRODUCTION SECTION */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/50 text-[10px] text-[#b65a3a] font-bold uppercase tracking-widest shadow-md">
            <ShieldCheck className="w-4 h-4" />
            <span>Dharohar Preservation Initiative</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#4b2f23] tracking-tight">
            Preserve What We Inherit
          </h1>

          <p className="font-subheading text-lg sm:text-xl text-[#b65a3a] max-w-xl mx-auto leading-relaxed">
            Help document, protect, and preserve India's living architectural heritage.
          </p>
        </div>

        {/* 3 MAIN ACTIONS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/30 flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                Report Heritage Damage
              </h3>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Report visible damage, deterioration, or threats affecting a heritage monument.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('report')}
              className="inline-flex items-center gap-1.5 text-[#b65a3a] font-bold text-xs uppercase tracking-wider hover:text-[#9e4a2e] transition-colors text-left"
            >
              <span>Report Damage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/30 flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                Heritage Reports Ledger
              </h3>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Follow submitted heritage reports and see how preservation concerns progress.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('ledger')}
              className="inline-flex items-center gap-1.5 text-[#b65a3a] font-bold text-xs uppercase tracking-wider hover:text-[#9e4a2e] transition-colors text-left"
            >
              <span>View Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-[#ede3d1]/80 border border-[#aa7b3f]/30 flex flex-col justify-between space-y-4 hover:shadow-lg transition-shadow">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                Community Stories
              </h3>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Preserve local memories, oral traditions, historical stories, and cultural knowledge.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('stories')}
              className="inline-flex items-center gap-1.5 text-[#b65a3a] font-bold text-xs uppercase tracking-wider hover:text-[#9e4a2e] transition-colors text-left"
            >
              <span>Share a Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* INTERNAL NAVIGATION TABS */}
        <div className="flex justify-center border-b border-[#aa7b3f]/25 pb-px">
          <div className="flex gap-2 p-1.5 rounded-2xl bg-[#ede3d1]/60 border border-[#aa7b3f]/20">
            {[
              { id: 'report', label: 'Report Damage', icon: AlertTriangle },
              { id: 'ledger', label: 'Reports Ledger', icon: Layers },
              { id: 'stories', label: 'Community Stories', icon: Compass }
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setReportSuccess(null);
                    setStorySuccess(false);
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#b65a3a] text-white shadow-md' 
                      : 'text-[#4b2f23]/80 hover:bg-[#ede3d1] hover:text-[#b65a3a]'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TABS PANELS */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: REPORT DAMAGE */}
          {activeTab === 'report' && (
            <div className="max-w-2xl mx-auto bg-[#ede3d1]/40 border border-[#aa7b3f]/30 p-8 sm:p-10 rounded-3xl space-y-6 shadow-xl">
              
              <div className="space-y-1.5 text-center sm:text-left">
                <h2 className="font-display text-2xl font-bold text-[#4b2f23]">
                  Report Heritage Damage
                </h2>
                <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                  Help us document threats to India's heritage. Your report will be reviewed before being added to the preservation record.
                </p>
              </div>

              {reportSuccess ? (
                /* Report submission success state */
                <div className="p-6 rounded-2xl border-2 border-[#b65a3a] bg-[#fcfaf7] space-y-5 text-center animate-in zoom-in duration-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                      Report Submitted Successfully
                    </h3>
                    <p className="text-xs text-[#4b2f23]/80">
                      Thank you for helping protect India's heritage.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#ede3d1]/40 border border-[#aa7b3f]/20 grid grid-cols-2 gap-4 text-left max-w-sm mx-auto text-xs">
                    <div>
                      <span className="block font-bold text-[#4b2f23]/60 uppercase tracking-wider text-[9px]">Report ID</span>
                      <span className="font-mono font-bold text-sm text-[#4b2f23]">{reportSuccess.id}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-[#4b2f23]/60 uppercase tracking-wider text-[9px]">Initial Status</span>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[9px] uppercase tracking-wider">
                        Under Review
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('ledger')}
                      className="px-5 py-2.5 rounded-full bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9e4a2e] transition-colors cursor-pointer"
                    >
                      View Reports Ledger →
                    </button>
                    <button
                      onClick={() => setReportSuccess(null)}
                      className="px-4 py-2.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 text-xs font-bold text-[#b65a3a] hover:bg-[#f5f0e6] cursor-pointer"
                    >
                      File Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-5">
                  {reportErrors.length > 0 && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 space-y-1 font-semibold">
                      {reportErrors.map((err, i) => (
                        <div key={i}>• {err}</div>
                      ))}
                    </div>
                  )}

                  {/* 1. Monument Dropdown */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">
                      Heritage Site *
                    </label>
                    <select
                      value={reportMonumentId}
                      onChange={(e) => setReportMonumentId(e.target.value)}
                      className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-3 text-xs font-semibold text-[#4b2f23] outline-none focus:border-[#b65a3a] transition-all"
                    >
                      <option value="">Select Heritage Site...</option>
                      {monumentsList.map(m => (
                        <option key={m.id} value={m.id}>
                          {m.name} — {m.location.city}, {m.location.state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* 2. Issue Type */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">
                        Damage / Issue Type *
                      </label>
                      <select
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value)}
                        className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-3 text-xs font-semibold text-[#4b2f23] outline-none focus:border-[#b65a3a] transition-all"
                      >
                        <option value="">Select Type...</option>
                        <option value="Structural Damage">Structural Damage</option>
                        <option value="Surface Erosion">Surface Erosion</option>
                        <option value="Water Damage">Water Damage</option>
                        <option value="Vegetation Growth">Vegetation Growth</option>
                        <option value="Weathering">Weathering</option>
                        <option value="Vandalism">Vandalism</option>
                        <option value="Pollution">Pollution</option>
                        <option value="Waste / Litter">Waste / Litter</option>
                        <option value="Unauthorized Construction">Unauthorized Construction</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* 3. Severity */}
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">
                        Severity *
                      </label>
                      <select
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-3 text-xs font-semibold text-[#4b2f23] outline-none focus:border-[#b65a3a] transition-all"
                      >
                        <option value="">Select Severity...</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  {/* 4. Description */}
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">
                      Observed Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the damage, erosion, or issue you observed. Be as specific as possible regarding visible crack sizes, moisture spots, or vandalized carvings..."
                      rows={4}
                      className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-3 text-xs font-semibold text-[#4b2f23] outline-none focus:border-[#b65a3a] transition-all placeholder-[#4b2f23]/40"
                    />
                  </div>

                  {/* 5. Geolocation / Location Area */}
                  <div className="p-4 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#4b2f23]/80 text-center sm:text-left">
                      <MapPin className="w-4 h-4 text-[#b65a3a]" />
                      <span>
                        {gpsStatus === 'idle' && 'Coordinates: Not captured'}
                        {gpsStatus === 'capturing' && 'Acquiring GPS signals...'}
                        {gpsStatus === 'captured' && `Coordinates: ${latitude?.toFixed(5)}° N, ${longitude?.toFixed(5)}° E`}
                        {gpsStatus === 'denied' && 'Coordinates: Access Denied (Manual filing)'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={captureLocation}
                      disabled={gpsStatus === 'capturing'}
                      className="px-4 py-2.5 rounded-xl border border-[#aa7b3f]/40 hover:bg-[#ede3d1] text-[#b65a3a] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                    >
                      Capture Current Location
                    </button>
                  </div>

                  {/* 6. Photograph upload */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">
                      Photograph (Optional JPG/PNG/WebP, max 2MB)
                    </label>
                    
                    {reportImage ? (
                      <div className="relative inline-block border-2 border-[#aa7b3f] rounded-2xl overflow-hidden shadow-md max-w-xs group bg-[#f5f0e6]">
                        <img 
                          src={reportImage} 
                          alt="Damage upload preview" 
                          className="h-40 w-auto object-cover" 
                        />
                        <button
                          type="button"
                          onClick={() => setReportImage(null)}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors cursor-pointer"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="relative border-2 border-dashed border-[#aa7b3f]/40 hover:border-[#b65a3a] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#f5f0e6]/50">
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          onChange={handleImageChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 text-[#4b2f23]/60">
                          <Upload className="w-7 h-7 text-[#b65a3a]" />
                          <span className="text-xs font-bold">Select Photograph File</span>
                          <span className="text-[10px]">JPEG, PNG, or WebP formats</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmittingReport}
                    className="w-full py-3.5 rounded-2xl bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#9e4a2e] active:scale-[0.98] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    <span>{isSubmittingReport ? 'Submitting Heritage Report...' : 'Submit Heritage Report'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: REPORTS LEDGER */}
          {activeTab === 'ledger' && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#aa7b3f]/25 pb-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h2 className="font-display text-2xl font-bold text-[#4b2f23]">
                    Heritage Reports Ledger
                  </h2>
                  <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                    Track the reports submitted by guardians and follow their active conservation progress.
                  </p>
                </div>

                {/* Ledger Filters */}
                <div className="flex gap-1.5 p-1 rounded-xl bg-[#ede3d1]/80 border border-[#aa7b3f]/30">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'under-review', label: 'Under Review' },
                    { id: 'assigned', label: 'Assigned' },
                    { id: 'resolved', label: 'Resolved' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setLedgerFilter(f.id as any)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                        ledgerFilter === f.id 
                          ? 'bg-[#b65a3a] text-white shadow-sm' 
                          : 'text-[#4b2f23]/75 hover:bg-[#ede3d1]'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredReports.length === 0 ? (
                <div className="text-center py-12 p-8 rounded-3xl bg-[#ede3d1]/30 border border-[#aa7b3f]/20 space-y-3">
                  <div className="w-10 h-10 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 flex items-center justify-center mx-auto text-[#b65a3a]">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                    No heritage reports found
                  </h3>
                  <p className="text-xs text-[#4b2f23]/70 max-w-sm mx-auto leading-relaxed">
                    There are no reports matches in this category. File a new damage report to help protect India's monuments.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredReports.map(report => (
                    <div 
                      key={report.id}
                      onClick={() => setSelectedReport(report)}
                      className="p-5 rounded-3xl bg-[#ede3d1]/40 border border-[#aa7b3f]/30 hover:border-[#b65a3a] flex flex-col justify-between space-y-4 hover:shadow-lg transition-all cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2 border-b border-[#aa7b3f]/15 pb-2.5">
                          <span className="font-mono text-xs font-bold text-[#4b2f23]/60">{report.id}</span>
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[8px] uppercase tracking-wider ${
                            report.status === 'under-review' ? 'bg-amber-100 text-amber-800' :
                            report.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {report.status.replace('-', ' ')}
                          </span>
                        </div>

                        <div>
                          <h3 className="font-display text-base font-bold text-[#4b2f23]">
                            {report.monumentName}
                          </h3>
                          <p className="text-[10px] text-[#4b2f23]/60 font-semibold uppercase tracking-wider">{report.state}</p>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="font-bold text-[#4b2f23]/80">Issue:</span>
                            <span className="font-semibold text-[#b65a3a]">{report.issueType}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs">
                            <span className="font-bold text-[#4b2f23]/80">Severity:</span>
                            <span className={`font-bold ${
                              report.severity === 'Critical' ? 'text-red-600' :
                              report.severity === 'High' ? 'text-orange-600' :
                              report.severity === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                            }`}>{report.severity}</span>
                          </div>
                        </div>

                        <p className="text-xs text-[#4b2f23]/80 line-clamp-2 leading-relaxed">
                          {report.description}
                        </p>
                      </div>

                      {/* Small compact progression timeline inside card */}
                      <div className="border-t border-[#aa7b3f]/15 pt-3.5 flex items-center justify-between text-[8px] font-bold uppercase tracking-wider text-[#4b2f23]/50">
                        <div className="flex gap-1.5 items-center">
                          <span className={`w-1.5 h-1.5 rounded-full ${getStepStatus(report.status, 'submitted') ? 'bg-[#b65a3a]' : 'bg-gray-300'}`} />
                          <span className={`w-1.5 h-1.5 rounded-full ${getStepStatus(report.status, 'under-review') ? 'bg-[#b65a3a]' : 'bg-gray-300'}`} />
                          <span className={`w-1.5 h-1.5 rounded-full ${getStepStatus(report.status, 'assigned') ? 'bg-[#b65a3a]' : 'bg-gray-300'}`} />
                          <span className={`w-1.5 h-1.5 rounded-full ${getStepStatus(report.status, 'resolved') ? 'bg-[#b65a3a]' : 'bg-gray-300'}`} />
                        </div>
                        <div>
                          Reported: {report.submittedAt}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMUNITY STORIES */}
          {activeTab === 'stories' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              
              {/* Left Column: story form */}
              <div className="lg:col-span-2 bg-[#ede3d1]/40 border border-[#aa7b3f]/30 p-6 rounded-3xl space-y-5 shadow-lg">
                <div className="space-y-1">
                  <h2 className="font-display text-xl font-bold text-[#4b2f23]">
                    Share Local Heritage Stories
                  </h2>
                  <p className="text-[11px] text-[#4b2f23]/70 leading-relaxed">
                    Help keep local stories, family traditions, and cultural memories alive by sharing them here. Submissions are moderated.
                  </p>
                </div>

                {storySuccess ? (
                  <div className="p-5 rounded-2xl border border-emerald-500 bg-emerald-50 text-center space-y-4 animate-in zoom-in duration-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="font-display text-sm font-bold text-emerald-950">Submitted for Moderation</h3>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      Thank you for sharing your memory! Your story will be reviewed by the cultural preservation team before being published.
                    </p>
                    <button
                      onClick={() => setStorySuccess(false)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow"
                    >
                      Share Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleStorySubmit} className="space-y-4 text-xs font-semibold">
                    {storyErrors.length > 0 && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 space-y-0.5">
                        {storyErrors.map((err, i) => (
                          <div key={i}>• {err}</div>
                        ))}
                      </div>
                    )}

                    {/* Title */}
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#b65a3a]">Story Title *</label>
                      <input
                        type="text"
                        value={storyTitle}
                        onChange={(e) => setStoryTitle(e.target.value)}
                        placeholder="Give your story a title..."
                        className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-2.5 text-xs text-[#4b2f23] placeholder-[#4b2f23]/40 outline-none focus:border-[#b65a3a]"
                      />
                    </div>

                    {/* Monument select */}
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#b65a3a]">Heritage Site *</label>
                      <select
                        value={storyMonumentId}
                        onChange={(e) => setStoryMonumentId(e.target.value)}
                        className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-2.5 text-xs text-[#4b2f23] outline-none focus:border-[#b65a3a]"
                      >
                        <option value="">Select Heritage Site...</option>
                        {monumentsList.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Category select */}
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#b65a3a]">Submission Type *</label>
                      <select
                        value={storyCategory}
                        onChange={(e) => setStoryCategory(e.target.value)}
                        className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-2.5 text-xs text-[#4b2f23] outline-none focus:border-[#b65a3a]"
                      >
                        <option value="">Select Category...</option>
                        <option value="Oral History">Oral History</option>
                        <option value="Local Tradition">Local Tradition</option>
                        <option value="Family Memory">Family Memory</option>
                        <option value="Historical Story">Historical Story</option>
                        <option value="Festival / Ritual">Festival / Ritual</option>
                        <option value="Architectural Memory">Architectural Memory</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Story Body */}
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#b65a3a]">Story / Tradition *</label>
                      <textarea
                        value={storyText}
                        onChange={(e) => setStoryText(e.target.value)}
                        placeholder="Share a local memory, family story, oral tradition, festival tradition, historical observation, or cultural practice connected to this heritage site..."
                        rows={5}
                        className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-2.5 text-xs text-[#4b2f23] placeholder-[#4b2f23]/40 outline-none focus:border-[#b65a3a]"
                      />
                    </div>

                    {/* Contributor Name */}
                    <div className="space-y-1">
                      <label className="block text-[9px] uppercase tracking-wider text-[#b65a3a]">Contributor Name (Optional)</label>
                      <input
                        type="text"
                        value={storyContributor}
                        onChange={(e) => setStoryContributor(e.target.value)}
                        placeholder="e.g. Anjali Bose / anonymous"
                        className="w-full bg-[#f5f0e6] border border-[#aa7b3f]/40 rounded-xl px-4 py-2.5 text-xs text-[#4b2f23] placeholder-[#4b2f23]/40 outline-none focus:border-[#b65a3a]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingStory}
                      className="w-full py-3 rounded-xl bg-[#b65a3a] hover:bg-[#9e4a2e] text-white font-bold text-xs uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center shadow"
                    >
                      {isSubmittingStory ? 'Submitting Story...' : 'Submit Story for Review'}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: approved stories feed */}
              <div className="lg:col-span-3 space-y-5">
                <div className="border-b border-[#aa7b3f]/25 pb-2">
                  <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                    Published Community Stories
                  </h3>
                  <p className="text-[10px] text-[#4b2f23]/60 font-semibold uppercase tracking-wider">
                    Preserving India's Living Heritage
                  </p>
                </div>

                {publishedStories.length === 0 ? (
                  <div className="text-center py-12 p-8 rounded-3xl border border-dashed border-[#aa7b3f]/40 text-xs text-[#4b2f23]/60 space-y-2">
                    <BookOpen className="w-8 h-8 text-[#b65a3a] mx-auto" />
                    <p className="font-bold">No community stories have been published yet.</p>
                    <p>Be the first to preserve a memory by using the form on the left.</p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {publishedStories.map(story => (
                      <div 
                        key={story.id}
                        className="p-5 rounded-3xl bg-[#ede3d1]/30 border border-[#aa7b3f]/20 space-y-3 shadow-sm"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-[#aa7b3f]/10 pb-2">
                          <span className="px-2 py-0.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 font-bold text-[8px] uppercase tracking-wider text-[#b65a3a]">
                            {story.category}
                          </span>
                          <span className="font-mono text-[9px] text-[#4b2f23]/50">{story.submittedAt}</span>
                        </div>

                        <div>
                          <h4 className="font-display text-base font-bold text-[#4b2f23]">{story.title}</h4>
                          <span className="text-[9px] text-[#4b2f23]/60 font-semibold uppercase tracking-wider">{story.location}</span>
                        </div>

                        <p className="text-xs text-[#4b2f23]/80 leading-relaxed font-medium">
                          {story.story}
                        </p>

                        <div className="border-t border-[#aa7b3f]/10 pt-3 flex items-center justify-between text-[9px] font-bold text-[#4b2f23]/60">
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-[#b65a3a]" />
                            <span>Contributor: {story.contributorName}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* PRESERVATION INFORMATION GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-[#aa7b3f]/20">
          {/* Section A: Visitor Guidelines */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">Code of Conduct</span>
              <h2 className="font-display text-2xl font-bold text-[#4b2f23]">Responsible Visitor Protocol</h2>
            </div>
            
            <div className="space-y-4 text-xs font-semibold text-[#4b2f23]/80 leading-relaxed">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#ede3d1] border border-[#aa7b3f]/30 flex items-center justify-center shrink-0 font-bold text-[#b65a3a]">1</span>
                <div>
                  <h4 className="font-bold text-[#4b2f23]">Do Not Touch Inscribed Granites</h4>
                  <p className="text-[11px] text-[#4b2f23]/70 font-medium">Natural skin oils and perspiration dissolve subtle chiselled markings and encourage microscopic lichen growth on ancient surfaces.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#ede3d1] border border-[#aa7b3f]/30 flex items-center justify-center shrink-0 font-bold text-[#b65a3a]">2</span>
                <div>
                  <h4 className="font-bold text-[#4b2f23]">Stick to Elevated Walkways</h4>
                  <p className="text-[11px] text-[#4b2f23]/70 font-medium">Walking on sandbox plinths accelerates mechanical abrasions and shifts fragile sub-structural foundation stones.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-lg bg-[#ede3d1] border border-[#aa7b3f]/30 flex items-center justify-center shrink-0 font-bold text-[#b65a3a]">3</span>
                <div>
                  <h4 className="font-bold text-[#4b2f23]">Zero Single-Use Plastics</h4>
                  <p className="text-[11px] text-[#4b2f23]/70 font-medium">Windblown debris blocks ancient rainwater channels and cistern drainage slits, causing severe water stagnation.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section B: Science */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">Preservation Science</span>
              <h2 className="font-display text-2xl font-bold text-[#4b2f23]">Scientific Conservation Tech</h2>
            </div>

            <div className="space-y-4 text-xs font-semibold text-[#4b2f23]/80 leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#ede3d1]/50 border border-[#aa7b3f]/30 space-y-1.5 shadow-sm">
                <h4 className="font-bold text-[#b65a3a] inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>LiDAR & Photogrammetric Digital Twins</span>
                </h4>
                <p className="text-[11px] text-[#4b2f23]/75 font-medium leading-normal">
                  By firing millions of laser pulses, DHAROHAR and archaeologists capture point clouds accurate to 0.5mm. Even if cyclones cause future damage, geometry is immortalized forever in the 3D twin scan archives.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#ede3d1]/50 border border-[#aa7b3f]/30 space-y-1.5 shadow-sm">
                <h4 className="font-bold text-[#b65a3a] inline-flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>Sacrificial Clay Desalination Packs</span>
                </h4>
                <p className="text-[11px] text-[#4b2f23]/75 font-medium leading-normal">
                  Paper pulp and bentonite clay paste are applied to salt-encrusted shoreline stones. As the clay dries under the sun, it draws out hygroscopic marine salts safely without scraping rock details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* HERITAGE GUARDIAN PLEDGE & BADGE */}
        <div className="p-8 sm:p-12 rounded-3xl border border-[#aa7b3f]/40 shadow-2xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #ede3d1 0%, #f8f3eb 50%, #e8dbc7 100%)' }}
        >
          {/* Watermark grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6z' fill='%234b2f23' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
          />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Left Column: pledge input and tenets */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#b65a3a]">Become a Heritage Guardian</span>
                <h2 className="font-display text-3xl font-bold text-[#4b2f23] leading-tight">
                  Sign the Heritage Stewardship Pledge
                </h2>
                <p className="text-xs text-[#4b2f23]/80 leading-relaxed font-semibold">
                  Take a digital pledge to respect fragile heritage structures, support sustainable tourism, and preserve monuments for future generations.
                </p>
              </div>

              {!pledged ? (
                <form onSubmit={handlePledgeSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-[#b65a3a]">Your Name / Username</label>
                    <input
                      id="guardian-name-input"
                      type="text"
                      required
                      value={pledgeName}
                      onChange={(e) => setPledgeName(e.target.value)}
                      placeholder="e.g. Keerthana / Vikram"
                      className="w-full bg-[#f5f0e6] border-2 border-[#aa7b3f]/40 rounded-xl px-4 py-3 text-xs font-semibold text-[#4b2f23] outline-none focus:border-[#b65a3a] shadow-inner"
                    />
                  </div>

                  <div className="rounded-xl border border-[#aa7b3f]/30 bg-[#f5f0e6] text-[11px] font-semibold divide-y divide-[#aa7b3f]/10 shadow-inner">
                    <div className="flex gap-2.5 p-3 items-center">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>I will respect fragile heritage structures and never deface stone.</span>
                    </div>
                    <div className="flex gap-2.5 p-3 items-center">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>I will support responsible heritage tourism and minimize waste.</span>
                    </div>
                    <div className="flex gap-2.5 p-3 items-center">
                      <span className="text-emerald-700 font-bold shrink-0">✓</span>
                      <span>I will advocate for digital preservation and scientific conservation.</span>
                    </div>
                  </div>

                  <button
                    id="sign-pledge-btn"
                    type="submit"
                    className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, #b65a3a 0%, #aa7b3f 100%)' }}
                  >
                    Take the Guardian Pledge
                  </button>
                </form>
              ) : (
                /* Guardian status confirmation text */
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-center sm:text-left space-y-3 font-semibold text-emerald-950">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span className="text-sm font-bold">Stewardship Pledge Active</span>
                  </div>
                  <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                    You have taken the sacred pledge as a National Heritage Guardian. Your certificate details are saved and accessible below.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('dharohar_pledged');
                      setPledged(false);
                    }}
                    className="text-[10px] text-[#b65a3a] hover:underline font-bold"
                  >
                    Take pledge again with a different name
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: badge card preview & download action */}
            <div className="flex items-center justify-center">
              {pledged ? (
                <div className="space-y-4 w-full max-w-sm">
                  {/* Certified Badge Card Container (captured by html-to-image) */}
                  <div 
                    ref={badgeRef}
                    id="guardian-badge-node"
                    className="relative p-6 rounded-3xl border-4 border-double border-[#aa7b3f] bg-[#fcfaf7] shadow-xl overflow-hidden text-center text-[#4b2f23] w-full"
                    style={{ minHeight: '340px' }}
                  >
                    {/* Decorative corners */}
                    <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-[#aa7b3f]" />
                    <div className="absolute top-2 right-2 w-5 h-5 border-t border-r border-[#aa7b3f]" />
                    <div className="absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[#aa7b3f]" />
                    <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[#aa7b3f]" />

                    {/* Decorative center mandala watermark */}
                    <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                      <Landmark className="w-56 h-56" />
                    </div>

                    <div className="relative space-y-4">
                      <div className="space-y-0.5">
                        <div className="text-[8px] font-bold uppercase tracking-[0.25em] text-[#b65a3a]">
                          DHAROHAR Preserves
                        </div>
                        <h4 className="font-display text-xl font-bold text-[#4b2f23] tracking-wide leading-tight">
                          National Heritage Guardian
                        </h4>
                        <div className="text-[7px] uppercase font-bold tracking-[0.2em] text-[#aa7b3f]/80">
                          Certified Heritage Guardian
                        </div>
                      </div>

                      {/* Certificate Emblem */}
                      <div className="flex justify-center py-1">
                        <div className="w-10 h-10 rounded-full border border-[#aa7b3f] flex items-center justify-center bg-[#ede3d1]/30">
                          <Award className="w-5 h-5 text-[#b65a3a]" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] uppercase font-semibold text-[#4b2f23]/60 italic font-subheading">
                          This document certifies that
                        </span>
                        <div className="font-subheading text-lg font-bold text-[#b65a3a] border-b border-[#aa7b3f]/30 pb-0.5 max-w-[200px] mx-auto">
                          {pledgeName}
                        </div>
                      </div>

                      <p className="text-[9px] text-[#4b2f23]/80 leading-relaxed font-semibold italic max-w-xs mx-auto px-2 font-subheading">
                        "has pledged sacred stewardship to safeguard, respect, and document India's structural and architectural monuments for the next thousand generations."
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-[#aa7b3f]/15 text-[8px] font-mono font-bold text-[#4b2f23]/70">
                        <div>
                          Date: {pledgeDate}
                        </div>
                        <div>
                          ID: {credentialId}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Single Download Action */}
                  <button
                    onClick={handleDownloadBadge}
                    disabled={isDownloading}
                    className="w-full py-3 rounded-2xl bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-widest hover:bg-[#9e4a2e] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-75"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloading ? 'Generating Guardian Badge...' : 'Download Guardian Badge'}</span>
                  </button>
                </div>
              ) : (
                /* Guardian emblem placeholder if not pledged yet */
                <div className="p-8 rounded-3xl border-2 border-dashed border-[#aa7b3f]/40 flex flex-col items-center justify-center gap-3 bg-[#ede3d1]/20 text-[#4b2f23]/40 w-full max-w-sm aspect-video">
                  <Award className="w-12 h-12 text-[#aa7b3f]/60" />
                  <span className="text-xs font-bold uppercase tracking-wider text-center text-[#4b2f23]/60">
                    Badge Preview Awaiting Pledge
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* REPORT DETAILED VIEW MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-[#4b2f23]/65 flex items-center justify-center p-4 z-50 overflow-y-auto backdrop-blur-sm">
          <div className="bg-[#f5f0e6] border-2 border-[#aa7b3f] p-6 sm:p-8 rounded-3xl max-w-2xl w-full shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
            
            <button
              onClick={() => setSelectedReport(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#ede3d1] text-[#4b2f23] transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-[#aa7b3f]/25 pb-4 space-y-1">
              <span className="font-mono text-xs font-bold text-[#4b2f23]/60">Report ID: {selectedReport.id}</span>
              <h3 className="font-display text-2xl font-bold text-[#4b2f23]">{selectedReport.monumentName}</h3>
              <p className="text-[10px] text-[#4b2f23]/60 font-semibold uppercase tracking-wider">{selectedReport.state}</p>
            </div>

            {/* Modal Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="block font-bold text-[#4b2f23]/50 text-[10px] uppercase tracking-wider">Report Details</span>
                  <div className="text-xs space-y-1 text-[#4b2f23]/80">
                    <div>
                      <strong className="text-[#4b2f23]">Issue Type: </strong>
                      <span className="text-[#b65a3a] font-bold">{selectedReport.issueType}</span>
                    </div>
                    <div>
                      <strong className="text-[#4b2f23]">Severity: </strong>
                      <span className={`font-bold ${
                        selectedReport.severity === 'Critical' ? 'text-red-600' :
                        selectedReport.severity === 'High' ? 'text-orange-600' :
                        selectedReport.severity === 'Medium' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>{selectedReport.severity}</span>
                    </div>
                    <div>
                      <strong className="text-[#4b2f23]">Submitted On: </strong>
                      <span className="font-semibold">{selectedReport.submittedAt}</span>
                    </div>
                    {selectedReport.latitude && (
                      <div>
                        <strong className="text-[#4b2f23]">Coordinates: </strong>
                        <span className="font-mono font-bold text-[11px]">
                          {selectedReport.latitude.toFixed(5)}° N, {selectedReport.longitude.toFixed(5)}° E
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="block font-bold text-[#4b2f23]/50 text-[10px] uppercase tracking-wider">Observer Narrative</span>
                  <p className="text-xs text-[#4b2f23]/90 leading-relaxed font-semibold italic">
                    "{selectedReport.description}"
                  </p>
                </div>

                {/* AI Assessment / Modern Analysis */}
                <div className="p-4 rounded-2xl bg-[#ede3d1]/50 border border-[#aa7b3f]/30 space-y-1">
                  <span className="block text-[#b65a3a] font-bold text-[9px] uppercase tracking-wider inline-flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Preservation Analysis
                  </span>
                  <p className="text-[11px] text-[#4b2f23]/80 leading-relaxed font-medium">
                    {selectedReport.aiAssessment || 'Awaiting preservation review'}
                  </p>
                </div>
              </div>

              {/* Status Timeline & Image Column */}
              <div className="space-y-5">
                {/* Timeline */}
                <div className="space-y-3">
                  <span className="block font-bold text-[#4b2f23]/50 text-[10px] uppercase tracking-wider">Conservation Pipeline Status</span>
                  
                  <div className="relative pl-6 space-y-4">
                    {/* Timeline connection line */}
                    <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-[#aa7b3f]/25" />
                    
                    {[
                      { key: 'submitted', label: 'Submitted' },
                      { key: 'under-review', label: 'Under Review' },
                      { key: 'assigned', label: 'Assigned to Authority' },
                      { key: 'resolved', label: 'Resolved' }
                    ].map((step, idx) => {
                      const isCompleted = getStepStatus(selectedReport.status, step.key);
                      return (
                        <div key={idx} className="flex items-center gap-3 relative">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold z-10 transition-colors ${
                            isCompleted 
                              ? 'bg-[#b65a3a] border-[#b65a3a] text-white shadow-sm' 
                              : 'bg-[#ede3d1] border-[#aa7b3f]/40 text-[#4b2f23]/30'
                          }`}>
                            {isCompleted ? '✓' : idx + 1}
                          </div>
                          <div>
                            <span className={`text-xs font-bold uppercase tracking-wider text-[10px] ${isCompleted ? 'text-[#b65a3a]' : 'text-[#4b2f23]/40'}`}>
                              {step.label}
                            </span>
                            {step.key === 'assigned' && selectedReport.assignedTo && isCompleted && (
                              <span className="block text-[9px] font-mono text-[#4b2f23]/60 italic font-bold leading-normal">
                                to: {selectedReport.assignedTo}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Resolution notes if available */}
                {selectedReport.resolutionNote && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 font-semibold">
                    <span className="block text-emerald-800 text-[9px] uppercase tracking-wider">Resolution Charter</span>
                    <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                      {selectedReport.resolutionNote}
                    </p>
                    {selectedReport.resolvedAt && (
                      <span className="block text-[8px] text-emerald-800 font-mono">Resolved on: {selectedReport.resolvedAt}</span>
                    )}
                  </div>
                )}

                {/* Photo Image preview */}
                {selectedReport.image && (
                  <div className="space-y-1">
                    <span className="block font-bold text-[#4b2f23]/50 text-[10px] uppercase tracking-wider">Attached Image</span>
                    <div className="border border-[#aa7b3f]/40 rounded-2xl overflow-hidden shadow-inner bg-[#ede3d1]/30">
                      <img 
                        src={selectedReport.image} 
                        alt="Evidence photograph" 
                        className="w-full h-auto max-h-40 object-cover" 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
