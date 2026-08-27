import React, { useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  ShieldCheck, 
  Sparkles, 
  Heart, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Award, 
  Eye, 
  Landmark, 
  Compass, 
  Check, 
  Share2 
} from 'lucide-react';

interface PreservationPageProps {
  onNavigate: (route: string) => void;
  language: Language;
}

export const PreservationPage: React.FC<PreservationPageProps> = ({ onNavigate, language }) => {
  const [pledgeName, setPledgeName] = useState('');
  const [pledged, setPledged] = useState(false);
  const [copiedPledge, setCopiedPledge] = useState(false);
  const t = TRANSLATIONS[language].preservation;

  const handlePledgeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledgeName.trim()) return;
    setPledged(true);
  };

  const handleSharePledge = () => {
    navigator.clipboard?.writeText(`I just took the DHAROHAR National Heritage Guardian Pledge to preserve India's sacred architectural monuments!`);
    setCopiedPledge(true);
    setTimeout(() => setCopiedPledge(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#17130F] text-[#F3EBDD] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#2B2118] border border-[#D4A85A]/50 text-xs text-[#D4A85A] font-semibold uppercase tracking-widest shadow-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>ASI & DHAROHAR Conservation Accord</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#F3EBDD] tracking-tight">
            “PRESERVE WHAT WE INHERIT”
          </h1>

          <p className="font-subheading text-xl sm:text-2xl text-[#D4A85A] italic">
            {t.subtitle}
          </p>
        </div>

        {/* Responsible Visitor Guidelines 3-Pillar Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#D4A85A]/20">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#D4A85A]">
                Code of Conduct
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F3EBDD]">
                Responsible Visitor Protocol
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-display text-lg font-bold text-[#F3EBDD]">
                Do Not Touch Inscribed Granites
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                Natural human skin oils and acidic perspiration dissolve subtle epigraphical chisel marks and encourage destructive micro-lichen growth on 7th-century stones.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-display text-lg font-bold text-[#F3EBDD]">
                Stick to Elevated Walkways
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                Treading on soft sandstone plinths accelerates mechanical abrasions and shifts fragile sub-structural foundation stones exposed to tidal sea surges.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#17130F] border border-[#D4A85A]/40 text-[#D4A85A] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-display text-lg font-bold text-[#F3EBDD]">
                Zero Single-Use Plastics
              </h3>
              <p className="text-xs text-[#F3EBDD]/70 leading-relaxed">
                Coastal sea breezes blow non-biodegradable debris into ancient water cisterns and temple foundation fissures, causing water stagnation and fungal erosion.
              </p>
            </div>
          </div>
        </div>

        {/* Digital Archaeology & Science Section */}
        <div className="rounded-3xl bg-[#17130F] border border-[#D4A85A]/40 p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D4A85A]">
              <Layers className="w-3.5 h-3.5" />
              Scientific Conservation Technology
            </div>
            <h2 className="font-display text-3xl font-bold text-[#F3EBDD]">
              How Digital Archaeology & Science Save Stone
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#D4A85A] font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>LiDAR & Photogrammetric Digital Twins</span>
              </div>
              <p className="text-xs text-[#F3EBDD]/80 leading-relaxed">
                By firing millions of laser pulses per second, DHAROHAR and archaeologists capture point clouds accurate to 0.5mm. Even if future cyclones cause erosion, the architectural geometry is immortalized forever.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#2B2118] border border-[#D4A85A]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#D4A85A] font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Sacrificial Clay Desalination Packs</span>
              </div>
              <p className="text-xs text-[#F3EBDD]/80 leading-relaxed">
                Paper pulp and bentonite clay paste are applied to salt-encrusted ocean stones. As the clay dries under the sun, it draws out hygroscopic marine salts without touching the fragile rock carvings.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Heritage Guardian Pledge Generator */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#2B2118] via-[#17130F] to-[#2B2118] border border-[#D4A85A] shadow-2xl space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Award className="w-12 h-12 text-[#D4A85A] mx-auto animate-pulse" />
            <h2 className="font-display text-3xl font-bold text-[#F3EBDD]">
              Become a Verified Heritage Guardian
            </h2>
            <p className="text-xs sm:text-sm text-[#F3EBDD]/80">
              Sign the digital pledge to safeguard ancient Indian monuments and receive your personalized DHAROHAR Guardian Pass.
            </p>
          </div>

          {!pledged ? (
            <form onSubmit={handlePledgeSubmit} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#D4A85A] mb-1.5">
                  Your Full Name
                </label>
                <input
                  id="guardian-name-input"
                  type="text"
                  required
                  value={pledgeName}
                  onChange={(e) => setPledgeName(e.target.value)}
                  placeholder="e.g. Aditi Sharma / Vikramaditya"
                  className="w-full bg-[#17130F] border border-[#D4A85A]/40 rounded-xl px-4 py-3 text-sm text-[#F3EBDD] placeholder-[#F3EBDD]/40 outline-none focus:border-[#D4A85A]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#17130F]/80 border border-[#D4A85A]/20 text-xs text-[#F3EBDD]/80 space-y-2">
                <div className="font-bold text-[#D4A85A]">The 4 Guardian Tenets:</div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>I will never deface or touch fragile ancient carvings.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>I will advocate for digital archiving and scientific restoration.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>I will educate others on cultural respect and non-intrusive visiting.</span>
                </div>
              </div>

              <button
                id="sign-pledge-btn"
                type="submit"
                className="w-full py-4 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-all shadow-xl shadow-[#D4A85A]/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Sign Digital Guardian Pledge</span>
              </button>
            </form>
          ) : (
            /* Digital Certificate Pass */
            <div className="max-w-lg mx-auto p-8 rounded-3xl bg-[#17130F] border-2 border-[#D4A85A] shadow-2xl space-y-6 text-center animate-in zoom-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#D4A85A] text-[#17130F] flex items-center justify-center mx-auto shadow-lg">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#D4A85A]">
                  Official Preservation Charter
                </div>
                <h3 className="font-display text-2xl font-bold text-[#F3EBDD]">
                  Certified Heritage Guardian
                </h3>
                <p className="font-subheading text-xl text-[#D4A85A] italic font-bold">
                  {pledgeName}
                </p>
                <p className="text-[11px] text-[#F3EBDD]/60 font-mono">
                  Credential ID: DH-2026-{(Math.random() * 90000 + 10000).toFixed(0)} • WGS-84 India
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#2B2118] border border-[#D4A85A]/30 text-xs text-[#F3EBDD]/90 italic font-subheading">
                “This certifies that {pledgeName} has pledged sacred stewardship to preserve India's architectural monuments for the next thousand generations.”
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleSharePledge}
                  className="px-5 py-2.5 rounded-full bg-[#D4A85A] text-[#17130F] font-bold text-xs uppercase tracking-wider hover:bg-[#F3EBDD] transition-all flex items-center gap-1.5 shadow"
                >
                  {copiedPledge ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedPledge ? 'Pledge Copied!' : 'Share Certificate'}</span>
                </button>
                <button
                  onClick={() => setPledged(false)}
                  className="px-4 py-2.5 rounded-full bg-[#2B2118] border border-[#D4A85A]/40 text-xs text-[#D4A85A] hover:bg-[#17130F]"
                >
                  Sign Another
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
