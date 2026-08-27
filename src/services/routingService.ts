import { mapService } from './mapService';
import { heritageService } from './heritageService';

export interface RouteDetails {
  distanceMeters: number;
  durationSeconds: number;
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [lng, lat]
  };
  coordinates: [number, number][]; // [lng, lat]
}

export const routingService = {
  /**
   * Fetches route details and geometry coordinates using Google Maps or fallback geometry calculation.
   */
  async getWalkingRoute(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    profile: 'foot-walking' | 'two-wheeler' | 'driving-car' | 'cycling-regular' | 'wheelchair' = 'foot-walking'
  ): Promise<RouteDetails> {
    try {
      await mapService.loadGoogleMaps();

      if (window.google && window.google.maps && window.google.maps.DirectionsService) {
        let travelMode = window.google.maps.TravelMode.WALKING;
        if (profile === 'driving-car' || profile === 'two-wheeler') {
          travelMode = window.google.maps.TravelMode.DRIVING;
        } else if (profile === 'cycling-regular') {
          travelMode = window.google.maps.TravelMode.BICYCLING;
        }

        const directionsService = new window.google.maps.DirectionsService();

        const routeResult = await new Promise<RouteDetails>((resolve, reject) => {
          directionsService.route(
            {
              origin: new window.google.maps.LatLng(origin.lat, origin.lng),
              destination: new window.google.maps.LatLng(destination.lat, destination.lng),
              travelMode: travelMode
            },
            (response, status) => {
              if (status === window.google.maps.DirectionsStatus.OK && response) {
                const route = response.routes[0];
                const leg = route.legs[0];
                const coords = route.overview_path.map(
                  (point) => [point.lng(), point.lat()] as [number, number]
                );

                resolve({
                  distanceMeters: leg.distance?.value ?? 0,
                  durationSeconds: leg.duration?.value ?? 0,
                  geometry: {
                    type: 'LineString',
                    coordinates: coords
                  },
                  coordinates: coords
                });
              } else {
                reject(new Error(`Status: ${status}`));
              }
            }
          );
        });

        return routeResult;
      }
    } catch (err) {
      console.warn('Google Maps directions service unavailable, using geographic fallback route calculation:', err);
    }

    // Fallback mathematical route interpolation
    const distKm = heritageService.calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng);
    const distanceMeters = Math.round(distKm * 1000);
    const speedKmH = profile === 'driving-car' ? 40 : profile === 'cycling-regular' ? 15 : 4.5;
    const durationSeconds = Math.round((distKm / speedKmH) * 3600);

    const coords: [number, number][] = [];
    const steps = 6;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const lat = origin.lat + t * (destination.lat - origin.lat);
      const lng = origin.lng + t * (destination.lng - origin.lng);
      coords.push([lng, lat]);
    }

    return {
      distanceMeters,
      durationSeconds,
      geometry: {
        type: 'LineString',
        coordinates: coords
      },
      coordinates: coords
    };
  }
};
