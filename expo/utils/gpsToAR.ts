import { getPreciseDistance, getGreatCircleBearing } from "geolib";
import { GeolibInputCoordinates } from "geolib/es/types";

// Function to convert GPS coordinates to AR coordinates
export function gpsToAR(
  userLocation: GeolibInputCoordinates,
  targetLocation: GeolibInputCoordinates
) {
  function toRadians(degrees: number) {
    return degrees * (Math.PI / 180);
  }

  const distance = getPreciseDistance(userLocation, targetLocation); // in meters
  const bearing = getGreatCircleBearing(userLocation, targetLocation); // in degrees

  const bearingRad = toRadians(bearing);

  // Convert distance and bearing to AR coordinates
  const x = distance * Math.cos(bearingRad);
  const z = distance * Math.sin(bearingRad);

  return { x, z };
}
