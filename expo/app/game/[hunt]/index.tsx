import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useLocationTracking } from "@/hooks/useLocationTracking";
import { useOnWebSocket } from "@/hooks/useOnWebSocket";
import { usePersistentState } from "@/hooks/usePersistentState";
import { useSocketSend } from "@/hooks/useSocketSend";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useModal } from "@/modules/ModalContext";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenMessage from "@/modules/ui/FullscreenMessage";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import CaptureClueARScene from "@/modules/ui/hunt/CaptureClueARScene";
import ClueMapMarker from "@/modules/ui/hunt/ClueMapMarker";
import CurrentClue from "@/modules/ui/hunt/CurrentClue";
import HuntHeader from "@/modules/ui/hunt/Header";
import HuntMap from "@/modules/ui/hunt/Map";
import InaccurateCircle from "@/modules/ui/map/InaccurateCircle";
import { useStoreDispatch } from "@/redux/hooks";
import { SocketActions } from "@/redux/socket/reducer";
import { HuntClue, useHunt } from "@/types/gen";
import { LocationPoint } from "@/types/general";
import { CapturedHuntClue, HuntSocketCommand, HuntSocketResult } from "@/types/hunt";
import { useLocalSearchParams } from "expo-router";
import * as TaskManager from "expo-task-manager";
import { useEffect, useMemo, useRef, useState } from "react";
import { View } from "react-native";
import MapView from "react-native-maps";
import Toast from "react-native-toast-message";
import { TinyEmitter } from "tiny-emitter";

const LOCATION_TRACKING_TASK = "hunt/location-track";
const CAPTURED_CLUES_STORAGE_ID = "hunt/captured-clues/";

const eventEmmiter = new TinyEmitter();

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

  const [userLocation, setUserLocation] = useState<LocationPoint | null>(null);

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

  const huntQuery = useHunt(typeof huntId === "string" ? huntId : "", {
    query: {
      // If no eventId is provided don't bother making a request.
      enabled: typeof huntId === "string",
    },
  });

  const hunt = useMemo(() => huntQuery.data, [huntQuery.data]);

  /*
   *
   * Clue State
   *
   */

  const [clue, setClue] = useState<HuntClue>();

  const [clueState, setClueState] = useState<{
    near: boolean;
    location: LocationPoint | undefined;
  }>({ near: false, location: undefined });

  const [capturedClues, setCapturedClues] = usePersistentState<CapturedHuntClue[]>(
    [],
    hunt ? CAPTURED_CLUES_STORAGE_ID + hunt.id : ""
  );

  const [isCapturing, setIsCapturing] = useState(false);

  // Notify user that they've reached the clue.
  useEffect(() => {
    if (!clueState.near) return;

    // If user is in the app display a toast to notify them
    Toast.show({
      type: "info",
      text1: "You're getting close!",
      text2: "The clue is very close to you! Tap to capture it!",
      onPress: () => captureClue(),
    });
  }, [clueState.near]);

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

  const currentClueRequest = useSocketSend<HuntSocketCommand>(
    "hunt.cl.current",
    socketSend
  );

  const captureClueRequest = useSocketSend<HuntSocketCommand>(
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
  useOnWebSocket<HuntSocketResult>(socket, (res) => {
    if (res.command === "hunt.cl.current") {
      setClue(res.payload);
    } else if (res.command === "hunt.loc.check") {
      // Update state
      setClueState({
        near: res.payload.near,
        location: res.payload.near ? res.payload.clue_location : undefined,
      });
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

  function captureClue() {
    captureClueRequest.send({ loc: clueState.location });
  }

  // Handle location updates
  useEffect(() => {
    function updateLocationState(location: LocationPoint) {
      setUserLocation(location);
    }

    // Every 2 seconds send location to socket
    const sendSocketLocationTimerId = setInterval(() => {
      if (!userLocation) return;

      socketSend("hunt.loc.check", {
        loc: userLocation,
      });
    }, 2000);

    // Register event listener for location updates
    // Gets triggered from the location tracking task
    eventEmmiter.on("location:update", updateLocationState);

    return () => {
      // Clear timer and event listener on unmount
      clearInterval(sendSocketLocationTimerId);
      eventEmmiter.off("location:update", updateLocationState);
    };
  }, [socket, locationPermission.foreground]);

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

  if (locationPermission.determined && !locationPermission.foreground) {
    return (
      <FullscreenError>
        In order to join the hunt, you need to have location services enabled.
      </FullscreenError>
    );
  }

  // Display loading spinner if we're either fetching
  // hunt, or user's location hasn't been determined yet.
  if (
    typeof hunt === "undefined" ||
    huntQuery.isLoading ||
    !userLocation ||
    !locationPermission.determined
  ) {
    return <FullscreenSpinner />;
  }

  // Show error message if we hit an error
  if (!huntId || hunt === null) {
    return <FullscreenError>Couldn't find hunt.</FullscreenError>;
  }

  if (isCapturing && (typeof clueState.location === "undefined" || !userLocation)) {
    return <FullscreenMessage>Something went, like, really wrong!</FullscreenMessage>;
  }

  return (
    <View className="flex-1">
      {isCapturing ? (
        <CaptureClueARScene
          clueLocation={clueState.location!}
          onClueCaptured={() => {
            console.log("Captured!!");
            setIsCapturing(false);
            // captureClue();
          }}
        />
      ) : (
        <View className="w-full h-full flex-col">
          {/* Map */}
          <HuntMap mapRef={mapRef} userLocation={userLocation}>
            {/* Draw a marker for each clue we've captured */}
            {capturedClues.map((clue) => (
              <ClueMapMarker key={clue.id} clue={clue} />
            ))}

            {/* If we've reached clue, and clue's location is set, draw a circle around its approximate location. */}
            {clue && clueState.near && clueState.location && (
              <InaccurateCircle
                radius={clue.location_threshold!}
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
            onRetryFetchCluePressed={askForCurrentClue}
            isNear={clueState.near}
            onCapturePressed={() => setIsCapturing(true)}
            isCaptureClueLoading={captureClueRequest.loading}
          />
        </View>
      )}

      {/* Header */}
      <HuntHeader
        title={hunt.event.name}
        isCapturing={isCapturing}
        onCaptureBackPressed={() => setIsCapturing(false)}
      />
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
  eventEmmiter.emit("location:update", { lat, long });
});
