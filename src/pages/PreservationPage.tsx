import React, { useState } from 'react';
import confetti from 'canvas-confetti';
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
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b65a3a', '#aa7b3f', '#d5b990', '#22c55e']
      });
    } catch {}
  };

  const handleSharePledge = () => {
    navigator.clipboard?.writeText(`I just took the DHAROHAR National Heritage Guardian Pledge to preserve India's sacred architectural monuments!`);
    setCopiedPledge(true);
    setTimeout(() => setCopiedPledge(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] text-[#4b2f23] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/50 text-xs text-[#b65a3a] font-semibold uppercase tracking-widest shadow-lg">
            <ShieldCheck className="w-4 h-4" />
            <span>ASI & DHAROHAR Conservation Accord</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-[#4b2f23] tracking-tight">
            “PRESERVE WHAT WE INHERIT”
          </h1>

          <p className="font-subheading text-xl sm:text-2xl text-[#b65a3a] italic">
            {t.subtitle}
          </p>
        </div>

        {/* Responsible Visitor Guidelines 3-Pillar Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#aa7b3f]/20">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#b65a3a]">
                Code of Conduct
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#4b2f23]">
                Responsible Visitor Protocol
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                Do Not Touch Inscribed Granites
              </h3>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Natural human skin oils and acidic perspiration dissolve subtle epigraphical chisel marks and encourage destructive micro-lichen growth on 7th-century stones.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                Stick to Elevated Walkways
              </h3>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Treading on soft sandstone plinths accelerates mechanical abrasions and shifts fragile sub-structural foundation stones exposed to tidal sea surges.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/30 space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#f5f0e6] border border-[#aa7b3f]/40 text-[#b65a3a] flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="font-display text-lg font-bold text-[#4b2f23]">
                Zero Single-Use Plastics
              </h3>
              <p className="text-xs text-[#4b2f23]/70 leading-relaxed">
                Coastal sea breezes blow non-biodegradable debris into ancient water cisterns and temple foundation fissures, causing water stagnation and fungal erosion.
              </p>
            </div>
          </div>
        </div>

        {/* Digital Archaeology & Science Section */}
        <div className="rounded-3xl bg-[#f5f0e6] border border-[#aa7b3f]/40 p-8 sm:p-12 space-y-8 shadow-2xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#b65a3a]">
              <Layers className="w-3.5 h-3.5" />
              Scientific Conservation Technology
            </div>
            <h2 className="font-display text-3xl font-bold text-[#4b2f23]">
              How Digital Archaeology & Science Save Stone
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#b65a3a] font-bold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>LiDAR & Photogrammetric Digital Twins</span>
              </div>
              <p className="text-xs text-[#4b2f23]/80 leading-relaxed">
                By firing millions of laser pulses per second, DHAROHAR and archaeologists capture point clouds accurate to 0.5mm. Even if future cyclones cause erosion, the architectural geometry is immortalized forever.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#ede3d1] border border-[#aa7b3f]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#b65a3a] font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Sacrificial Clay Desalination Packs</span>
              </div>
              <p className="text-xs text-[#4b2f23]/80 leading-relaxed">
                Paper pulp and bentonite clay paste are applied to salt-encrusted ocean stones. As the clay dries under the sun, it draws out hygroscopic marine salts without touching the fragile rock carvings.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Heritage Guardian Pledge Generator */}
        <div className="relative p-8 sm:p-12 rounded-3xl overflow-hidden border-2 border-[#aa7b3f]/40 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, #ede3d1 0%, #f8f3eb 50%, #e8dbc7 100%)' }}
        >
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234b2f23' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
          />

          {/* Top golden border accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-1 bg-gradient-to-r from-transparent via-[#b65a3a] to-transparent rounded-full" />

          <div className="relative space-y-8">
            {/* Header */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="relative inline-flex">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b65a3a] to-[#aa7b3f] flex items-center justify-center mx-auto shadow-lg shadow-[#b65a3a]/25">
                  <Award className="w-8 h-8 text-[#f5f0e6]" />
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#b65a3a] mb-1">
                  DHAROHAR Preservation Initiative
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#4b2f23] leading-tight">
                  Become a Verified<br />
                  <span className="text-[#b65a3a]">Heritage Guardian</span>
                </h2>
              </div>

              <p className="text-sm text-[#4b2f23]/80 leading-relaxed max-w-lg mx-auto font-medium">
                Sign the digital pledge to safeguard ancient Indian monuments and receive your
                personalized <span className="text-[#b65a3a] font-bold">DHAROHAR Guardian Pass</span>.
              </p>
            </div>

            {!pledged ? (
              <form onSubmit={handlePledgeSubmit} className="max-w-md mx-auto space-y-5">
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">
                    Your Full Name
                  </label>
                  <input
                    id="guardian-name-input"
                    type="text"
                    required
                    value={pledgeName}
                    onChange={(e) => setPledgeName(e.target.value)}
                    placeholder="e.g. Aditi Sharma / Vikramaditya"
                    className="w-full bg-[#f5f0e6] border-2 border-[#aa7b3f]/40 rounded-xl px-4 py-3.5 text-sm font-semibold text-[#4b2f23] placeholder-[#4b2f23]/40 outline-none focus:border-[#b65a3a] focus:ring-2 focus:ring-[#b65a3a]/20 shadow-inner transition-all"
                  />
                </div>

                {/* The 4 Guardian Tenets */}
                <div className="rounded-2xl border-2 border-[#aa7b3f]/30 bg-[#f5f0e6]/90 overflow-hidden shadow-md">
                  <div className="px-4 py-3 border-b border-[#aa7b3f]/25 bg-[#ede3d1]">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b65a3a]">
                      The 4 Guardian Tenets
                    </span>
                  </div>
                  <div className="divide-y divide-[#aa7b3f]/15">
                    {[
                      { icon: '🏛️', tenet: 'I will never deface or touch fragile ancient carvings.', color: 'text-emerald-700' },
                      { icon: '💾', tenet: 'I will advocate for digital archiving and scientific restoration.', color: 'text-blue-700' },
                      { icon: '📢', tenet: 'I will educate others on cultural respect and non-intrusive visiting.', color: 'text-amber-700' },
                      { icon: '🌿', tenet: 'I will support sustainable heritage tourism and zero-waste visiting.', color: 'text-teal-700' },
                    ].map(({ icon, tenet, color }, i) => (
                      <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-[#ede3d1]/40 transition-colors">
                        <span className="text-base shrink-0 mt-0.5">{icon}</span>
                        <Check className={`w-4 h-4 ${color} shrink-0 mt-0.5 font-bold`} />
                        <span className="text-xs font-semibold text-[#4b2f23] leading-relaxed">{tenet}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  id="sign-pledge-btn"
                  type="submit"
                  className="w-full py-4 rounded-2xl font-bold text-sm uppercase tracking-[0.15em] cursor-pointer flex items-center justify-center gap-2.5 shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: 'linear-gradient(135deg, #b65a3a 0%, #aa7b3f 100%)',
                    boxShadow: '0 6px 20px rgba(182, 90, 58, 0.35)',
                    color: '#ffffff'
                  }}
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>Sign Digital Guardian Pledge</span>
                </button>

                <p className="text-center text-[11px] text-[#4b2f23]/60 font-medium leading-relaxed">
                  By signing, you join thousands of heritage guardians protecting India's monuments for future generations.
                </p>
              </form>
            ) : (
              /* Digital Certificate Pass */
              <div className="max-w-lg mx-auto p-8 rounded-3xl border-2 border-[#aa7b3f] shadow-2xl space-y-6 text-center animate-in zoom-in duration-300 bg-[#f5f0e6]">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#aa7b3f] to-[#b65a3a] flex items-center justify-center mx-auto shadow-lg shadow-[#b65a3a]/30">
                  <Award className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#b65a3a]">
                    Official Preservation Charter
                  </div>
                  <h3 className="font-display text-2xl font-bold text-[#4b2f23]">
                    Certified Heritage Guardian
                  </h3>
                  <p className="font-subheading text-xl text-[#b65a3a] italic font-bold">
                    {pledgeName}
                  </p>
                  <p className="text-[11px] text-[#4b2f23]/70 font-mono font-bold">
                    Credential ID: DH-2026-{(Math.random() * 90000 + 10000).toFixed(0)} • WGS-84 India
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#ede3d1] border border-[#aa7b3f]/30 text-xs text-[#4b2f23] font-semibold italic font-subheading">
                  "This certifies that {pledgeName} has pledged sacred stewardship to preserve India's architectural monuments for the next thousand generations."
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleSharePledge}
                    className="px-5 py-2.5 rounded-full bg-[#b65a3a] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#9e4a2e] transition-all flex items-center gap-1.5 shadow cursor-pointer"
                  >
                    {copiedPledge ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedPledge ? 'Pledge Copied!' : 'Share Certificate'}</span>
                  </button>
                  <button
                    onClick={() => setPledged(false)}
                    className="px-4 py-2.5 rounded-full bg-[#ede3d1] border border-[#aa7b3f]/40 text-xs font-bold text-[#b65a3a] hover:bg-[#f5f0e6] cursor-pointer"
                  >
                    Sign Another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
