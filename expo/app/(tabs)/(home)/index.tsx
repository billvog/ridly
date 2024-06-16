import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import { useAuth } from "@/modules/authentication/AuthContext";
import ErrorMessage from "@/modules/ui/ErrorMessage";
import EventScrollFeed from "@/modules/ui/EventScrollFeed";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { useUpcomingEvents } from "@/types/gen";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";

export default function Page() {
  const auth = useAuth();

  const eventsQuery = useUpcomingEvents(
    { distance: 10 },
    // Wait for user's location update to finish, as we want to show events nearby, if possible.
    { query: { enabled: typeof auth.didUpdateLocation === "boolean" } }
  );

  const [refreshEvents, areEventsRefreshing] = useIsRefreshing(eventsQuery.refetch);

  if (eventsQuery.isPending) {
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
