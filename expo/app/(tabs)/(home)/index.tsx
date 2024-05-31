import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import EventScrollFeed from "@/modules/ui/EventScrollFeed";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { TEvent } from "@/types/event";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

export default function Page() {
  const eventsQuery = useQuery({
    queryKey: ["event", "all"],
    queryFn: () => api("/event/"),
  });

  const [refreshEvents, areEventsRefreshing] = useIsRefreshing(eventsQuery.refetch);

  const [eventsData, setEventsData] = useState<TEvent[]>([]);

  useEffect(() => {
    setEventsData(eventsQuery.data?.data || []);
  }, [eventsQuery.data]);

  if (eventsQuery.isLoading) {
    return <FullscreenSpinner />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={areEventsRefreshing} onRefresh={refreshEvents} />
      }
    >
      <EventScrollFeed title="Upcoming Events" events={eventsData} />
    </ScrollView>
  );
}
