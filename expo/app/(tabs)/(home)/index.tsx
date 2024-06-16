import { useIsRefreshing } from "@/hooks/useIsRefreshing";
import { useAuth } from "@/modules/authentication/AuthContext";
import ErrorMessage from "@/modules/ui/ErrorMessage";
import EventScrollFeed, { EventFeedFilters } from "@/modules/ui/EventScrollFeed";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { useUpcomingEvents } from "@/types/gen";
import { useState } from "react";
import { View } from "react-native";

export default function Page() {
  const auth = useAuth();

  const [feedFilters, setFeedFilters] = useState<EventFeedFilters>({
    distance: 10,
  });

  const eventsQuery = useUpcomingEvents(
    feedFilters,
    // Wait for user's location update to finish, as we want to show events nearby, if possible.
    { query: { enabled: typeof auth.didUpdateLocation === "boolean" } }
  );

  const [refreshEvents, areEventsRefreshing] = useIsRefreshing(eventsQuery.refetch);

  if (eventsQuery.isPending) {
    return <FullscreenSpinner />;
  }

  return (
    <View className="flex-1">
      {eventsQuery.isSuccess && (
        <EventScrollFeed
          title="Upcoming Events"
          events={eventsQuery.data}
          filters={feedFilters}
          onUpdateFilters={setFeedFilters}
          isRefreshing={areEventsRefreshing}
          refresh={refreshEvents}
        />
      )}

      {eventsQuery.isError && (
        <ErrorMessage viewStyle="p-10 w-full" textStyle="text-lg text-center">
          Something went wrong loading upcoming events.
        </ErrorMessage>
      )}
    </View>
  );
}
