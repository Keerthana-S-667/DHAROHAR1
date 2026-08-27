/**
 * DHAROHAR Map Service — Google Maps JS API Loader & Helper
 * Isolates all Google Maps loading and initialization logic.
 */

let loadPromise: Promise<any> | null = null;
let leafletLoadPromise: Promise<any> | null = null;

export const mapService = {
  /**
   * Dynamically loads the Leaflet OpenStreetMap library via CDN.
   * Provides a 100% free, reliable, keyless interactive map.
   */
  loadLeaflet(): Promise<any> {
    if (leafletLoadPromise) return leafletLoadPromise;

    leafletLoadPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is undefined'));
        return;
      }
      if ((window as any).L) {
        resolve((window as any).L);
        return;
      }

      // Inject Leaflet CSS
      if (!document.getElementById('leaflet-css-cdn')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-cdn';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Inject Leaflet JS
      const script = document.createElement('script');
      script.id = 'leaflet-js-cdn';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        resolve((window as any).L);
      };
      script.onerror = (err) => {
        console.error('Failed to load Leaflet script from CDN:', err);
        reject(err);
      };
      document.head.appendChild(script);
    });

    return leafletLoadPromise;
  },

  /**
   * Dynamically loads the Google Maps JavaScript API script.
   */
  loadGoogleMaps(): Promise<any> {
    if (loadPromise) return loadPromise;

    const apiKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() || '';

    loadPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is undefined'));
        return;
      }
      if ((window as any).google && (window as any).google.maps) {
        resolve((window as any).google);
        return;
      }

      const callbackName = 'initGoogleMapsCallback';
      (window as any)[callbackName] = () => {
        resolve((window as any).google);
        delete (window as any)[callbackName];
      };

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=geometry,marker&callback=${callbackName}`;
      script.async = true;
      script.defer = true;
      script.onerror = (err) => {
        console.error('Failed to load Google Maps script:', err);
        reject(err);
      };
      document.head.appendChild(script);
    });

    return loadPromise;
  }
};
