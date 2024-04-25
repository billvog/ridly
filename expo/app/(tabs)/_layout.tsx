import { useUser } from "@/hooks/useUser";
import { clearAuthTokens } from "@/utils/authTokens";
import { Entypo } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Redirect, Tabs, router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { APIResponse, api } from "../../utils/api";

export default function Layout() {
  const user = useUser();

  if (!user) {
    return <Redirect href="/guest/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f4511e",
        headerRight: HeaderRight,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="home" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

function HeaderRight() {
  const user = useUser();

  const queryClient = useQueryClient();
  const logoutMutation = useMutation<APIResponse>({
    mutationFn: () => api("/user/logout/", "DELETE"),
  });

  function logout() {
    logoutMutation.mutate(undefined, {
      onSuccess(data) {
        if (data.ok) {
          // Clear cache for queryClient
          queryClient.clear();

          // Clear memory stored auth tokens
          clearAuthTokens();

          // Show success toast
          Toast.show({
            type: "success",
            text1: "Logged out",
          });

          // Redirect
          router.replace("/guest/login");
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
    <View className="pr-4">
      <Pressable onPress={logout}>
        <Text>Logout {user.username}</Text>
      </Pressable>
    </View>
  );
}
