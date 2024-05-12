import { useAppState } from "@/hooks/useAppState";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useOnWebSocket } from "@/hooks/useOnWebSocket";
import { getWebSocket, useWebSocket } from "@/hooks/useWebSocket";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { LocationPoint } from "@/types/general";
import { THunt, THuntClue } from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Toast from "react-native-toast-message";
import InaccurateCircle from "@/modules/ui/map/InaccurateCircle";

const LOCATION_TRACKING_TASK = "hunt/location-track";
const CAPTURE_CLUE_NOTIFICATION_ID = "hunt/capture-clue-notification";

// Provide coordinate deltas, required from MapView to set region
function getMapDeltas() {
  return { latitudeDelta: 0.0092, longitudeDelta: 0.0092 };
}

export default function Page() {
  const router = useRouter();
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
  const [clueLocation, setClueLocation] = useState<LocationPoint>();
  const [hasReachedClue, setHasReachedClue] = useState(false);

  // Holds a reference to the MapView
  const mapRef = useRef<MapView>(null);

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
      setClueLocation(e.near ? e.clue_location : undefined);

      // Get clue's location out of the response
      // Use secure store, to save the clue's location coordinates
      if (e.near) {
        console.log("Received loc.check -> clue's location:", e.clue_location);
      }
    }
  });

  // Notify user that they've reached the clue.
  useEffect(() => {
    if (!hasReachedClue) return;

    const notificationTitle = "You're getting close!";
    const notificationBody = "The clue is very close to you! Tap to capture it!";

    if (appState === "active") {
      // If user is in the app display a toast to notify them
      Toast.show({
        type: "info",
        bottomOffset: 140,
        text1: notificationTitle,
        text2: notificationBody,
        onPress: () => captureClue(),
      });
    } else {
      // Else, send notification
      Notifications.scheduleNotificationAsync({
        content: {
          title: notificationTitle,
          body: notificationBody,
        },
        identifier: CAPTURE_CLUE_NOTIFICATION_ID,
        trigger: null,
      });
    }
  }, [hasReachedClue]);

  // Animate map to an approximation of clue's location if we've reached.
  useEffect(() => {
    if (!clueLocation || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: clueLocation.lat,
        longitude: clueLocation.long,
        ...getMapDeltas(),
      },
      2
    );
  }, [clueLocation]);

  // Register notification handler on mount
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (event) => {
        if (event.notification.request.identifier === CAPTURE_CLUE_NOTIFICATION_ID) {
          captureClue();
        }
      }
    );

    // And remove it on unmount, to prevent leaks
    return () => {
      subscription.remove();
    };
  }, []);

  // TODO: Implement
  function captureClue() {}

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
      {/* Map */}
      <MapView
        ref={mapRef}
        className="absolute w-full h-full"
        mapType="hybrid"
        provider={PROVIDER_GOOGLE}
        initialRegion={
          hunt.event.location_coordinates
            ? {
                latitude: hunt.event.location_coordinates.lat,
                longitude: hunt.event.location_coordinates.long,
                ...getMapDeltas(),
              }
            : undefined
        }
      >
        {/* If we've reached clue, and clue's location is set, draw a circle around its approximate location. */}
        {hasReachedClue && clueLocation && (
          <InaccurateCircle
            center={{ latitude: clueLocation.lat, longitude: clueLocation.long }}
          />
        )}
      </MapView>

      {/* Header */}
      <SafeAreaView>
        <BlurView
          tint="dark"
          className="mx-4 my-2 px-6 py-4 rounded-xl overflow-hidden flex flex-row items-center"
        >
          {/* If we can go back, display back button */}
          {router.canGoBack() && (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Entypo name="chevron-left" size={20} color="white" />
            </TouchableOpacity>
          )}
          <Text className="font-extrabold text-xl text-white">{hunt.event.name}</Text>
        </BlurView>
      </SafeAreaView>

      {/* Display current clue, if any */}
      {clue && (
        <View className="absolute bottom-0 w-full">
          <CurrentClue
            clue={clue}
            hasReached={hasReachedClue}
            onCapturePressed={captureClue}
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

  // TODO:
  // Use redux to store current location, so we can then retrieve it from within
  // our reactive component and show user's location as they move, because
  // showUserLocation prop on MapView messes this location tracking.

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
