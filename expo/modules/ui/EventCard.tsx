import { TEvent } from "@/types/event";
import { fakeAPIResponse } from "@/utils/api";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useRouter, useSegments } from "expo-router";
import React from "react";
import { ViewProps as RNViewProps, Text, TouchableOpacity, View } from "react-native";

export type EventCardProps = {
  event: TEvent;
  style?: RNViewProps["style"];
};

export default function EventCard({ event, style }: EventCardProps) {
  const router = useRouter();
  const segments = useSegments();
  const queryClient = useQueryClient();

  function onPress() {
    queryClient.setQueryData(["event", event.id], fakeAPIResponse(event));
    router.push({
      pathname: `/(tabs)/${segments[1]}/[event]`,
      params: { event: event.id },
    });
  }

  return (
    <TouchableOpacity
      className="flex flex-col relative overflow-hidden rounded-2xl"
      style={style}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image
        // Stock image for testing.
        source="https://images.unsplash.com/photo-1503417680882-163c1609fd2f?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        contentFit="cover"
        className="flex-1"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
      <BlurView
        intensity={50}
        tint="dark"
        className="absolute bottom-0 flex flex-col w-full px-5 pt-3 pb-4"
      >
        <Text className="text-gray-200 font-extrabold text-lg">{event.name}</Text>
        <View className="flex flex-row items-center space-x-4 mt-1">
          <View className="flex flex-row items-center">
            <Feather name="map-pin" size={16} color="#fb923c" />
            <Text className="ml-1 font-bold text-gray-100 text-sm">
              {event.location_name}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Feather name="clock" size={16} color="#fb923c" />
            <Text className="ml-2 font-bold text-sm text-gray-100">
              {dayjs(event.happening_at).fromNow(true)}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Feather name="user" size={16} color="#fb923c" />
            <Text className="ml-2 font-bold text-sm text-gray-100">
              {event.participant_count}
            </Text>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );
}
