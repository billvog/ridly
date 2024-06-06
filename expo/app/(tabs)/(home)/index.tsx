import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import ErrorMessage from "@/modules/ui/ErrorMessage";
import EventScrollFeed from "@/modules/ui/EventScrollFeed";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { useEvents } from "@/types/gen";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";

export default function Page() {
  const eventsQuery = useEvents();

  const [refreshEvents, areEventsRefreshing] = useIsRefreshing(eventsQuery.refetch);

  if (eventsQuery.isLoading) {
    return <FullscreenSpinner />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={areEventsRefreshing} onRefresh={refreshEvents} />
      }
    >
      {eventsQuery.isSuccess ? (
        <EventScrollFeed title="Upcoming Events" events={eventsQuery.data} />
      ) : (
        <ErrorMessage viewStyle="p-10 w-full" textStyle="text-lg text-center">
          Something went wrong loading upcoming events.
        </ErrorMessage>
      )}
    </ScrollView>
  );
}
