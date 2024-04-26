import { TEvent } from "@/types/event";
import { AntDesign, Entypo } from "@expo/vector-icons";
import dayjs from "dayjs";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { ViewProps as RNViewProps, Text, View } from "react-native";

export type EventCardProps = {
  event: TEvent;
  style?: RNViewProps["style"];
};

export default function EventCard({ event, style }: EventCardProps) {
  return (
    <View
      className="flex flex-col relative overflow-hidden rounded-2xl"
      style={style}
    >
      <Image
        // Stock image for testing.
        source="https://fastly.picsum.photos/id/281/200/200.jpg?hmac=5FvZ-Y5zbbpS3-mJ_mp6-eH61MkwhUJi9qnhscegqkY"
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
        <Text className="text-gray-200 font-extrabold text-lg">
          {event.name}
        </Text>
        <View className="flex flex-row items-center space-x-4 mt-1">
          <View className="flex flex-row items-center">
            <Entypo name="location-pin" size={16} color="#fb923c" />
            <Text className="ml-1 font-bold text-gray-100 text-sm">
              {event.location}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <Entypo name="clock" size={16} color="#fb923c" />
            <Text className="ml-2 font-bold text-sm text-gray-100">
              {dayjs(event.happening_at).fromNow(true)}
            </Text>
          </View>
          <View className="flex flex-row items-center">
            <AntDesign name="user" size={16} color="#fb923c" />
            <Text className="ml-2 font-bold text-sm text-gray-100">
              {event.participant_count}
            </Text>
          </View>
        </View>
      </BlurView>
    </View>
  );
}
