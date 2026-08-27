import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Compass, AlertTriangle, Navigation, Layers, Map as MapIcon, Globe } from 'lucide-react';
import { useStore } from '../store/store';
import { heritageService } from '../services/heritageService';
import { mapService } from '../services/mapService';
import { Monument } from '../types';

interface HeritageMapProps {
  selectedMonumentId: string | null;
  onSelectMonument?: (id: string) => void;
  onNavigateHere?: (id: string) => void;
  routeGeometry?: any;
  userLocationOverride?: { latitude: number; longitude: number } | null;
  onNavigate?: (route: string) => void;
}

export const HeritageMap: React.FC<HeritageMapProps> = ({
  selectedMonumentId,
  onSelectMonument,
  onNavigateHere,
  routeGeometry,
  userLocationOverride,
  onNavigate
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

    // Destroy previous map instance if it exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    let centerCoords: [number, number] = [20.5937, 78.9629]; // Default India center

    if (selectedMonumentId) {
      const selectedMon = heritageService.getMonumentById(selectedMonumentId);
      if (selectedMon) {
        centerCoords = [selectedMon.location.lat, selectedMon.location.lng];
        setActiveMonument(selectedMon);
      }
    } else if (userLocation) {
      centerCoords = [userLocation.latitude, userLocation.longitude];
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: centerCoords,
        zoom: selectedMonumentId ? 13 : 5,
        zoomControl: true,
        attributionControl: false
      });

      // Original Full-Color Google Maps tile layer
      const tileLayer = L.tileLayer(googleTileUrls[mapType], {
        maxZoom: 20,
        attribution: '&copy; Google Maps'
      }).addTo(map);

      tileLayerRef.current = tileLayer;
      leafletMapRef.current = map;

      // Render User Location Pin
      if (userLocation) {
        const userIcon = L.divIcon({
          className: 'dharohar-user-pin',
          html: `<div style="
            width: 20px;
            height: 20px;
            background: #2563EB;
            border: 3px solid #FFFFFF;
            border-radius: 50%;
            box-shadow: 0 0 14px rgba(37, 99, 235, 0.9);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        userMarkerRef.current = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
          .addTo(map)
          .bindTooltip('Your Current Location', { permanent: false, direction: 'top' });
      }

      // Render Monument Pins
      const markerBounds: [number, number][] = [];
      leafletMarkersRef.current.clear();

      allMonuments.forEach((mon) => {
        const isActive = selectedMonumentId === mon.id;
        const coords: [number, number] = [mon.location.lat, mon.location.lng];
        markerBounds.push(coords);

        const pinHtml = `
          <div style="
            width: ${isActive ? '30px' : '24px'};
            height: ${isActive ? '30px' : '24px'};
            background: ${isActive ? '#D4A85A' : '#2B2118'};
            border: 2px solid ${isActive ? '#FFFFFF' : '#D4A85A'};
            border-radius: 50%;
            box-shadow: 0 4px 14px ${isActive ? 'rgba(212, 168, 90, 0.9)' : 'rgba(0,0,0,0.6)'};
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            cursor: pointer;
          ">
            <div style="
              width: 9px;
              height: 9px;
              background: ${isActive ? '#17130F' : '#D4A85A'};
              border-radius: 50%;
            "></div>
          </div>
        `;

        const icon = L.divIcon({
          className: `dharohar-monument-pin-${mon.id}`,
          html: pinHtml,
          iconSize: [isActive ? 30 : 24, isActive ? 30 : 24],
          iconAnchor: [isActive ? 15 : 12, isActive ? 15 : 12]
        });

        const marker = L.marker(coords, { icon }).addTo(map);

        // Custom Popup Content
        const popupContainer = document.createElement('div');
        popupContainer.style.fontFamily = 'sans-serif';
        popupContainer.style.padding = '2px';
        popupContainer.style.maxWidth = '220px';

        popupContainer.innerHTML = `
          <div style="background: #2B2118; color: #F3EBDD; padding: 12px; border-radius: 12px; border: 1px solid rgba(212,168,90,0.5); box-shadow: 0 10px 30px rgba(0,0,0,0.85);">
            <div style="font-weight: bold; font-size: 13px; color: #F3EBDD; margin-bottom: 4px; border-bottom: 1px solid rgba(212,168,90,0.25); padding-bottom: 4px;">${mon.name}</div>
            <img src="${mon.heroImage}" alt="${mon.name}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 8px; margin-bottom: 8px; border: 1px solid rgba(212,168,90,0.3);" />
            <p style="font-size: 10px; margin: 0 0 10px 0; color: rgba(243,235,221,0.75); line-height: 1.35; font-style: italic;">${mon.tagline}</p>
            <div style="display: flex; gap: 6px;">
              <button id="leaflet-btn-exp-${mon.id}" style="flex: 1; background: #17130F; color: #D4A85A; border: 1px solid #D4A85A; padding: 6px 8px; border-radius: 6px; font-size: 9px; font-weight: bold; cursor: pointer; text-transform: uppercase;">
                EXPLORE
              </button>
              ${mon.has3DModel ? `
                <button id="leaflet-btn-3d-${mon.id}" style="flex: 1; background: #D4A85A; color: #17130F; border: none; padding: 6px 8px; border-radius: 6px; font-size: 9px; font-weight: bold; cursor: pointer; text-transform: uppercase;">
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
            const expBtn = document.getElementById(`leaflet-btn-exp-${mon.id}`);
            if (expBtn) {
              expBtn.onclick = () => {
                if (onNavigate) onNavigate(`monument/${mon.id}`);
                else window.location.hash = `/monument/${mon.id}`;
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

      // Fit bounds if no specific monument selected
      if (!selectedMonumentId && markerBounds.length > 0) {
        map.fitBounds(markerBounds, { padding: [50, 50] });
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
    if (!map || !selectedMonumentId) return;

    const selectedMon = heritageService.getMonumentById(selectedMonumentId);
    if (selectedMon) {
      setActiveMonument(selectedMon);
      const marker = leafletMarkersRef.current.get(selectedMonumentId);
      if (marker) {
        map.flyTo([selectedMon.location.lat, selectedMon.location.lng], 14, { duration: 1 });
        marker.openPopup();
      }
    }
  }, [selectedMonumentId]);

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
      // Leaflet expects [lat, lng] array
      const path: [number, number][] = routeGeometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
      );

      const polyline = L.polyline(path, {
        color: '#D4A85A',
        weight: 6,
        opacity: 0.95,
        dashArray: '8, 8',
        lineCap: 'round'
      }).addTo(map);

      polylineRef.current = polyline;
      map.fitBounds(polyline.getBounds(), { padding: [60, 60] });
    }
  }, [routeGeometry, isLeafletReady]);

  // Distance / Time Helper
  const getDistanceAndDuration = (mon: Monument) => {
    const fromCoords = userLocation || { latitude: 12.6163, longitude: 80.1994 };
    const dist = heritageService.calculateDistance(
      fromCoords.latitude,
      fromCoords.longitude,
      mon.location.lat,
      mon.location.lng
    );
    const time = heritageService.estimateTravelTime(dist, travellerPreferences?.mobilityPreference);
    return { dist, time };
  };

  const { dist, time } = activeMonument ? getDistanceAndDuration(activeMonument) : { dist: 0, time: 0 };

  if (hasError) {
    const activeInfo = activeMonument || allMonuments[0];
    return (
      <div className="relative rounded-3xl bg-[#2B2118] border border-[#D4A85A]/40 overflow-hidden min-h-[450px] flex flex-col justify-between p-6">
        <div className="flex items-center gap-2 p-3 bg-amber-900/20 border border-amber-500/30 rounded-xl text-xs text-[#D4A85A]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Interactive Map Engine Offline. Using spatial landmark listing.</span>
        </div>

        <div className="relative my-6 w-full h-[320px] bg-[#17130F] rounded-2xl border border-[#D4A85A]/20 overflow-hidden flex flex-col sm:flex-row">
          <div className="w-full sm:w-1/3 border-r border-[#D4A85A]/20 overflow-y-auto p-3 space-y-1.5 max-h-[320px] bg-[#2B2118]/40">
            {allMonuments.map((mon) => (
              <button
                key={mon.id}
                onClick={() => {
                  if (onSelectMonument) onSelectMonument(mon.id);
                  setActiveMonument(mon);
                }}
                className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-2 ${
                  selectedMonumentId === mon.id
                    ? 'bg-[#D4A85A] text-[#17130F] border-[#D4A85A]'
                    : 'bg-[#17130F] text-[#F3EBDD]/80 border-[#D4A85A]/10 hover:border-[#D4A85A]/40'
                }`}
              >
                <span className="truncate">{mon.name}</span>
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 flex flex-col justify-center items-center text-center relative select-none">
            <Compass className="w-12 h-12 text-[#D4A85A]/45 mb-3" />
            <h4 className="font-display text-sm font-bold text-[#F3EBDD]">{activeInfo.name}</h4>
            <p className="text-[10px] text-[#D4A85A] mt-0.5">{activeInfo.location.city}, {activeInfo.location.state}</p>
            <p className="text-xs text-[#F3EBDD]/60 mt-4">
              Coordinates: {activeInfo.location.lat.toFixed(4)}° N, {activeInfo.location.lng.toFixed(4)}° E
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-[#D4A85A]/40 shadow-2xl">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full bg-[#17130F] z-0" />

      {/* Top Right Map Layer Controls */}
      <div className="absolute top-3 right-3 bg-[#2B2118]/90 border border-[#D4A85A]/40 rounded-xl p-1 shadow-xl backdrop-blur-md flex items-center gap-1 z-10">
        <button
          onClick={() => setMapType('roadmap')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mapType === 'roadmap'
              ? 'bg-[#D4A85A] text-[#17130F] shadow-md'
              : 'text-[#F3EBDD]/80 hover:bg-[#17130F] hover:text-[#D4A85A]'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Roadmap</span>
        </button>

        <button
          onClick={() => setMapType('satellite')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mapType === 'satellite'
              ? 'bg-[#D4A85A] text-[#17130F] shadow-md'
              : 'text-[#F3EBDD]/80 hover:bg-[#17130F] hover:text-[#D4A85A]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => setMapType('terrain')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
            mapType === 'terrain'
              ? 'bg-[#D4A85A] text-[#17130F] shadow-md'
              : 'text-[#F3EBDD]/80 hover:bg-[#17130F] hover:text-[#D4A85A]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Terrain</span>
        </button>
      </div>

      {/* Floating Monument Context Card */}
      {activeMonument && !routeGeometry && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-6 bg-[#2B2118]/95 border border-[#D4A85A]/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-1.5 justify-center sm:justify-start text-[10px] text-[#D4A85A] uppercase tracking-wider font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>{activeMonument.location.city}, {activeMonument.location.state}</span>
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#F3EBDD]">
              {activeMonument.name}
            </h3>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 text-xs text-[#F3EBDD]/80">
              <span>Distance: ~{dist.toFixed(1)} km</span>
              <span>Est. Walk: ~{time} mins</span>
            </div>
          </div>

          {onNavigateHere && (
            <button
              onClick={() => onNavigateHere(activeMonument.id)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#D4A85A] text-[#17130F] text-xs font-bold uppercase tracking-wider hover:bg-[#F3EBDD] transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shrink-0"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Navigate Here</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
