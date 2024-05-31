import Button from "@/modules/ui/Button";
import { TEvent } from "@/types/event";
import { APIResponse, api } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import React from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";

type JoinEventButtonProps = {
  event: TEvent;
};

type JoinEventResponse = {
  has_joined: boolean;
  participant_count: number;
};

export default function JoinEventButton({ event }: JoinEventButtonProps) {
  const queryClient = useQueryClient();

  const joinEventMutation = useMutation<APIResponse<JoinEventResponse>>({
    mutationKey: ["event", event.id, "join"],
    mutationFn: () => api("/event/" + event.id + "/join/", "POST"),
  });

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
    joinEventMutation.mutate(undefined, {
      onSuccess(data) {
        if (data.ok) {
          // Extract new has_joined from response
          const { has_joined, participant_count } = data.data;

          // Update cache
          queryClient.setQueryData<APIResponse<TEvent>>(
            ["event", event.id],
            (event) =>
              event && {
                ...event,
                data: { ...event.data, participant_count, has_joined },
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
        } else {
          // Otherwise, show error toast
          Toast.show({
            type: "error",
            text1: errorMessage,
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
