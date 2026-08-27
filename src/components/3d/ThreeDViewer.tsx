import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Minimize2, RefreshCw, Box, HelpCircle } from 'lucide-react';
import { MonumentHotspot } from '../../types';

interface ThreeDViewerProps {
  modelUrl?: string | null;
  sketchfabId?: string | null;
  sketchfabUrl?: string | null;
  monumentId: string;
  hotspots: MonumentHotspot[];
  selectedHotspotId: string | null;
  onSelectHotspot: (hotspot: MonumentHotspot) => void;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  modelUrl,
  sketchfabId,
  sketchfabUrl,
  monumentId,
  hotspots,
  selectedHotspotId,
  onSelectHotspot
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(45); // rotation in degrees
  const [zoom, setZoom] = useState(100); // zoom percentage
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset view handler
  const handleReset = () => {
    setRotation(45);
    setZoom(100);
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error entering fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Drag interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStartRef.current.x;
    setRotation(prev => (prev + deltaX * 0.5) % 360);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Scroll zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => {
      const next = prev - e.deltaY * 0.1;
      return Math.max(50, Math.min(200, next));
    });
  };

  return (
    <div
      ref={containerRef}
      onWheel={sketchfabId ? undefined : handleWheel}
      className={`relative w-full rounded-3xl overflow-hidden border border-[#D4A85A]/40 bg-[#17130F] shadow-2xl flex flex-col justify-between select-none ${
        isFullscreen ? 'h-screen w-screen rounded-none' : 'h-[500px] sm:h-[550px]'
      }`}
      style={{ cursor: sketchfabId ? 'default' : (isDragging ? 'grabbing' : 'grab') }}
    >
      {/* Sketchfab Embedded iFrame or Fallback Interactive Canvas */}
      {sketchfabId ? (
        <div className="absolute inset-0 z-0">
          <iframe
            title="Sketchfab 3D Model"
            className="w-full h-full border-0"
            src={`https://sketchfab.com/models/${sketchfabId}/embed?autostart=1&internal=1&tracking=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_watermark=0`}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            execution-while-out-of-viewport
            execution-while-not-rendered
            web-share
          />
        </div>
      ) : (
        /* 3D Stage Backdrop & Grid */
        <div 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className="absolute inset-0 flex flex-col justify-center items-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(#d4a85a08_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
          
          {/* Glowing Horizon */}
          <div className="absolute bottom-1/4 w-[150%] h-[1px] bg-gradient-to-r from-transparent via-[#D4A85A]/25 to-transparent blur-[1px]" />
          
          {/* Animated Wireframe 3D Geometry Representation */}
          <div 
            className="relative transition-transform duration-75 ease-out flex items-center justify-center"
            style={{ 
              transform: `rotateY(${rotation}deg) scale(${zoom / 100})`,
              transformStyle: 'preserve-3d',
              perspective: '1000px'
            }}
          >
            {/* Abstract geometric mesh skeleton representing a structural heritage monument */}
            <div className="w-56 h-56 border-2 border-dashed border-[#D4A85A]/20 rounded-xl flex items-center justify-center animate-pulse">
              <div className="w-40 h-40 border-2 border-[#D4A85A]/40 rotate-45 flex items-center justify-center">
                <div className="w-24 h-24 border border-double border-[#D4A85A]/60 flex items-center justify-center">
                  <Box className="w-10 h-10 text-[#D4A85A] opacity-80" />
                </div>
              </div>
            </div>

            {/* Floating coordinates lines */}
            <div className="absolute w-72 h-[1px] bg-red-500/30" />
            <div className="absolute h-72 w-[1px] bg-green-500/30" />
            
            {/* Hotspot anchor flags rendered inside the 3D space */}
            {hotspots.map((hotspot, index) => {
              const angle = (index * (360 / (hotspots.length || 1)) + rotation) * (Math.PI / 180);
              const radius = 110;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * 30 - 40;

              const isSelected = selectedHotspotId === hotspot.id;

              return (
                <button
                  key={hotspot.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectHotspot(hotspot);
                  }}
                  className={`absolute z-20 px-3 py-1.5 rounded-full border text-[10px] font-bold tracking-wider transition-all flex items-center gap-1 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
                    isSelected
                      ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A] scale-110 shadow-lg shadow-[#D4A85A]/35'
                      : 'bg-[#2B2118]/90 text-[#F3EBDD]/90 border-[#D4A85A]/40 hover:border-[#D4A85A]'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: 'translate(-50%, -50%)',
                    transformStyle: 'flat'
                  }}
                >
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-950 animate-ping' : 'bg-[#D4A85A]'}`} />
                  <span>{hotspot.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Model Overlay Header */}
      <div className="relative z-10 p-5 flex items-center justify-between w-full bg-gradient-to-b from-[#17130F] to-transparent pointer-events-none">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-[10px] uppercase font-bold text-[#D4A85A]">
            <Box className="w-3 h-3" />
            3D Heritage Model
          </span>
          <p className="text-xs text-[#F3EBDD]/60 pt-1">
            {sketchfabId ? 'Live Sketchfab 3D Embed Active' : (modelUrl ? 'GLB Asset Registered' : 'Interactive Architectural Mesh')}
          </p>
        </div>
        
        {sketchfabUrl && (
          <a
            href={sketchfabUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto px-3.5 py-1.5 rounded-xl bg-[#2B2118]/90 border border-[#D4A85A]/40 hover:border-[#D4A85A] text-xs font-semibold text-[#D4A85A] transition-colors"
          >
            View on Sketchfab ↗
          </a>
        )}
      </div>

      {/* 3D Control Panel Overlay Footer */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-[#17130F] to-transparent w-full flex flex-wrap justify-between items-center gap-3">
        <div className="text-[10px] text-[#F3EBDD]/60 flex items-center gap-4">
          <span>{sketchfabId ? '🖱 Orbit & Zoom directly in Sketchfab 3D window' : '🖱 Drag to rotate • 🌀 Scroll to zoom'}</span>
        </div>

        <div className="flex items-center gap-1.5 bg-[#2B2118]/80 border border-[#D4A85A]/30 p-1.5 rounded-2xl">
          <button
            onClick={toggleFullscreen}
            title="Fullscreen View"
            className="p-2 rounded-lg hover:bg-[#17130F] text-[#F3EBDD]/80 hover:text-[#D4A85A] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
