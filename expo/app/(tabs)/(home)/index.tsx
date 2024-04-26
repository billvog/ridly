import EventScrollFeed from "@/modules/ui/EventScrollFeed";
import { TEvent } from "@/types/event";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Page() {
  const eventsQuery = useQuery({
    queryKey: ["event", "all"],
    queryFn: () => api("/event/"),
  });

  const [eventsData, setEventsData] = useState<TEvent[]>([]);

  useEffect(() => {
    setEventsData(eventsQuery.data?.data || []);
  }, [eventsQuery.data]);

  return (
    <View>
      {eventsQuery.isLoading ? (
        <Text>Loading events...</Text>
      ) : (
        <EventScrollFeed title="Upcoming Events" events={eventsData} />
      )}
    </View>
  );
}
