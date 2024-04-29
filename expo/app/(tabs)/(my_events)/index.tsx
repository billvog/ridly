import EventCard from "@/modules/ui/EventCard";
import FullscreenError from "@/modules/ui/FullscreenError";
import FullscreenMessage from "@/modules/ui/FullscreenMessage";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { TEvent } from "@/types/event";
import { APIResponse, api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, Text } from "react-native";

export default function Page() {
  const eventsQuery = useQuery<APIResponse<TEvent[]>>({
    queryKey: ["event", "joined"],
    queryFn: () => api("/event/joined/"),
  });

  const [events, setEvents] = useState<TEvent[] | null>([]);

  useEffect(() => {
    if (eventsQuery.data && eventsQuery.data.ok) {
      setEvents(eventsQuery.data.data);
    } else {
      setEvents(null);
    }
  }, [eventsQuery.data]);

  function refreshEvents() {
    eventsQuery.refetch();
  }

  // Query failed.
  if (events == null || eventsQuery.isError) {
    return <FullscreenError>Something went wrong.</FullscreenError>;
  }

  if (eventsQuery.isLoading) {
    return <FullscreenSpinner />;
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
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={eventsQuery.isLoading}
          onRefresh={refreshEvents}
        />
      }
      contentContainerStyle={{ padding: 30, rowGap: 20 }}
    >
      {events.map((e) => (
        <EventCard
          key={e.id}
          event={e}
          style={{ width: "100%", height: 300 }}
        />
      ))}
    </ScrollView>
  );
}
