import Button from "@/modules/ui/Button";
import EventCard from "@/modules/ui/EventCard";
import { TextInput } from "@/modules/ui/TextInput";
import { Event, UpcomingEventsQueryParams } from "@/types/gen";
import { Feather } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";

const EventCardWidth = Dimensions.get("window").width * 0.8;
const EventCardSpacingInset = Dimensions.get("window").width * 0.1 - 30;

export type EventFeedFilters = UpcomingEventsQueryParams;

type UpdateEventFiltersFn = (filters: EventFeedFilters) => void;

type EventScrollFeedProps = {
  title: string;
  events: Event[];

  filters: EventFeedFilters;
  onUpdateFilters: UpdateEventFiltersFn;

  isRefreshing: boolean;
  refresh: () => void;
};

export default function EventScrollFeed({
  title,
  events,
  filters,
  onUpdateFilters,
  isRefreshing,
  refresh,
}: EventScrollFeedProps) {
  const filterSheetRef = useRef<BottomSheet>(null);
  const showFilterSheet = useCallback(() => {
    filterSheetRef.current?.snapToIndex(0);
  }, []);

  return (
    <View className="flex-1">
      <ScrollView
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refresh} />}
      >
        <View className="flex-row items-center justify-between p-6 pb-4">
          <Text className="font-extrabold text-3xl">{title}</Text>
          <TouchableOpacity
            className="p-2 bg-orange-100 rounded-lg"
            onPress={() => showFilterSheet()}
          >
            <Feather name="filter" size={16} color="orange" />
          </TouchableOpacity>
        </View>
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
      </ScrollView>

      <FiltersBottomSheet
        sheetRef={filterSheetRef}
        filters={filters}
        onUpdate={onUpdateFilters}
      />
    </View>
  );
}

function FiltersBottomSheet({
  sheetRef,
  filters,
  onUpdate,
}: {
  sheetRef: React.RefObject<BottomSheet>;
  filters: EventFeedFilters;
  onUpdate: UpdateEventFiltersFn;
}) {
  const snapPoints = useMemo(() => ["40%"], []);
  const formMethods = useForm<EventFeedFilters>({
    defaultValues: {
      distance: String(filters.distance) as any,
    },
  });

  const submitForm = formMethods.handleSubmit((data) => {
    onUpdate(data);
    sheetRef.current?.close();
  });

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            opacity={0.3}
            enableTouchThrough={false}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            style={[
              { backgroundColor: "rgba(0, 0, 0, 1)" },
              StyleSheet.absoluteFillObject,
            ]}
          />
        )}
      >
        <BottomSheetView>
          <View className="divide-y-2 divide-gray-200">
            <View className="px-10 pt-2 pb-5">
              <Text className="font-extrabold text-2xl">Filters</Text>
            </View>
            <View className="px-10 py-6">
              <FormProvider {...formMethods}>
                <TextInput
                  component={BottomSheetTextInput}
                  label="Distance (km)"
                  name="distance"
                  placeholder="Distance in km, to show nearby events"
                  keyboardType="numeric"
                />
              </FormProvider>

              <Button onPress={submitForm} buttonStyle="mr-auto mt-2">
                Apply Filters
              </Button>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
