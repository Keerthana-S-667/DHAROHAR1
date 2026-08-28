import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Compass, AlertTriangle, Navigation, Layers, Map as MapIcon, Globe, RefreshCw, Route, ShieldAlert } from 'lucide-react';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { mapService } from '../services/mapService';
import { Monument } from '../types';
import { getMonumentRiskProfile, RiskLevel } from '../data/heritageRiskData';

interface HeritageMapProps {
  selectedMonumentId: string | null;
  onSelectMonument?: (id: string | null) => void;
  onNavigateHere?: (id: string) => void;
  routeGeometry?: any;
  userLocationOverride?: { latitude: number; longitude: number } | null;
  onNavigate?: (route: string) => void;
  onResetView?: () => void;
}

const RISK_MARKER_COLORS: Record<RiskLevel, { pinBg: string; border: string; dot: string; glow: string; text: string }> = {
  high: {
    pinBg: '#ef4444',
    border: '#ffffff',
    dot: '#ffffff',
    glow: 'rgba(239, 68, 68, 0.75)',
    text: 'text-red-600'
  },
  moderate: {
    pinBg: '#f59e0b',
    border: '#ffffff',
    dot: '#ffffff',
    glow: 'rgba(245, 158, 11, 0.75)',
    text: 'text-amber-600'
  },
  low: {
    pinBg: '#22c55e',
    border: '#ffffff',
    dot: '#ffffff',
    glow: 'rgba(34, 197, 94, 0.75)',
    text: 'text-emerald-600'
  }
};

