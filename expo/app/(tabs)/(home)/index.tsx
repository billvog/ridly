import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import { useAuth } from "@/modules/authentication/AuthContext";
import ErrorMessage from "@/modules/ui/ErrorMessage";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import EventScrollFeed, { EventFeedFilters } from "@/modules/ui/event/scroll-feed";
import { useUpcomingEvents } from "@/types/gen";
import { useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";

export default function Page() {
  const auth = useAuth();

  const [feedFilters, setFeedFilters] = useState<EventFeedFilters>({
    distance: undefined,
  });

  const eventsQuery = useUpcomingEvents(
    feedFilters,
    // Wait for user's location update to finish, as we want to show events nearby, if possible.
    { query: { enabled: typeof auth.didUpdateLocation === "boolean" } }
  );

  const [refreshEvents, areEventsRefreshing] = useIsRefreshing(eventsQuery.refetch);

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={areEventsRefreshing} onRefresh={refreshEvents} />
        }
      >
        {eventsQuery.isError ? (
          <ErrorMessage viewStyle="p-10 w-full" textStyle="text-lg text-center">
            Something went wrong loading upcoming events.
          </ErrorMessage>
        ) : (
          <EventScrollFeed
            title="Upcoming Events"
            events={eventsQuery.data}
            isLoading={eventsQuery.isPending}
            filters={feedFilters}
            onUpdateFilters={setFeedFilters}
          />
        )}
      </ScrollView>
    </View>
  );
}
