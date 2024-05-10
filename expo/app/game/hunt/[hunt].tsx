import { useOnWebSocket } from "@/hooks/useOnWebSocket";
import { useWebSocket } from "@/hooks/useWebSocket";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { THunt, THuntClue } from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function Page() {
  const { hunt: huntId } = useLocalSearchParams();

  const huntQuery = useQuery<APIResponse<THunt>>({
    queryKey: ["hunt", huntId],
    queryFn: () => api("/hunt/" + huntId),
    // If no eventId is provided don't bother making a request.
    enabled: typeof huntId === "string",
  });

  const [hunt, setHunt] = useState<THunt | null>();
  const [clue, setClue] = useState<THuntClue>();

  // Get event from eventQuery
  useEffect(() => {
    if (!huntQuery.data) {
      setHunt(null);
    } else if (huntQuery.data.ok) {
      setHunt(huntQuery.data.data);
    }
  }, [huntQuery.data]);

  // Connect to WebSocket
  const socket = useWebSocket(hunt?.id);

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
    }
  });

  // Display loading spinner if we're fetching
  if (huntQuery.isLoading || huntQuery.isFetching) {
    return <FullscreenSpinner />;
  }

  // Show error message if we hit an error
  if (!huntId || !hunt) {
    return <FullscreenError>Couldn't find hunt.</FullscreenError>;
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
        <View className="absolute bottom-12 w-full flex items-center">
          <CurrentClue clue={clue} />
        </View>
      )}
    </View>
  );
}

function CurrentClue({ clue }: { clue: THuntClue }) {
  return (
    <BlurView
      tint="dark"
      intensity={40}
      className="overflow-hidden rounded-2xl px-10 py-5"
    >
      <Text className="text-white text-base font-extrabold">{clue.riddle}</Text>
    </BlurView>
  );
}