export const HeritageMap: React.FC<HeritageMapProps> = ({
  selectedMonumentId,
  onSelectMonument,
  onNavigateHere,
  routeGeometry,
  userLocationOverride,
  onNavigate,
  onResetView
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const leafletMarkersRef = useRef<Map<string, any>>(new Map());
  const userMarkerRef = useRef<any>(null);
  const polylineRef = useRef<any>(null);

  const userLocationFromStore = useStore((state) => state.userLocation);
  const travellerPreferences = useStore((state) => state.travellerPreferences);
  const userLocation = userLocationOverride || userLocationFromStore;

  const [isLeafletReady, setIsLeafletReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [activeMonument, setActiveMonument] = useState<Monument | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');

  const allMonuments = Object.values(heritageService.getMonuments());

  const googleTileUrls = {
    roadmap: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    satellite: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    terrain: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}'
  };

  // 1. Load Leaflet script and CSS
  useEffect(() => {
    mapService.loadLeaflet()
      .then(() => {
        setIsLeafletReady(true);
      })
      .catch((err) => {
        console.error('Failed to load Leaflet map engine:', err);
        setHasError(true);
      });
  }, []);

  // 2. Initialize Leaflet Map
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Default pan-India center coordinates
    const indiaCenter: [number, number] = [22.5937, 78.9629];
    const initialZoom = selectedMonumentId ? 13 : 5;

    let centerCoords: [number, number] = indiaCenter;

    if (selectedMonumentId) {
      const selectedMon = heritageService.getMonumentById(selectedMonumentId);
      if (selectedMon) {
        centerCoords = [selectedMon.location.lat, selectedMon.location.lng];
        setActiveMonument(selectedMon);
      }
    } else {
      setActiveMonument(null);
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: initialZoom,
        zoomControl: true,
        attributionControl: false
      });

      const tileLayer = L.tileLayer(googleTileUrls[mapType], {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      leafletMapRef.current = map;

      // Render User Location Marker
      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'dharohar-user-pin',
          html: `<div style="
            width: 22px;
            height: 22px;
            background: #2563EB;
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 16px rgba(37, 99, 235, 0.95);
          "></div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11]
        });
        userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
          .addTo(map)
          .bindTooltip('Your Current Location', { permanent: false, direction: 'top' });
      }

      // Render all 25 monument risk markers
      const markerBounds: [number, number][] = [];
      leafletMarkersRef.current.clear();

      allMonuments.forEach((mon) => {
        const isActive = selectedMonumentId === mon.id;
        const coords: [number, number] = [mon.location.lat, mon.location.lng];
        markerBounds.push(coords);

        const riskProf = getMonumentRiskProfile(mon.id);
        const color = RISK_MARKER_COLORS[riskProf.riskLevel];

        const pinSize = isActive ? 34 : 26;

        const pinHtml = `
          <div style="
            width: ${pinSize}px;
            height: ${pinSize}px;
            background: ${color.pinBg};
            border: 2px solid ${isActive ? '#FFFFFF' : color.border};
            border-radius: 50%;
            box-shadow: 0 4px 16px ${color.glow};
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            cursor: pointer;
            position: relative;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background: ${color.dot};
              border-radius: 50%;
            "></div>
          </div>
        `;

        const icon = L.divIcon({
          className: `dharohar-risk-pin-${mon.id}`,
          html: pinHtml,
          iconSize: [pinSize, pinSize],
          iconAnchor: [pinSize / 2, pinSize / 2]
        });

        const marker = L.marker(coords, { icon }).addTo(map);

        // Tooltip showing name and risk
        const riskEmoji = riskProf.riskLevel === 'high' ? '🔴' : riskProf.riskLevel === 'moderate' ? '🟡' : '🟢';
        marker.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 11px; padding: 2px 4px;">
            <strong>${mon.name}</strong><br/>
            <span>${riskEmoji} ${riskProf.riskLevel.toUpperCase()} RISK (${riskProf.riskScore}/100)</span><br/>
            <span style="opacity: 0.75; font-size: 10px;">${riskProf.primaryRisk}</span>
          </div>
        `, { direction: 'top', offset: [0, -12] });

        // Popup Container
        const popupContainer = document.createElement('div');
        popupContainer.style.fontFamily = 'sans-serif';
        popupContainer.style.padding = '2px';
        popupContainer.style.maxWidth = '230px';

        popupContainer.innerHTML = `
          <div style="background: #2B2118; color: #F3EBDD; padding: 12px; border-radius: 12px; border: 1px solid rgba(212,168,90,0.5); box-shadow: 0 10px 30px rgba(0,0,0,0.85);">
            <div style="display: flex; items-center; justify-content: space-between; margin-bottom: 6px;">
              <span style="font-size: 9px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${color.pinBg}; color: #fff; text-transform: uppercase;">
                ${riskEmoji} ${riskProf.riskLevel} RISK (${riskProf.riskScore}/100)
              </span>
            </div>
            <div style="font-weight: bold; font-size: 13px; color: #F3EBDD; margin-bottom: 4px;">${mon.name}</div>
            <p style="font-size: 10px; color: rgba(243,235,221,0.7); margin: 0 0 6px 0;">${mon.location.city}, ${mon.location.state}</p>
            <img src="${mon.heroImage}" alt="${mon.name}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 8px; border: 1px solid rgba(212,168,90,0.3);" />
            <p style="font-size: 10px; margin: 0 0 10px 0; color: #D4A85A; font-weight: bold;">
              Primary Risk: ${riskProf.primaryRisk}
            </p>
            <div style="display: flex; gap: 6px;">
              <button id="leaflet-btn-risk-${mon.id}" style="flex: 1; background: #b65a3a; color: #ffffff; border: none; padding: 6px 8px; border-radius: 6px; font-size: 9px; font-weight: bold; cursor: pointer; text-transform: uppercase;">
                RISK DETAILS
              </button>
              ${mon.has3DModel ? `
                <button id="leaflet-btn-3d-${mon.id}" style="flex: 1; background: #aa7b3f; color: #ffffff; border: none; padding: 6px 8px; border-radius: 6px; font-size: 9px; font-weight: bold; cursor: pointer; text-transform: uppercase;">
                  3D VIEW
                </button>
              ` : ''}
            </div>
          </div>
        `;

        marker.bindPopup(popupContainer, {
          closeButton: true,
          className: 'dharohar-leaflet-popup'
        });

        marker.on('click', () => {
          if (onSelectMonument) onSelectMonument(mon.id);
          setActiveMonument(mon);
          map.flyTo(coords, 14, { duration: 1.2 });
        });

        marker.on('popupopen', () => {
          setTimeout(() => {
            const riskBtn = document.getElementById(`leaflet-btn-risk-${mon.id}`);
            if (riskBtn) {
              riskBtn.onclick = () => {
                if (onSelectMonument) onSelectMonument(mon.id);
              };
            }
            const tdBtn = document.getElementById(`leaflet-btn-3d-${mon.id}`);
            if (tdBtn) {
              tdBtn.onclick = () => {
                if (onNavigate) onNavigate(`monument/${mon.id}/3d`);
                else window.location.hash = `/monument/${mon.id}/3d`;
              };
            }
          }, 50);
        });

        leafletMarkersRef.current.set(mon.id, marker);
      });

      // Fit bounds to all 25 monuments on initial load if no monument is pre-selected
      if (!selectedMonumentId && markerBounds.length > 0) {
        map.fitBounds(markerBounds, { padding: [40, 40] });
      }

      return () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
      };
    } catch (err) {
      console.error('Leaflet initialization error:', err);
      setHasError(true);
    }
  }, [isLeafletReady]);

  // 3. Switch Tile Layers when mapType changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !isLeafletReady) return;
    const L = (window as any).L;
    if (!L) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(googleTileUrls[mapType], {
      maxZoom: 20,
      attribution: '&copy; Google Maps'
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [mapType, isLeafletReady]);

  // 4. React to selectedMonumentId Changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !isLeafletReady) return;

    if (selectedMonumentId) {
      const selectedMon = heritageService.getMonumentById(selectedMonumentId);
      if (selectedMon) {
        setActiveMonument(selectedMon);
        const marker = leafletMarkersRef.current.get(selectedMonumentId);
        if (marker) {
          map.flyTo([selectedMon.location.lat, selectedMon.location.lng], 13, { duration: 1 });
          marker.openPopup();
        }
      }
    } else {
      setActiveMonument(null);
      // Fit back to all monuments
      const allCoords: [number, number][] = allMonuments.map(m => [m.location.lat, m.location.lng]);
      if (allCoords.length > 0) {
        map.fitBounds(allCoords, { padding: [40, 40] });
      }
    }
  }, [selectedMonumentId, isLeafletReady]);

  // 5. Draw Route Polyline when routeGeometry changes
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !isLeafletReady) return;
    const L = (window as any).L;
    if (!L) return;

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (routeGeometry && routeGeometry.coordinates && routeGeometry.coordinates.length > 0) {
      const path: [number, number][] = routeGeometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
      );

      const polyline = L.polyline(path, {
        color: '#b65a3a',
        weight: 5,
        opacity: 0.9,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      polylineRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
    }
  }, [routeGeometry, isLeafletReady]);

  const handleResetToWholeIndia = () => {
    const map = leafletMapRef.current;
    if (map) {
      const allCoords: [number, number][] = allMonuments.map(m => [m.location.lat, m.location.lng]);
      if (allCoords.length > 0) {
        map.fitBounds(allCoords, { padding: [40, 40] });
      }
    }
    if (onSelectMonument) onSelectMonument(null);
    if (onResetView) onResetView();
  };

  if (hasError) {
    return (
      <div className="relative rounded-3xl bg-[#ede3d1] border border-[#aa7b3f]/40 overflow-hidden min-h-[450px] flex flex-col justify-between p-6">
        <div className="flex items-center gap-2 p-3 bg-amber-900/20 border border-amber-500/30 rounded-xl text-xs text-[#b65a3a]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Interactive Map Engine Offline. Using spatial landmark listing.</span>
        </div>
        <div className="text-center py-12 space-y-2">
          <Compass className="w-12 h-12 text-[#b65a3a]/40 mx-auto" />
          <p className="text-sm font-bold text-[#4b2f23]">Pan-India Heritage Spatial View</p>
          <p className="text-xs text-[#4b2f23]/60">25 heritage monuments mapped across India.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[580px] rounded-3xl overflow-hidden border border-[#aa7b3f]/40 shadow-2xl">
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full bg-[#f5f0e6] z-0" />

      {/* Top Left Risk Legend */}
      <div className="absolute top-3 left-3 bg-[#ede3d1]/95 border border-[#aa7b3f]/40 rounded-2xl p-3 shadow-xl backdrop-blur-md z-10 space-y-1.5 text-xs">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#b65a3a] flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Heritage Risk Legend</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-semibold text-[#4b2f23]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> High</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" /> Moderate</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Low</span>
        </div>
      </div>

      {/* Top Right Controls (View All 25 + Map Layers) */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={handleResetToWholeIndia}
          title="Reset map view to whole India"
          className="px-3.5 py-1.5 rounded-xl bg-[#b65a3a] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:bg-[#9e4a2e] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>View All 25</span>
        </button>

        <div className="bg-[#ede3d1]/95 border border-[#aa7b3f]/40 rounded-xl p-1 shadow-xl backdrop-blur-md flex items-center gap-1">
          <button
            onClick={() => setMapType('roadmap')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              mapType === 'roadmap'
                ? 'bg-[#b65a3a] text-white shadow-md'
                : 'text-[#4b2f23]/80 hover:bg-[#f5f0e6]'
            }`}
          >
            <MapIcon className="w-3 h-3" />
            <span>Map</span>
          </button>

          <button
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
              mapType === 'satellite'
                ? 'bg-[#b65a3a] text-white shadow-md'
                : 'text-[#4b2f23]/80 hover:bg-[#f5f0e6]'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Satellite</span>
          </button>
        </div>
      </div>
    </div>
  );
};
