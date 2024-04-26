import Button from "@/modules/ui/Button";
import FullscreenError from "@/modules/ui/FullscreenError";
import { TEvent } from "@/types/event";
import { APIResponse } from "@/utils/api";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Image } from "expo-image";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const { id: eventId } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const navigation = useNavigation();

  const [event, setEvent] = useState<TEvent>();

  if (!eventId) {
    console.error("id for event not set.");
  }

  // Get event from cache
  useEffect(() => {
    const queryData = queryClient.getQueryData<APIResponse<TEvent>>([
      "event",
      eventId,
    ]);

    setEvent(queryData?.data);
  }, []);

  // Set event's name as our header title.
  useEffect(() => {
    navigation.setOptions({
      title: event ? event.name : String(),
    });
  }, [navigation, event]);

  if (!eventId || !event) {
    return <FullscreenError>Couldn't find event.</FullscreenError>;
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={false} />}>
      <Image
        // Stock image for testing.
        source="https://fastly.picsum.photos/id/281/200/200.jpg?hmac=5FvZ-Y5zbbpS3-mJ_mp6-eH61MkwhUJi9qnhscegqkY"
        contentFit="cover"
        contentPosition="center"
        style={{
          width: "100%",
          height: 250,
        }}
      />
      <View className="p-4 space-y-6">
        <View>
          <Text className="font-extrabold text-3xl">{event.name}</Text>
          <View className="flex flex-row items-center">
            <Text className="text-lg">{"by "}</Text>
            <TouchableOpacity>
              <Text className="font-bold text-lg text-orange-500">
                @{event.creator.user.username}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="space-y-3">
          <View className="flex flex-row space-x-1">
            <Entypo name="location-pin" size={16} color="#fb923c" />
            <Text>
              Where? <Text className="font-bold">{event.location}</Text>
            </Text>
          </View>
          <View className="flex flex-row space-x-1">
            <Entypo name="clock" size={16} color="#fb923c" />
            <Text>
              When?{" "}
              <Text className="font-bold">
                {dayjs(event.happening_at).format("LLL")}
              </Text>
            </Text>
          </View>
          <View className="flex flex-row space-x-1">
            <AntDesign name="user" size={16} color="#fb923c" />
            <Text>
              Who? <Text className="font-bold">{event.participant_count}</Text>{" "}
              joined
            </Text>
          </View>
        </View>
        <View>
          <Button onPress={() => {}}>Join</Button>
        </View>
        <Text>{event.description}</Text>
      </View>
    </ScrollView>
  );
}
