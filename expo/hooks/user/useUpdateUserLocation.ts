import { useLocationPermission } from "@/hooks/useLocationPermission";
import { User, useUserUpdateLastKnownLocation } from "@/types/gen";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export function useUpdateUserLocation(user: User | null) {
  const [didUpdateLocation, setDidUpdateLocation] = useState<boolean>();

  const locationPermissions = useLocationPermission();
  const updateLastKnownLocationMutation = useUserUpdateLastKnownLocation();

  useEffect(() => {
    if (!user || !locationPermissions.determined || !locationPermissions.foreground) {
      return;
    }

    // Get user's current location.
    // We use low accuracy, as we use their location to show them events nearby.

    // We also don't handle errors, we want to silently fail if we can't get their location.

    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }).then(
      (response) => {
        // Extract coorindates.
        const position = response.coords;

        // Execute mutation.
        updateLastKnownLocationMutation.mutateAsync(
          {
            last_known_location: { lat: position.latitude, long: position.longitude },
          },
          {
            onSuccess: () => setDidUpdateLocation(true),
            onError: () => setDidUpdateLocation(false),
          }
        );
      }
    );
  }, [user, locationPermissions]);

  return didUpdateLocation;
}
