import EventCard from "@/modules/ui/EventCard";
import { TEvent } from "@/types/event";
import { api } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

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
        <ScrollView
          horizontal
          contentContainerStyle={{
            padding: 24,
            gap: 18,
          }}
          className="w-full"
          style={{ height: 400 }}
        >
          {eventsData.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
