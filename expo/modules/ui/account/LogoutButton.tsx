import Button from "@/modules/ui/Button";
import { clearAuthTokens } from "@/utils/authTokens";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";

export default function LogoutButton() {
  const router = useRouter();

  const queryClient = useQueryClient();

  const logout = React.useCallback(async () => {
    // Clear authentication tokens
    await clearAuthTokens();

    // Clear all query cache
    queryClient.clear();

    // Show success toast
    Toast.show({
      type: "success",
      text1: "Logged out",
    });

    router.push({ pathname: "/guest" });
  }, [queryClient, router]);

  return (
    <Button onPress={logout} buttonStyle="mt-10 bg-red-500 mx-auto">
      Logout
    </Button>
  );
}
