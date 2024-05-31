import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import { useSetNavigationOptions } from "@/hooks/useSetNavigationOptions";
import Button from "@/modules/ui/Button";
import FullscreenError from "@/modules/ui/FullscreenError";
import { TEvent } from "@/types/event";
import { APIResponse, api } from "@/utils/api";
import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

type JoinEventResponse = {
  has_joined: boolean;
  participant_count: number;
};

export default function EventDetails() {
  useSetNavigationOptions({
    header: EventDetailsHeader,
  });

  const { event: eventId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const queryClient = useQueryClient();

  const eventQuery = useQuery<APIResponse<TEvent>>({
    queryKey: ["event", eventId],
    queryFn: () => api("/event/" + eventId + "/"),
    // If no eventId is provided don't bother making a request.
    enabled: typeof eventId === "string",
  });

  const [refreshEvent, isEventRefreshing] = useIsRefreshing(eventQuery.refetch);

  const [event, setEvent] = useState<TEvent | null>();

  const joinEventMutation = useMutation<APIResponse<JoinEventResponse>>({
    mutationKey: ["event", eventId, "join"],
    mutationFn: () => api("/event/" + eventId + "/join/", "POST"),
  });

  // Get event from eventQuery
  useEffect(() => {
    if (!eventQuery.data) {
      setEvent(null);
    } else if (eventQuery.data.ok) {
      setEvent(eventQuery.data.data);
    }
  }, [eventQuery.data]);

  // Set event's name as our header title.
  useEffect(() => {
    navigation.setOptions({
      title: event ? event.name : String(),
    });
  }, [navigation, event]);

  // Handle join/unjoin event
  async function JoinEvent() {
    if (!event) return;

    const wantsToLeave = event?.has_joined;
    const errorMessage = wantsToLeave ? "Couldn't unjoin event." : "Couldn't join event";

    if (wantsToLeave) {
      const shouldContinue = await new Promise<boolean>((resolve) => {
        Alert.alert("Confirm", "Do you ridly.. want to leave?", [
          {
            text: "Yeah",
            style: "destructive",
            onPress: () => resolve(true),
          },
          { text: "God no!", onPress: () => resolve(false) },
        ]);
      });

      if (!shouldContinue) {
        return;
      }
    }

    joinEventMutation.mutate(undefined, {
      onSuccess(data) {
        if (data.ok) {
          // Extract new has_joined from response.
          const { has_joined, participant_count } = data.data;

          // Update cache.
          queryClient.setQueryData<APIResponse<TEvent>>(
            ["event", eventId],
            (event) =>
              event && {
                ...event,
                data: { ...event.data, participant_count, has_joined },
              }
          );

          // Display toast to inform user it went ok.
          if (has_joined) {
            Toast.show({
              type: "success",
              text1: "Joined event!",
              text1Style: {
                fontSize: 16,
              },
              text2: event
                ? `${event.name} in ${dayjs(event.happening_at).fromNow(true)}`
                : undefined,
              text2Style: {
                fontSize: 12,
              },
            });
          } else {
            Toast.show({
              type: "success",
              text1: "Unjoined event :^(",
            });
          }
        } else {
          // Show error toast.
          Toast.show({
            type: "error",
            text1: errorMessage,
          });
        }
      },
      onError(error) {
        // Print error and show error toast.
        console.error(error);
        Toast.show({
          type: "error",
          text1: errorMessage,
        });
      },
    });
  }

  // Handle join event game
  function JoinHunt() {
    if (!event || !event.hunt_id) return;

    router.push({
      pathname: "/game/[hunt]",
      params: {
        hunt: event.hunt_id,
      },
    });
  }

  if (!eventId || !event) {
    return <FullscreenError>Couldn't find event.</FullscreenError>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isEventRefreshing} onRefresh={refreshEvent} />
      }
    >
      <Image
        // Stock image for testing.
        source="https://fastly.picsum.photos/id/281/200/200.jpg?hmac=5FvZ-Y5zbbpS3-mJ_mp6-eH61MkwhUJi9qnhscegqkY"
        contentFit="cover"
        contentPosition="center"
        style={{
          width: "100%",
          height: 250,
        }}
      />
      <View className="p-4 space-y-6">
        <View>
          <Text className="font-extrabold text-3xl">{event.name}</Text>
          <View className="flex flex-row items-center">
            <Text className="text-lg">{"by "}</Text>
            <TouchableOpacity>
              <Text className="font-bold text-lg text-orange-500">
                @{event.creator.user.username}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 
          Temporary "Join hunt" button.
          That should be visible only if the event is live.
        */}
        {event.hunt_id && (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={JoinHunt}
            className="p-4 bg-orange-200 flex flex-row items-center"
          >
            <AntDesign name="exclamationcircleo" size={24} color="#eba40c" />
            <View className="ml-4 flex">
              <Text>This event is happening now!</Text>
              <Text className="font-bold text-xs">Tap to join the hunt.</Text>
            </View>
          </TouchableOpacity>
        )}

        <View className="space-y-3">
          <View className="flex flex-row space-x-1">
            <Feather name="map-pin" size={16} color="#fb923c" />
            <Text>
              Where? <Text className="font-bold">{event.location_name}</Text>
            </Text>
          </View>
          <View className="flex flex-row space-x-1">
            <Feather name="clock" size={16} color="#fb923c" />
            <Text>
              When?{" "}
              <Text className="font-bold">{dayjs(event.happening_at).format("LLL")}</Text>
            </Text>
          </View>
          {event.participant_count > 0 ? (
            <View className="flex flex-row items-center space-x-1">
              <Feather name="user" size={16} color="#fb923c" />
              <Text>Who?</Text>
              <EventParticipantsAvatars participants={event.participants} />
              <Text>
                <Text className="font-bold">{event.participant_count}</Text> joined
              </Text>
            </View>
          ) : (
            <View>
              <Text className="font-medium">No attendees yet. Be the first!</Text>
            </View>
          )}
        </View>
        <View>
          <Button
            onPress={JoinEvent}
            loading={joinEventMutation.isPending}
            buttonStyle={event.has_joined ? "bg-red-600" : "bg-black"}
          >
            {event.has_joined ? "Unjoin" : "Join"}
          </Button>
        </View>
        <Text>{event.description}</Text>
      </View>
    </ScrollView>
  );
}

function EventDetailsHeader({ navigation }: NativeStackHeaderProps) {
  function backPressed() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }

  return (
    <View className="absolute top-0">
      <SafeAreaView>
        <TouchableOpacity
          onPress={backPressed}
          activeOpacity={0.5}
          className="ml-6 mr-auto rounded-full overflow-hidden"
        >
          <BlurView tint="dark" className="p-2">
            <Entypo name="chevron-left" size={24} color="#f2f2f2" />
          </BlurView>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

function EventParticipantsAvatars({
  participants,
}: {
  participants: TEvent["participants"];
}) {
  return (
    <View className="flex flex-row items-center ml-1">
      {participants.map((p, index) => (
        <Image
          key={index}
          source={p.avatar_url || "https://placehold.co/20/000/FFF"}
          className="rounded-full border border-white"
          style={{
            width: 20,
            height: 20,
            marginLeft: index > 0 ? -8 : 0,
          }}
        />
      ))}
    </View>
  );
}
