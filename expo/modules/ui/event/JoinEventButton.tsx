import Button from "@/modules/ui/Button";
import { Event, eventQueryKey, useJoinEvent } from "@/types/gen";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

type JoinEventButtonProps = {
  event: Event;
};

export default function JoinEventButton({ event }: JoinEventButtonProps) {
  const queryClient = useQueryClient();

  const joinEventMutation = useJoinEvent(event.id);

  async function JoinEvent() {
    if (!event) return;

    const wantsToLeave = event.has_joined;
    const errorMessage = wantsToLeave ? "Couldn't unjoin event." : "Couldn't join event";

    // Warn user if they're about to leave
    if (wantsToLeave) {
      const shouldContinue = await new Promise<boolean>((resolve) => {
        Alert.alert("Confirm", "Do you ridly.. want to leave?", [
          {
            text: "Yeah",
            style: "destructive",
            onPress: () => resolve(true),
          },
          { text: "God no!", onPress: () => resolve(false) },
        ]);
      });

      if (!shouldContinue) {
        return;
      }
    }

    // Execute mutation
    joinEventMutation.mutate(null as never, {
      onSuccess(data) {
        // Extract new has_joined from response
        const { has_joined, participant_count } = data;

        // Update cache
        queryClient.setQueryData<Event>(
          eventQueryKey(event.id),
          (event) =>
            event && {
              ...event,
              participant_count,
              has_joined,
            }
        );

        // Display toast to inform user it went ok
        if (has_joined) {
          Toast.show({
            type: "success",
            text1: "Joined event!",
            text1Style: {
              fontSize: 16,
            },
            text2: `${event.name} in ${dayjs(event.happening_at).fromNow(true)}`,
            text2Style: {
              fontSize: 12,
            },
          });
        } else {
          Toast.show({
            type: "success",
            text1: "Unjoined event :^(",
          });
        }
      },
      onError(error) {
        // On error, log to console and show error toast
        console.error(error);
        Toast.show({
          type: "error",
          text1: errorMessage,
        });
      },
    });
  }

  return (
    <Button
      onPress={JoinEvent}
      loading={joinEventMutation.isPending}
      buttonStyle={event.has_joined ? "bg-red-600" : "bg-black"}
    >
      {event.has_joined ? "Unjoin" : "Join"}
    </Button>
  );
}
