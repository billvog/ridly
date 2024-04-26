import { TEvent } from "@/types/event";
import dayjs from "dayjs";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import React from "react";
import { Text, View } from "react-native";

export type EventCardProps = {
  event: TEvent;
};

export default function EventCard({ event }: EventCardProps) {
  return (
    <View
      className="flex flex-col relative overflow-hidden rounded-2xl"
      style={{ width: 300 }}
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
        className="absolute bottom-0 flex flex-col w-full px-5 py-4"
      >
        <Text className="text-gray-200">
          <Text className="font-extrabold text-base">{event.name}</Text>
          <Text className="text-sm">
            {" ― "}
            {dayjs(event.happening_at).fromNow()}
          </Text>
        </Text>
        <Text className="text-gray-200 font-medium text-sm">
          {event.participant_count} joined
        </Text>
      </BlurView>
    </View>
  );
}
