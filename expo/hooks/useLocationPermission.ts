import * as Location from "expo-location";
import { useEffect, useState } from "react";

type AllowedLocation = {
  determined: boolean;
  foreground: boolean;
  background: boolean;
};

export function useLocationPermission() {
  const [isLocationAllowed, setIsLocationAllowed] = useState<AllowedLocation>({
    determined: false,
    foreground: false,
    background: false,
  });

  // Ask for location permissions on mount
  useEffect(() => {
    (async () => {
      let foregroundPermission = await Location.requestForegroundPermissionsAsync();
      let backgroundPermission = await Location.requestBackgroundPermissionsAsync();

      setIsLocationAllowed({
        determined: true,
        foreground: foregroundPermission.status === "granted",
        background: backgroundPermission.status === "granted",
      });
    })();
  }, []);

  return isLocationAllowed;
}
