import Button from "@/modules/ui/Button";
import { useUserLogout, userMeQueryKey } from "@/types/gen";
import { clearAuthTokens } from "@/utils/authTokens";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function LogoutButton() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const logoutMutation = useUserLogout();

  function logout() {
    logoutMutation.mutate(null as never, {
      onSuccess() {
        // Reset "user/me" cached query that
        // stores logged in user.
        queryClient.resetQueries({ queryKey: userMeQueryKey() });
        queryClient.clear();

        // Clear memory stored auth tokens
        clearAuthTokens();

        // Show success toast
        Toast.show({
          type: "success",
          text1: "Logged out",
        });

        router.push({ pathname: "/guest" });
      },
      onError(error) {
        console.error(error);
        Toast.show({
          type: "error",
          text1: "Failed to logout",
        });
      },
    });
  }

  return (
    <Button
      onPress={logout}
      loading={logoutMutation.isPending}
      buttonStyle="mt-10 bg-red-500 mx-auto"
    >
      Logout
    </Button>
  );
}
