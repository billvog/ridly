import { useAppState } from "@/hooks/useAppState";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useOnWebSocket } from "@/hooks/useOnWebSocket";
import { getWebSocket, useWebSocket } from "@/hooks/useWebSocket";
import { useModal } from "@/modules/ModalContext";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import CurrentClue from "@/modules/ui/hunt/CurrentClue";
import InaccurateCircle from "@/modules/ui/map/InaccurateCircle";
import { LocationActions, LocationStore, useLocationSelector } from "@/redux/location";
import { LocationPoint } from "@/types/general";
import { TCapturedHuntClue, THunt, THuntClue } from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { usePersistentState } from "@/hooks/usePersistentState";

const LOCATION_TRACKING_TASK = "hunt/location-track";
const CAPTURE_CLUE_NOTIFICATION_ID = "hunt/capture-clue-notification";
const CAPTURED_CLUES_STORAGE_ID = "hunt/captured-clues/";

// Provide coordinate deltas, required from MapView to set region
function getMapDeltas() {
  return { latitudeDelta: 0.0092, longitudeDelta: 0.0092 };
}

function Page() {
  // Routing hooks
  const router = useRouter();
  const { hunt: huntId } = useLocalSearchParams();

  const appState = useAppState();

  // Holds user's live location. Gets updated from background tracking task.
  const userLocation = useLocationSelector((state) => state.location);

  // Location tracking
  const locationPermission = useLocationPermission();
  useLocationTracking(
    LOCATION_TRACKING_TASK,
    locationPermission.determined && locationPermission.foreground
  );

  const modal = useModal();

  // API Queries
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

  const [capturedClues, setCapturedClues] = usePersistentState<TCapturedHuntClue[]>(
    [],
    hunt ? CAPTURED_CLUES_STORAGE_ID + hunt.id : ""
  );

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
    askForCurrentClue();
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
    } else if (e.type === "cl.unlock") {
      // TOOD: Figure out how to handle that.
      if (!e.unlocked) {
        return;
      }

      // Display modal, informing the user for the state of the game
      if (e.won) {
        modal.open({
          title: "You Won!",
          body: "Congratulations! You completed that Ridl!",
          buttons: [
            {
              text: "Continue",
              onPress() {
                // TODO: Navigate to another screen to display stats.
              },
            },
          ],
        });
      } else {
        modal.open({
          title: "Congrats!",
          body: "You just captured your first clue!",
          buttons: [
            {
              text: "Continue",
              closeOnPress: true,
            },
          ],
          // On close, call onClueCaptured to update state
          onClose() {
            onClueCaptured();
          },
        });
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

  // Send message to socket to send us back the current clue
  function askForCurrentClue() {
    if (!socket) return;
    socket.send(JSON.stringify({ type: "cl.current" }));
  }

  // Called when we capture a clue
  function onClueCaptured() {
    // Add clue to captured clues
    if (clue && clueLocation) {
      setCapturedClues((c) => [...c, { ...clue, location_point: clueLocation }]);
    }

    setHasReachedClue(false);
    setClueLocation(undefined);
    askForCurrentClue();
  }

  // TODO: Implement. For now just unlock the clue.
  function captureClue() {
    if (!socket) return;
    socket.send(JSON.stringify({ type: "cl.unlock", loc: clueLocation }));
  }

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
        {/* Draw marker on user's location */}
        <Marker coordinate={userLocation} zIndex={20}>
          <View className="w-4 h-4 rounded-full bg-orange-400" />
        </Marker>

        {/* Draw a marker for each clue we've captured */}
        {capturedClues.map((clue) => (
          <Marker
            zIndex={10}
            key={clue.id}
            coordinate={{
              latitude: clue.location_point.lat,
              longitude: clue.location_point.long,
            }}
            onPress={() => console.log("Marker pressed")}
          >
            <Entypo name="location-pin" size={40} color="black" />
          </Marker>
        ))}

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

// Wrap our _Page component with redux LocationStore.
export default function () {
  return (
    <Provider store={LocationStore}>
      <Page />
    </Provider>
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

  // Extract location coordinates from data
  const { locations } = data;
  let lat = locations[0].coords.latitude;
  let long = locations[0].coords.longitude;

  // Update our Redux store
  LocationStore.dispatch(LocationActions.setLocation({ latitude: lat, longitude: long }));

  // Get WebSocket instance, if null, return.
  let socket = getWebSocket();
  if (!socket) {
    return;
  }

  // Send our location to backend through socket
  socket.send(JSON.stringify({ type: "loc.check", loc: { lat, long } }));
});
