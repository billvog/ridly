import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenMessage from "@/modules/ui/FullscreenMessage";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { TEvent } from "@/types/event";
import { APIResponse, api } from "@/utils/api";
import { Entypo } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Agenda, AgendaEntry, AgendaSchedule } from "react-native-calendars";

export default function Page() {
  const router = useRouter();

  const eventsQuery = useQuery<APIResponse<TEvent[]>>({
    queryKey: ["event", "joined"],
    queryFn: () => api("/event/joined/"),
  });

  const [refreshEvents, areEventsRefreshing] = useIsRefreshing(eventsQuery.refetch);

  const [events, setEvents] = useState<TEvent[] | null>([]);
  const [agendaSchedule, setAgendaSchedule] = useState<AgendaSchedule>({});

  // Extract events from the query data.
  useEffect(() => {
    if (eventsQuery.data && eventsQuery.data.ok) {
      setEvents(eventsQuery.data.data);
    } else {
      setEvents(null);
    }
  }, [eventsQuery.data]);

  // Create AgendaSchedule from fetched events.
  useEffect(() => {
    let schedule = {} as AgendaSchedule;
    events?.forEach((e) => {
      const formattedDate = dayjs(e.happening_at).format("YYYY-MM-DD");
      (schedule[formattedDate] = schedule[formattedDate] || []).push({
        name: e.id,
        day: String(),
        height: 0,
      });
    });
    setAgendaSchedule(schedule);
  }, [events]);

  // Navigate to event detail screen.
  function onEventPressed(eventId: string) {
    router.push({
      pathname: "/(my-events)/[event]",
      params: {
        event: eventId,
      },
    });
  }

  function AgendaRefreshControl() {
    return <RefreshControl refreshing={areEventsRefreshing} onRefresh={refreshEvents} />;
  }

  function RenderAgendaDay(day?: Date) {
    if (!day) return <View />;
    return (
      <View className="mt-4 mx-6 flex justify-center">
        <Text className="text-xl font-extrabold">{dayjs(day).date()}</Text>
        <Text className="text-base">{dayjs(day).format("MMM")}</Text>
      </View>
    );
  }

  function RenderAgendaItem(item: AgendaEntry) {
    // Find event.
    const event = events?.find((e) => e.id === item.name);
    if (!event) return <View />;

    return (
      <TouchableOpacity
        onPress={() => onEventPressed(event.id)}
        activeOpacity={0.5}
        className="flex-1 flex justify-center bg-white rounded-xl p-6 mt-4 mr-4"
      >
        <Text className="font-extrabold text-xl leading-loose">{event.name}</Text>
        <View className="flex flex-row items-center gap-2">
          <Entypo name="clock" size={14} color="#fb923c" />
          <Text>{dayjs(event.happening_at).format("LT")}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  function RenderAgendaEmptyData() {
    return (
      <ScrollView
        refreshControl={AgendaRefreshControl()}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text className="text-2xl font-extrabold text-gray-500">Nothing planned.</Text>
      </ScrollView>
    );
  }

  // Initial fetching.
  if (eventsQuery.isFetching && !eventsQuery.isRefetching) {
    return <FullscreenSpinner />;
  }

  // Query failed.
  if (events == null || eventsQuery.isError) {
    return <FullscreenError>Something went wrong.</FullscreenError>;
  }

  // No joined events.
  if (events.length <= 0) {
    return (
      <FullscreenMessage>
        <Text className="text-xl font-bold text-gray-400">
          You haven't joined any events.
        </Text>
      </FullscreenMessage>
    );
  }

  return (
    <Agenda
      items={agendaSchedule}
      refreshControl={AgendaRefreshControl()}
      renderItem={RenderAgendaItem}
      renderDay={RenderAgendaDay as any}
      renderEmptyData={RenderAgendaEmptyData}
    />
  );
}
