import Button from "@/modules/ui/Button";
import FullscreenError from "@/modules/ui/FullscreenError";
import { TEvent } from "@/types/event";
import { APIResponse, api } from "@/utils/api";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { boolean } from "zod";

type JoinEventResponse = {
  has_joined: boolean;
  participant_count: number;
};

export default function Page() {
  const { id: eventId } = useLocalSearchParams();
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const eventQuery = useQuery<APIResponse<TEvent>>({
    queryKey: ["event", eventId],
    queryFn: () => api("/event/" + eventId),
    // If no eventId is provided don't bother making a request.
    enabled: typeof eventId === "string",
  });

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

  // Called from RefreshControl
  function refreshEvent() {
    eventQuery.refetch();
  }

  // Handle join/unjoin event
  async function JoinEvent() {
    if (!event) return;

    const wantsToLeave = event?.has_joined;
    const errorMessage = wantsToLeave
      ? "Couldn't unjoin event."
      : "Couldn't join event";

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

  if (!eventId || !event) {
    return <FullscreenError>Couldn't find event.</FullscreenError>;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={eventQuery.isLoading}
          onRefresh={refreshEvent}
        />
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
        <View className="space-y-3">
          <View className="flex flex-row space-x-1">
            <Entypo name="location-pin" size={16} color="#fb923c" />
            <Text>
              Where? <Text className="font-bold">{event.location}</Text>
            </Text>
          </View>
          <View className="flex flex-row space-x-1">
            <Entypo name="clock" size={16} color="#fb923c" />
            <Text>
              When?{" "}
              <Text className="font-bold">
                {dayjs(event.happening_at).format("LLL")}
              </Text>
            </Text>
          </View>
          {event.participant_count > 0 ? (
            <View className="flex flex-row items-center space-x-1">
              <AntDesign name="user" size={16} color="#fb923c" />
              <Text>Who?</Text>
              <EventParticipantsAvatars participants={event.participants} />
              <Text>
                <Text className="font-bold">{event.participant_count}</Text>{" "}
                joined
              </Text>
            </View>
          ) : (
            <View>
              <Text className="font-medium">
                No attendees yet. Be the first!
              </Text>
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
