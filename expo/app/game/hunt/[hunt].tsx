import Button from "@/modules/ui/Button";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { THunt } from "@/types/hunt";
import { APIResponse, api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, Text } from "react-native";

export default function Page() {
  const { hunt: huntId } = useLocalSearchParams();

  const router = useRouter();

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

  if (huntQuery.isLoading) {
    return <FullscreenSpinner />;
  }

  if (!huntId || !hunt) {
    return <FullscreenError>Couldn't find hunt.</FullscreenError>;
  }

  return (
    <SafeAreaView>
      <Text>This is the game view! For hunt: {hunt.event.name}</Text>
      <Button onPress={() => router.back()}>Go back</Button>
    </SafeAreaView>
  );
}
