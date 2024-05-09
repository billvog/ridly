import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { THunt } from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { BlurView } from "expo-blur";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

export default function Page() {
  const { hunt: huntId } = useLocalSearchParams();
  const navigation = useNavigation();

  const huntQuery = useQuery<APIResponse<THunt>>({
    queryKey: ["hunt", huntId],
    queryFn: () => api("/hunt/" + huntId),
    // If no eventId is provided don't bother making a request.
    enabled: typeof huntId === "string",
  });

  const [hunt, setHunt] = useState<THunt | null>();

  // Get event from eventQuery
  useEffect(() => {
    if (!huntQuery.data) {
      setHunt(null);
    } else if (huntQuery.data.ok) {
      setHunt(huntQuery.data.data);
    }
  }, [huntQuery.data]);

  useEffect(() => {
    if (hunt?.event) {
      navigation.setOptions({ headerTitle: hunt.event.name });
    }
  }, [hunt]);

  if (huntQuery.isLoading || huntQuery.isFetching) {
    return <FullscreenSpinner />;
  }

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
      <View className="absolute bottom-12 w-full flex items-center">
        <CurrentClue />
      </View>
    </View>
  );
}

function CurrentClue() {
  return (
    <BlurView
      tint="dark"
      intensity={40}
      className="overflow-hidden rounded-2xl px-10 py-5"
    >
      <Text className="text-white text-base font-extrabold">
        What is this and that?
      </Text>
    </BlurView>
  );
}
