import { useSetNavigationOptions } from "@/hooks/useSetNavigationOptions";
import { useUser } from "@/hooks/useUser";
import Button from "@/modules/ui/Button";
import { APIResponse, api } from "@/utils/api";
import { clearAuthTokens } from "@/utils/authTokens";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Page() {
  useSetNavigationOptions({ title: "My Account" });
  const user = useUser();

  const queryClient = useQueryClient();
  const logoutMutation = useMutation<APIResponse>({
    mutationFn: () => api("/user/logout/", "DELETE"),
  });

  function logout() {
    logoutMutation.mutate(undefined, {
      onSuccess(data) {
        if (data.ok) {
          // Reset "user/me" cached query that
          // stores logged in user.
          queryClient.resetQueries({ queryKey: ["user", "me"] });

          // Clear memory stored auth tokens
          clearAuthTokens();

          // Show success toast
          Toast.show({
            type: "success",
            text1: "Logged out",
          });

          // Redirect will happen in (tabs)/_layout.tsx

          return;
        }

        // Show erorr toast
        Toast.show({
          type: "error",
          text1: "Failed to logout",
        });
      },
      onError(error) {
        // Print error and show error toast
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Failed to logout",
        });
      },
    });
  }

  if (!user) {
    return null;
  }

  return (
    <View className="p-6 space-y-2">
      <Text>Full name: {user.first_name + " " + user.last_name}</Text>
      <Text>Username: {user.username}</Text>
      <Text>Email: {user.email}</Text>
      <View className="mt-10">
        <Button onPress={logout} buttonStyle="bg-red-500">
          Logout
        </Button>
      </View>
    </View>
  );
}
