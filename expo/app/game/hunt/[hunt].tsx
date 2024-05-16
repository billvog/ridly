import { useAppState } from "@/hooks/useAppState";
import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useOnWebSocket } from "@/hooks/useOnWebSocket";
import { usePersistentState } from "@/hooks/usePersistentState";
import { getWebSocket, useWebSocket } from "@/hooks/useWebSocket";
import { useModal } from "@/modules/ModalContext";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import ClueMapMarker from "@/modules/ui/hunt/ClueMapMarker";
import CurrentClue from "@/modules/ui/hunt/CurrentClue";
import HuntHeader from "@/modules/ui/hunt/Header";
import HuntMap from "@/modules/ui/hunt/Map";
import InaccurateCircle from "@/modules/ui/map/InaccurateCircle";
import { LocationActions, LocationStore, useLocationSelector } from "@/redux/location";
import { LocationPoint } from "@/types/general";
import { TCapturedHuntClue, THunt, THuntClue } from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

const LOCATION_TRACKING_TASK = "hunt/location-track";
const CAPTURE_CLUE_NOTIFICATION_ID = "hunt/capture-clue-notification";
const CAPTURED_CLUES_STORAGE_ID = "hunt/captured-clues/";

// Provide coordinate deltas, required from MapView to set region
function getMapDeltas() {
  return { latitudeDelta: 0.0092, longitudeDelta: 0.0092 };
}

function Page() {
  /*
   *
   * Routing
   *
   */

  const router = useRouter();
  const { hunt: huntId } = useLocalSearchParams();

  /*
   *
   * AppState
   *
   */

  const appState = useAppState();

  /*
   *
   * Modal
   *
   */

  const modal = useModal();

  /*
   *
   * MapView
   *
   */

  const mapRef = useRef<MapView>(null);

  /*
   *
   * Location Tracking
   *
   */

  const locationPermission = useLocationPermission();
  useLocationTracking(
    LOCATION_TRACKING_TASK,
    locationPermission.determined && locationPermission.foreground
  );

  // Holds user's live location. Gets updated from background tracking task.
  const userLocation = useLocationSelector((state) => state.location);

  /*
   *
   * Fetch Hunt
   *
   */

  const huntQuery = useQuery<APIResponse<THunt>>({
    queryKey: ["hunt", huntId],
    queryFn: () => api("/hunt/" + huntId + "/"),
    // If no eventId is provided don't bother making a request.
    enabled: typeof huntId === "string",
  });

  const [hunt, setHunt] = useState<THunt | null>();

  // Get hunt from huntQuery
  useEffect(() => {
    if (!huntQuery.data) {
      setHunt(null);
    } else if (huntQuery.data.ok) {
      setHunt(huntQuery.data.data);
    }
  }, [huntQuery.data]);

  /*
   *
   * Clue State
   *
   */

  const [clue, setClue] = useState<THuntClue>();

  const [clueState, setClueState] = useState<{
    near: boolean;
    location: LocationPoint | undefined;
  }>({ near: false, location: undefined });

  const [capturedClues, setCapturedClues] = usePersistentState<TCapturedHuntClue[]>(
    [],
    hunt ? CAPTURED_CLUES_STORAGE_ID + hunt.id : ""
  );

  // Notify user that they've reached the clue.
  useEffect(() => {
    if (!clueState.near) return;

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
  }, [clueState.near]);

  // Animate map to an approximation of clue's location if we've reached.
  useEffect(() => {
    if (!clueState.location || !mapRef.current) return;
    mapRef.current.animateToRegion(
      {
        latitude: clueState.location.lat,
        longitude: clueState.location.long,
        ...getMapDeltas(),
      },
      2
    );
  }, [clueState.location]);

  // Called when we capture a clue
  function onClueCaptured() {
    // Add clue to captured clues
    if (clue && clueState.location) {
      setCapturedClues((c) => [...c, { ...clue, location_point: clueState.location! }]);
    }

    // Update state, and ask for next clue from socket
    setClueState({ near: false, location: undefined });
    askForCurrentClue();
  }

  /*
   * WebSocket
   */

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
      setClueState({
        near: e.near,
        location: e.near ? e.clue_location : undefined,
      });

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

  // Send message to socket to send us back the current clue
  function askForCurrentClue() {
    if (!socket) return;
    socket.send(JSON.stringify({ type: "cl.current" }));
  }

  // TODO: Implement. For now just unlock the clue.
  function captureClue() {
    if (!socket) return;
    socket.send(JSON.stringify({ type: "cl.unlock", loc: clueState.location }));
  }

  /*
   *
   * Notifications
   *
   */

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

  /*
   *
   * Render
   *
   */

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
      <View className="w-full h-full flex-col">
        {/* Map */}
        <HuntMap mapRef={mapRef} userLocation={userLocation}>
          {/* Draw a marker for each clue we've captured */}
          {capturedClues.map((clue) => (
            <ClueMapMarker key={clue.id} clue={clue} />
          ))}

          {/* If we've reached clue, and clue's location is set, draw a circle around its approximate location. */}
          {clueState.near && clueState.location && (
            <InaccurateCircle
              center={{
                latitude: clueState.location.lat,
                longitude: clueState.location.long,
              }}
            />
          )}
        </HuntMap>

        {/* Clue Information */}
        <CurrentClue clue={clue} isNear={clueState.near} onCapturePressed={captureClue} />
      </View>

      {/* Header */}
      <HuntHeader title={hunt.event.name} />
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
