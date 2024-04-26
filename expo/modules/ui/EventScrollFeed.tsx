import EventCard from "@/modules/ui/EventCard";
import { TEvent } from "@/types/event";
import React from "react";
import { Dimensions, Platform, ScrollView, Text, View } from "react-native";

const EventCardWidth = Dimensions.get("window").width * 0.8;
const EventCardSpacingInset = Dimensions.get("window").width * 0.1 - 30;

type EventScrollFeedProps = {
  title?: string | React.ReactNode;
  events: TEvent[];
};

export default function EventScrollFeed({
  title = null,
  events,
}: EventScrollFeedProps) {
  return (
    <View>
      {title && typeof title === "string" ? (
        <Text className="p-6 pb-4 font-extrabold text-3xl">{title}</Text>
      ) : (
        title
      )}
      <ScrollView
        style={{ height: 380 }}
        horizontal
        pagingEnabled
        decelerationRate={0}
        showsHorizontalScrollIndicator={false}
        snapToInterval={EventCardWidth + 24}
        snapToAlignment="center"
        contentInset={{
          // iOS ONLY
          left: EventCardSpacingInset,
          right: EventCardSpacingInset,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            Platform.OS === "android" ? EventCardSpacingInset : 0,
        }}
      >
        {events.map((e) => (
          <EventCard
            key={e.id}
            event={e}
            style={{ width: EventCardWidth, marginHorizontal: 12 }}
          />
        ))}
      </ScrollView>
    </View>
  );
}
