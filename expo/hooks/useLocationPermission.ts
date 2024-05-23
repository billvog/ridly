import * as Location from "expo-location";
import { useEffect, useState } from "react";

type AllowedLocation = {
  determined: boolean;
  foreground: boolean;
};

export function useLocationPermission() {
  const [isLocationAllowed, setIsLocationAllowed] = useState<AllowedLocation>({
    determined: false,
    foreground: false,
  });

  // Ask for location permissions on mount
  useEffect(() => {
    (async () => {
      let foregroundPermission = await Location.requestForegroundPermissionsAsync();
      setIsLocationAllowed({
        determined: true,
        foreground: foregroundPermission.status === "granted",
      });
    })();
  }, []);

  return isLocationAllowed;
}
