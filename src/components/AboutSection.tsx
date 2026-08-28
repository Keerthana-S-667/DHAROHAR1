import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Sparkles,
  Bot,
  Target,
  GraduationCap,
  FlaskConical,
  Backpack,
  Cpu,
  Map,
  Gamepad2,
  ChevronRight
} from 'lucide-react';

/* ─────────────────────────────────────────────
   Tiny hook: returns true once the element
   enters the viewport (IntersectionObserver).
───────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

const featureCards = [
  { icon: MapPin,    title: 'Explore',          desc: 'Discover heritage sites across India through an interactive heritage map.' },
  { icon: Sparkles,  title: 'Experience in 3D', desc: 'Explore monuments through immersive 3D experiences and understand their architecture from a closer perspective.' },
  { icon: Bot,       title: 'Learn with AI',    desc: 'Interact with an AI heritage guide to discover stories, history, architecture, and cultural significance.' },
  { icon: Target,    title: 'Heritage Quest',   desc: 'Test your knowledge through monument-based quizzes, earn XP, unlock badges, and compete on the leaderboard.' },
];

const audienceCards = [
  { icon: GraduationCap, title: 'Students',                        desc: 'Learn history and architecture through interactive experiences rather than passive reading.' },
  { icon: FlaskConical,  title: 'Researchers',                     desc: 'Discover structured heritage information, architectural details, historical context, and research-oriented resources.' },
  { icon: Backpack,      title: 'Travellers & Heritage Enthusiasts', desc: 'Discover monuments, understand their significance, and plan meaningful heritage experiences.' },
];

const techItems = [
  { icon: Cpu,      label: '3D Technology',    sub: 'Immersive monument experiences.' },
  { icon: Bot,      label: 'AI',               sub: 'Interactive heritage storytelling.' },
  { icon: Map,      label: 'Interactive Maps', sub: 'Discover heritage across India.' },
  { icon: Gamepad2, label: 'Gamification',     sub: 'Learn through Heritage Quest.' },
];

const journey = ['Discover', 'Understand', 'Experience', 'Preserve'];

export const AboutSection: React.FC = () => {
  const header   = useInView(0.1);
  const features = useInView(0.1);
  const why      = useInView(0.1);
  const audience = useInView(0.1);
  const tech     = useInView(0.1);
  const closing  = useInView(0.1);

  const fadeUp = (inView: boolean, delay = 0) =>
    `transition-all duration-700 ease-out ${delay ? `[transition-delay:${delay}ms]` : ''} ${
      inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`;

  return (
    <section id="about-dharohar" className="bg-[#f5f0e6] text-[#4b2f23] font-body" aria-label="About DHAROHAR">

      {/* ── TOP DIVIDER ── */}
      <div className="w-full border-t border-[#d5b990]/60" />

      {/* ── 1 & 2: HEADER ── */}
      <div ref={header.ref} className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-14 text-center ${fadeUp(header.inView)}`}>
        <p className="text-[10px] sm:text-[11px] tracking-[0.22em] font-extrabold uppercase text-[#b65a3a] mb-5 flex items-center justify-center gap-2">
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
          About DHAROHAR
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
        </p>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#4b2f23] leading-tight tracking-wide mb-6">
          Preserving India's Heritage,<br />
          <span className="text-[#b65a3a]">One Story at a Time</span>
        </h2>
        <p className="text-sm sm:text-base text-[#4b2f23]/75 leading-relaxed max-w-2xl mx-auto">
          DHAROHAR is a digital heritage platform that brings India's monuments, history, architecture, and culture closer to the next generation through immersive technology.
        </p>
      </div>

      {/* ── 3: FEATURE CARDS ── */}
      <div ref={features.ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`group p-6 rounded-2xl bg-[#ede3d1] border border-[#d5b990] hover:border-[#b65a3a]/60 hover:shadow-md transition-all duration-300 cursor-default ${fadeUp(features.inView)}`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#b65a3a]/10 flex items-center justify-center mb-4 group-hover:bg-[#b65a3a]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#b65a3a]" />
                </div>
                <h3 className="font-display text-sm font-bold text-[#4b2f23] uppercase tracking-wide mb-2">{card.title}</h3>
                <p className="text-[12px] text-[#4b2f23]/70 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div className="border-t border-[#d5b990]/50" /></div>

      {/* ── 4: WHY DHAROHAR ── */}
      <div ref={why.ref} className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center ${fadeUp(why.inView)}`}>
        <p className="text-[10px] sm:text-[11px] tracking-[0.22em] font-extrabold uppercase text-[#b65a3a] mb-5 flex items-center justify-center gap-2">
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
          Why DHAROHAR?
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
        </p>
        <p className="text-sm text-[#4b2f23]/75 leading-relaxed max-w-2xl mx-auto mb-4">
          India's heritage is more than ancient structures — it is a living record of our history, architecture, traditions, and identity. Yet much of this knowledge remains difficult to access, especially for younger generations.
        </p>
        <p className="text-sm font-semibold text-[#4b2f23]/85 leading-relaxed max-w-2xl mx-auto mb-12">
          DHAROHAR uses technology to make heritage accessible, interactive, educational, and engaging.
        </p>
        {/* Journey */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {journey.map((step, i) => (
            <React.Fragment key={step}>
              <div className="px-5 py-2 rounded-full border border-[#d5b990] bg-[#ede3d1] text-[#4b2f23] text-xs font-bold uppercase tracking-widest hover:border-[#b65a3a] hover:bg-[#b65a3a]/10 transition-colors">
                {step}
              </div>
              {i < journey.length - 1 && <ChevronRight className="w-4 h-4 text-[#b65a3a]/50" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div className="border-t border-[#d5b990]/50" /></div>

      {/* ── 5: WHO IS IT FOR ── */}
      <div ref={audience.ref} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className={`text-[10px] sm:text-[11px] tracking-[0.22em] font-extrabold uppercase text-[#b65a3a] mb-10 text-center flex items-center justify-center gap-2 ${fadeUp(audience.inView)}`}>
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
          Who Is It For?
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {audienceCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                style={{ transitionDelay: `${i * 80}ms` }}
                className={`group p-6 rounded-2xl border border-[#d5b990] bg-[#ede3d1]/60 hover:border-[#b65a3a]/50 hover:bg-[#ede3d1] transition-all duration-300 text-center cursor-default ${fadeUp(audience.inView)}`}
              >
                <div className="w-11 h-11 rounded-full bg-[#b65a3a]/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#b65a3a]/20 transition-colors">
                  <Icon className="w-5 h-5 text-[#b65a3a]" />
                </div>
                <h3 className="font-display text-sm font-bold text-[#4b2f23] uppercase tracking-wide mb-2">{card.title}</h3>
                <p className="text-[12px] text-[#4b2f23]/70 leading-relaxed">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div className="border-t border-[#d5b990]/50" /></div>

      {/* ── 6: TECHNOLOGY MEETS HERITAGE ── */}
      <div ref={tech.ref} className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center ${fadeUp(tech.inView)}`}>
        <p className="text-[10px] sm:text-[11px] tracking-[0.22em] font-extrabold uppercase text-[#b65a3a] mb-10 flex items-center justify-center gap-2">
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
          Where Technology Meets Heritage
          <span className="w-6 h-px bg-[#b65a3a]/40 inline-block" />
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {techItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                style={{ transitionDelay: `${i * 60}ms` }}
                className={`p-5 rounded-xl border border-[#d5b990]/70 bg-[#ede3d1]/50 hover:border-[#b65a3a]/40 hover:bg-[#ede3d1] transition-all duration-300 cursor-default ${fadeUp(tech.inView)}`}
              >
                <Icon className="w-6 h-6 text-[#b65a3a] mx-auto mb-3" />
                <p className="text-xs font-bold text-[#4b2f23] uppercase tracking-wider mb-1">{item.label}</p>
                <p className="text-[11px] text-[#4b2f23]/60 leading-relaxed">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 7: CLOSING MESSAGE ── */}
      <div ref={closing.ref} className={`bg-[#4b2f23] text-[#f5f0e6] py-20 px-4 sm:px-6 lg:px-8 text-center ${fadeUp(closing.inView)}`}>
        <div className="max-w-3xl mx-auto space-y-6">
          <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug">
            We don't just want people to <span className="text-[#d5b990]">see</span> India's heritage.
          </p>
          <p className="text-sm sm:text-base text-[#f5f0e6]/75 leading-relaxed max-w-xl mx-auto">
            We want them to <strong className="text-[#d5b990]">understand</strong> it,{' '}
            <strong className="text-[#d5b990]">connect</strong> with it, and help{' '}
            <strong className="text-[#d5b990]">preserve</strong> it.
          </p>
          <div className="pt-6 border-t border-[#d5b990]/20">
            <p className="text-[10px] sm:text-[11px] tracking-[0.25em] font-extrabold uppercase text-[#d5b990]/70 leading-loose">
              Explore the Past.{' '}
              <span className="text-[#d5b990]">Experience it in 3D.</span>{' '}
              Preserve it for the Future.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};
