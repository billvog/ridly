import { useUser } from "@/hooks/useUser";
import Button from "@/modules/ui/Button";
import { APIResponse, api } from "@/utils/api";
import { clearAuthTokens } from "@/utils/authTokens";
import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Href } from "expo-router/build/link/href";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

export default function Page() {
  const user = useUser();

  if (!user) {
    return null;
  }

  return (
    <ScrollView>
      <View className="flex items-center py-14">
        <Image
          source={user.avatar_url}
          className="rounded-full"
          style={{ width: 100, height: 100 }}
        />
        <View className="mt-8 flex items-center">
          <Text className="text-sm">Welcome back,</Text>
          <Text className="font-extrabold text-2xl">
            {[user.first_name, user.last_name].join(" ")}
          </Text>
        </View>
      </View>
      <PreferencesList
        options={[
          {
            name: "General",
            options: [
              {
                name: "Account Information",
                href: "/(account)/accountInfo",
                icon: <AntDesign name="user" size={20} color="black" />,
              },
            ],
          },
        ]}
      />
    </ScrollView>
  );
}

type OptionGroup = {
  name: string;
  options: {
    name: string;
    href: Href;
    icon: React.ReactNode;
  }[];
};

function PreferencesList({ options }: { options: OptionGroup[] }) {
  const router = useRouter();
  return (
    <View>
      {options.map((group) => (
        <View key={group.name}>
          <Text className="px-4 py-4 text-xl font-extrabold">{group.name}</Text>
          <View>
            {group.options.map((option) => (
              <TouchableOpacity
                key={option.name}
                className="flex flex-row items-center bg-gray-200 border-t-2 border-b-2 border-gray-300 p-4"
                onPress={() => router.push(option.href)}
              >
                {option.icon}
                <Text className="ml-4 font-medium text-base">
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <LogoutButton />
    </View>
  );
}

// Handles all the logout functionality.
function LogoutButton() {
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
