import { useEffect } from "react";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

export function useLocationTracking(taskId: string, track: boolean) {
  useEffect(() => {
    if (!track) {
      return;
    }

    (async () => {
      console.log("Starting location tracking...");
      await Location.startLocationUpdatesAsync(taskId, {
        accuracy: Location.Accuracy.Highest,
        timeInterval: 5000,
        distanceInterval: 5,
      });
    })();

    return () => {
      TaskManager.isTaskRegisteredAsync(taskId).then((tracking) => {
        if (tracking) {
          console.log("Stopping location tracking...");
          Location.stopLocationUpdatesAsync(taskId);
        }
      });
    };
  }, [track]);
}
