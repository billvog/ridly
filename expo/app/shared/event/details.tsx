import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import JoinEventButton from "@/modules/ui/event/JoinEventButton";
import { useEvent } from "@/types/gen";
import { AntDesign, Feather } from "@expo/vector-icons";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import classNames from "classnames";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation, useRouter, useSegments } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

export const EventDetailsNavigationOptions: NativeStackNavigationOptions = {
  title: "Event",
  headerBackTitleVisible: false,
};

export default function EventDetails() {
  const { id: eventId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const segments = useSegments();

  const eventQuery = useEvent(typeof eventId === "string" ? eventId : "", {
    query: { enabled: typeof eventId === "string" },
  });

  const event = useMemo(() => eventQuery.data, [eventQuery]);

  const [refreshEvent, isEventRefreshing] = useIsRefreshing(eventQuery.refetch);

  // Set event's name as our header title.
  useEffect(() => {
    if (event) {
      navigation.setOptions({
        title: event.name,
      });
    }
  }, [navigation, event]);

  // Handle join event game
  const JoinHunt = useCallback(() => {
    if (event && event.hunt_id) {
      router.push({
        pathname: `/(tabs)/${segments[1]}/hunt/[id]`,
        params: { id: event.hunt_id },
      });
    }
  }, [event]);

  // Handle creator's handle pressed
  const CreatorHandlePressed = useCallback(() => {
    if (event && event.creator.user.id) {
      router.push({
        pathname: `/(tabs)/${segments[1]}/profile/[id]`,
        params: { id: event.creator.user.id },
      });
    }
  }, [event]);

  if (eventQuery.isLoading) {
    return <FullscreenSpinner />;
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
            <TouchableOpacity onPress={CreatorHandlePressed}>
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
          {event.participant_count! > 0 ? (
            <View className="flex flex-row items-center space-x-1">
              <Feather name="user" size={16} color="#fb923c" />
              <Text>Who?</Text>
              <EventParticipantsAvatars avatars={event.participant_avatars} />
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

function EventParticipantsAvatars({ avatars }: { avatars: string[] }) {
  // Used to know which avatars failed to load
  const [errorMap, setErrorMap] = useState<{ [key: number]: boolean }>({});
  return (
    <View
      className={classNames([
        "flex flex-row items-center",
        { "ml-1": avatars.length > 0 },
      ])}
    >
      {avatars.map((avatar, index) => (
        <Image
          key={index}
          // Use fallback if the avatar fails to load
          source={errorMap[index] ? "https://placehold.co/20/000/FFF" : avatar}
          onError={() => setErrorMap((prev) => ({ ...prev, [index]: true }))}
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
