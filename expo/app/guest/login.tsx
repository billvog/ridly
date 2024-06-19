import Button from "@/modules/ui/Button";
import { useOauthLogin, userMeQueryKey } from "@/types/gen";
import { handleMutationError } from "@/utils/mutationError";
import { useQueryClient } from "@tanstack/react-query";
import * as Google from "expo-auth-session/providers/google";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const loginMutation = useOauthLogin("google");

  const [_, response, promptAsync] = Google.useAuthRequest({
    iosClientId: process.env.EXPO_PUBLIC_OAUTH_GOOGLE_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response && response.type === "success" && response.authentication) {
      login(response.authentication.accessToken);
    }
  }, [response]);

  function login(token: string) {
    loginMutation.mutate(
      {
        token,
      },
      {
        onSuccess: (user) => {
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
        onError: (error) => handleMutationError(error as any),
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
