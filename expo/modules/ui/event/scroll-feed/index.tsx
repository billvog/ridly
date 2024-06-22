import EventCard from "@/modules/ui/EventCard";
import { FiltersBottomSheet } from "@/modules/ui/event/scroll-feed/FiltersBottomSheet";
import { Event, MiniEvent, UpcomingEventsQueryParams } from "@/types/gen";
import { Feather } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const EventCardWidth = Dimensions.get("window").width * 0.8;
const EventCardSpacingInset = Dimensions.get("window").width * 0.1 - 30;

export type EventFeedFilters = UpcomingEventsQueryParams;

export type UpdateEventFiltersFn = (filters: EventFeedFilters) => void;

type EventScrollFeedProps = {
  title?: string;
  events: Event[] | MiniEvent[];

  filters?: EventFeedFilters;
  onUpdateFilters?: UpdateEventFiltersFn;

  cardHeight?: number;
};

export default function EventScrollFeed({
  title,
  events,
  filters,
  onUpdateFilters,
  cardHeight = 380,
}: EventScrollFeedProps) {
  const filterSheetRef = useRef<BottomSheet>(null);
  const showFilterSheet = useCallback(() => {
    filterSheetRef.current?.snapToIndex(0);
  }, []);

  const isUsingFilters = useMemo(
    () => filters && !!onUpdateFilters,
    [filters, onUpdateFilters]
  );

  return (
    <>
      <View>
        <View className="flex-row items-center justify-between p-6 pb-4">
          {title && <Text className="font-extrabold text-3xl">{title}</Text>}
          {isUsingFilters && (
            <TouchableOpacity
              className="p-2 bg-orange-100 rounded-lg"
              onPress={() => showFilterSheet()}
            >
              <Feather name="filter" size={16} color="orange" />
            </TouchableOpacity>
          )}
        </View>

        {events.length === 0 ? (
          <View className="flex-1 items-center justify-center" style={{ height: 200 }}>
            <Text className="font-bold text-xl text-gray-700 mb-2">No events found</Text>
            {isUsingFilters && (
              <Text className="font-medium text-xs text-gray-700">
                Try adjusting the filters or refreshing the feed.
              </Text>
            )}
          </View>
        ) : (
          <ScrollView
            style={{ height: cardHeight }}
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
              paddingHorizontal: Platform.OS === "android" ? EventCardSpacingInset : 0,
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
        )}
      </View>

      {isUsingFilters && (
        <FiltersBottomSheet
          sheetRef={filterSheetRef}
          filters={filters!}
          onUpdate={onUpdateFilters!}
        />
      )}
    </>
  );
}
