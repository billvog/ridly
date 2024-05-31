import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import FullscreenError from "@/modules/ui/FullscreenError";
import JoinEventButton from "@/modules/ui/event/JoinEventButton";
import { TEvent } from "@/types/event";
import { APIResponse, api } from "@/utils/api";
import { AntDesign, Feather } from "@expo/vector-icons";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function EventDetails() {
  const { event: eventId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const eventQuery = useQuery<APIResponse<TEvent>>({
    queryKey: ["event", eventId],
    queryFn: () => api("/event/" + eventId + "/"),
    // If no eventId is provided don't bother making a request.
    enabled: typeof eventId === "string",
  });

  const [refreshEvent, isEventRefreshing] = useIsRefreshing(eventQuery.refetch);

  const [event, setEvent] = useState<TEvent | null>();

  // Get event from eventQuery
  useEffect(() => {
    if (eventQuery.isLoading) {
      return;
    }

    if (eventQuery.data && eventQuery.data.ok) {
      setEvent(eventQuery.data.data);
    } else {
      setEvent(null);
    }
  }, [eventQuery.data]);

  // Set event's name as our header title.
  useEffect(() => {
    navigation.setOptions({
      title: event ? event.name : "Event",
      headerBackTitleVisible: false,
    } satisfies NativeStackNavigationOptions);
  }, [navigation, event]);

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
        source="https://images.unsplash.com/photo-1503417680882-163c1609fd2f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
          <JoinEventButton event={event} />
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
