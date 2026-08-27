import React, { useState } from 'react';

export const TajMahalViewer: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  return (
    <div 
      className="relative w-full h-[340px] sm:h-[460px] lg:h-[620px] overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #F5EFE6 0%, #EDE5D8 50%, #E8DFD0 100%)' }}
    >
      
      {/* Loading state */}
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-[#b65a3a]/30 border-t-[#b65a3a] animate-spin" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#4b2f23]/50">Loading 3D Model…</span>
        </div>
      )}

      {/* Sketchfab 3D Embed — transparent background so beige shows through, with autospin=0.05 */}
      <iframe
        title="Taj Mahal 3D Model"
        src="https://sketchfab.com/models/7b43e635cbfb47719d5a124302b78579/embed?autostart=1&preload=1&ui_infos=0&ui_controls=0&ui_watermark=0&ui_help=0&ui_settings=0&ui_share=0&ui_annotations=0&ui_ar=0&ui_vr=0&transparent=1&autospin=0.05"
        allow="autoplay; fullscreen; xr-spatial-tracking"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          border: "0",
          background: "transparent",
          pointerEvents: isActivated ? 'auto' : 'none'
        }}
      />

      {/* Click-to-activate overlay — prevents iframe from stealing page focus */}
      {!isActivated && isLoaded && (
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onClick={() => setIsActivated(true)}
          title="Click to interact with the 3D model"
        />
      )}

      {/* Exit 3D button — returns focus to page */}
      {isActivated && (
        <button
          className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-full bg-[#ede3d1]/90 border border-[#d5b990] backdrop-blur-sm text-[10px] uppercase tracking-widest font-bold text-[#4b2f23]/70 hover:text-[#b65a3a] transition-colors cursor-pointer shadow-sm"
          onClick={() => setIsActivated(false)}
        >
          ✕ Exit 3D
        </button>
      )}

      {/* Top-center badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ede3d1]/85 border border-[#aa7b3f]/25 backdrop-blur-sm pointer-events-none shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-[#b65a3a] animate-pulse" />
        <span className="text-[9px] uppercase font-bold tracking-widest text-[#4b2f23]/80">Live 3D Model</span>
      </div>

      {/* Top-right coordinates */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end pointer-events-none">
        <span className="text-[9px] tracking-widest font-bold uppercase text-[#4b2f23]/35">27° 10′ 29″ N</span>
      </div>

      {/* Bottom gradient with title */}
      <div 
        className="absolute bottom-0 left-0 right-0 z-20 px-5 py-4 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(245,239,230,0.95) 0%, transparent 100%)' }}
      >
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[#b65a3a] font-bold text-sm font-display">01</span>
              <span className="text-[#4b2f23] font-display font-bold text-lg tracking-wider">Taj Mahal</span>
            </div>
            <span className="text-[#4b2f23]/55 text-xs italic ml-6">Agra • 1632 – 1653 CE</span>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[9px] font-bold text-[#4b2f23]/35 tracking-widest">78° 02′ 32″ E</span>
            <span className="text-[8px] uppercase tracking-wider text-[#b65a3a]/50 font-bold flex items-center gap-1">
              ◉ Drag to explore
            </span>
          </div>
        </div>
      </div>

      {/* Left edge fade into page */}
      <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#f5f0e6] to-transparent pointer-events-none z-[5]" />
    </div>
  );
};
