import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useEffect } from "react";

export function useLocationTracking(taskId: string, track: boolean) {
  // Self explanatory
  function stopLocationTracking() {
    TaskManager.isTaskRegisteredAsync(taskId).then((tracking) => {
      if (tracking) {
        console.log("Stopping location tracking...");
        Location.stopLocationUpdatesAsync(taskId);
      }
    });
  }

  // Start/stop tracking when `track` is changed
  useEffect(() => {
    if (!track) {
      stopLocationTracking();
      return;
    }

    console.log("Starting location tracking...");
    Location.startLocationUpdatesAsync(taskId, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 5000,
      deferredUpdatesInterval: 5000,
      distanceInterval: 5,
      deferredUpdatesDistance: 5,
    });
  }, [track]);

  // Stop tracking on unmount, when we close the app
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, []);
}
