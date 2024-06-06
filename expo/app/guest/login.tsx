import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Button from "@/modules/ui/Button";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIResponse, api } from "@/utils/api";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { User, userMeQueryKey } from "@/types/gen";

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useMutation<APIResponse, Error, any>({
    mutationFn: (values) => api("/oauth/google/login/", "POST", values),
  });

  const [_, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_OAUTH_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication) {
      login(response.authentication.accessToken);
    }
  }, [response]);

  function login(token: string) {
    loginMutation.mutate(
      {
        token,
      },
      {
        onSuccess: (data) => {
          if (!data.ok) {
            if (data.status === 400 && data.data.detail) {
              Toast.show({ type: "error", text1: data.data.detail });
            } else {
              Toast.show({ type: "error", text1: "Something went wrong." });
            }

            return;
          }

          const user: User = data.data;

          Toast.show({
            type: "success",
            text1: "Logged in as",
            text2: user.username,
            text1Style: {
              fontSize: 14,
              fontWeight: "normal",
            },
            text2Style: {
              fontSize: 16,
              color: "black",
              fontWeight: "bold",
            },
          });

          // Update cache
          queryClient.setQueryData(userMeQueryKey(), user);

          router.push({ pathname: "/" });
        },
      }
    );
  }

  return (
    <View className="flex-1 flex justify-center items-center bg-orange-400">
      <Text className="mb-5 text-center text-5xl font-extrabold">Ridly.</Text>
      <Button onPress={() => promptAsync()}>Sign In with Google</Button>
    </View>
  );
}
