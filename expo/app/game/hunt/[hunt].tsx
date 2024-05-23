import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useOnWebSocket } from "@/hooks/useOnWebSocket";
import { usePersistentState } from "@/hooks/usePersistentState";
import { useSocketSend } from "@/hooks/useSocketSend";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useModal } from "@/modules/ModalContext";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import ClueMapMarker from "@/modules/ui/hunt/ClueMapMarker";
import CurrentClue from "@/modules/ui/hunt/CurrentClue";
import HuntHeader from "@/modules/ui/hunt/Header";
import HuntMap from "@/modules/ui/hunt/Map";
import InaccurateCircle from "@/modules/ui/map/InaccurateCircle";
import { useStoreDispatch } from "@/redux/hooks";
import { SocketActions } from "@/redux/socket/reducer";
import { LocationPoint } from "@/types/general";
import {
  TCapturedHuntClue,
  THunt,
  THuntClue,
  THuntSocketCommand,
  THuntSocketResult,
} from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import MapView, { LatLng } from "react-native-maps";
import Toast from "react-native-toast-message";
import { TinyEmitter } from "tiny-emitter";

const LOCATION_TRACKING_TASK = "hunt/location-track";
const CAPTURED_CLUES_STORAGE_ID = "hunt/captured-clues/";

const eventEmmiter = new TinyEmitter();

// Provide coordinate deltas, required from MapView to set region
function getMapDeltas() {
  return { latitudeDelta: 0.0092, longitudeDelta: 0.0092 };
}

export default function Page() {
  /*
   *
   * Routing
   *
   */

  const { hunt: huntId } = useLocalSearchParams();

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

  const [userLocation, setUserLocation] = useState<LatLng | null>(null);

  /*
   *
   * Redux
   *
   */

  const dispatch = useStoreDispatch();

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

    // If user is in the app display a toast to notify them
    Toast.show({
      type: "info",
      bottomOffset: 140,
      text1: "You're getting close!",
      text2: "The clue is very close to you! Tap to capture it!",
      onPress: () => captureClue(),
    });
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
      // Return if clue is already in captured clues
      // that way we don't add duplicates
      if (typeof capturedClues.find((c) => c.id === clue.id) !== "undefined") {
        return;
      }

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
  const { socket, send: socketSend } = useWebSocket(hunt ? `/hunt/${hunt.id}` : null);

  const currentClueRequest = useSocketSend<THuntSocketCommand>(
    "hunt.cl.current",
    socketSend
  );

  const captureClueRequest = useSocketSend<THuntSocketCommand>(
    "hunt.cl.current",
    socketSend
  );

  // Ask for current clue on mount
  useEffect(() => {
    if (!socket) return;

    function onOpen() {
      askForCurrentClue();
    }

    socket.addEventListener("open", onOpen);

    return () => {
      socket.removeEventListener("open", onOpen);
    };
  }, [socket, clue]);

  // Handle socket messages
  useOnWebSocket<THuntSocketResult>(socket, (res) => {
    if (res.command === "hunt.cl.current") {
      setClue(res.payload);
    } else if (res.command === "hunt.loc.check") {
      // Update state
      setClueState({
        near: res.payload.near,
        location: res.payload.near ? res.payload.clue_location : undefined,
      });

      // Get clue's location out of the response
      // Use secure store, to save the clue's location coordinates
      if (res.payload.near) {
        console.log("Received loc.check -> clue's location:", res.payload.clue_location);
      }
    } else if (res.command === "hunt.cl.unlock") {
      // TOOD: Figure out how to handle that.
      if (!res.payload.unlocked) {
        return;
      }

      // Display modal, informing the user for the state of the game
      if (res.payload.won) {
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
    currentClueRequest.send({});
  }

  // TODO: Implement. For now just unlock the clue.
  function captureClue() {
    captureClueRequest.send({ loc: clueState.location });
  }

  useEffect(() => {
    function locationUpdate(location: LatLng) {
      console.log("Location update", location);

      // Update our store
      setUserLocation(location);

      // Send update to socket
      socketSend("hunt.loc.check", {
        loc: { lat: location.latitude, long: location.longitude },
      });
    }

    eventEmmiter.on("location:update", locationUpdate);

    return () => {
      eventEmmiter.off("location:update", locationUpdate);
    };
  }, [socket]);

  useEffect(() => {
    return () => {
      dispatch(SocketActions.clearMessages());
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
        <CurrentClue
          clue={clue}
          isClueLoading={currentClueRequest.loading}
          isNear={clueState.near}
          onCapturePressed={captureClue}
          isCaptureClueLoading={captureClueRequest.loading}
        />
      </View>

      {/* Header */}
      <HuntHeader title={hunt.event.name} />
    </View>
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

  // Emit message, that's handled from within the component.
  eventEmmiter.emit("location:update", { latitude: lat, longitude: long });
});
