import { useAppState } from "@/hooks/useAppState";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useOnWebSocket } from "@/hooks/useOnWebSocket";
import { getWebSocket, useWebSocket } from "@/hooks/useWebSocket";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { THunt, THuntClue } from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

const LOCATION_TRACKING_TASK = "hunt/location-track";

export default function Page() {
  const { hunt: huntId } = useLocalSearchParams();

  const locationPermission = useLocationPermission();
  useLocationTracking(
    LOCATION_TRACKING_TASK,
    locationPermission.determined && locationPermission.foreground
  );

  const appState = useAppState();

  const huntQuery = useQuery<APIResponse<THunt>>({
    queryKey: ["hunt", huntId],
    queryFn: () => api("/hunt/" + huntId),
    // If no eventId is provided don't bother making a request.
    enabled: typeof huntId === "string",
  });

  const [hunt, setHunt] = useState<THunt | null>();
  const [clue, setClue] = useState<THuntClue>();
  const [hasReachedClue, setHasReachedClue] = useState(false);

  // Get event from eventQuery
  useEffect(() => {
    if (!huntQuery.data) {
      setHunt(null);
    } else if (huntQuery.data.ok) {
      setHunt(huntQuery.data.data);
    }
  }, [huntQuery.data]);

  // Connect to WebSocket
  const socket = useWebSocket(hunt ? `/hunt/${hunt.id}` : null);

  // Ask for current clue on mount
  useEffect(() => {
    if (socket) {
      socket.send(JSON.stringify({ type: "cl.current" }));
    }
  }, [socket]);

  // Handle socket messages
  useOnWebSocket(socket, (e) => {
    if (e.type === "cl.current") {
      setClue(e.clue);
    } else if (e.type === "loc.check") {
      // Update state
      setHasReachedClue(e.near);

      // Get clue's location out of the response
      // Use secure store, to save the clue's location coordinates
      if (e.near) {
        console.log("Received loc.check -> clue's location:", e.clue_location);
      }
    }
  });

  // Notify user that they've reached the clue.
  useEffect(() => {
    if (appState === "active") {
      // Notify user with some sort of message
    } else {
      // Send notification to user
    }
  }, [hasReachedClue]);

  // Display loading spinner if we're fetching
  if (huntQuery.isLoading || huntQuery.isFetching || !locationPermission.determined) {
    return <FullscreenSpinner />;
  }

  // Show error message if we hit an error
  if (!huntId || !hunt) {
    return <FullscreenError>Couldn't find hunt.</FullscreenError>;
  }

  if (locationPermission.determined && !locationPermission.foreground) {
    return (
      <FullscreenError>
        In order to join the hunt, you need to have location services enabled.
      </FullscreenError>
    );
  }

  return (
    <View className="flex-1">
      <MapView
        className="w-full h-full"
        mapType="hybrid"
        provider={PROVIDER_GOOGLE}
        initialRegion={
          hunt.event.location_coordinates
            ? {
                latitude: hunt.event.location_coordinates.lat,
                longitude: hunt.event.location_coordinates.long,
                latitudeDelta: 0.0092,
                longitudeDelta: 0.0092,
              }
            : undefined
        }
      />
      {clue && (
        <View className="absolute bottom-0 w-full">
          <CurrentClue
            clue={clue}
            hasReached={hasReachedClue}
            onCapturePressed={() => {}}
          />
        </View>
      )}
    </View>
  );
}

type CurrentClueProps = {
  clue: THuntClue;
  hasReached: boolean;
  onCapturePressed: () => any;
};

function CurrentClue({ clue, hasReached, onCapturePressed }: CurrentClueProps) {
  return (
    <BlurView tint="dark" intensity={40} className="w-full px-10 pt-4 pb-10">
      <Text className="text-center text-white text-base font-extrabold">
        {clue.riddle}
      </Text>
      {hasReached && (
        <TouchableOpacity
          activeOpacity={0.5}
          className="mx-auto mt-2 px-4 py-2 bg-black rounded-xl"
          onPress={onCapturePressed}
        >
          <Text className="text-white font-bold text-xs">Tap to Capture Clue</Text>
        </TouchableOpacity>
      )}
    </BlurView>
  );
}

// Gets called when location updates
TaskManager.defineTask(LOCATION_TRACKING_TASK, async ({ data, error }: any) => {
  if (error) {
    console.log("Error while fetching user's location:", error);
    return;
  }

  if (!data) {
    return;
  }

  const { locations } = data;
  let lat = locations[0].coords.latitude;
  let long = locations[0].coords.longitude;

  let socket = getWebSocket();
  if (!socket) {
    return;
  }

  socket.send(JSON.stringify({ type: "loc.check", loc: { lat, long } }));
  console.log(
    `Sent loc.check @ ${new Date(Date.now()).toLocaleString()}: ${lat},${long}`
  );
});
