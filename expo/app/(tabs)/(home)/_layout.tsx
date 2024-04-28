import { useUser } from "@/hooks/useUser";
import { Image } from "expo-image";
import { Stack, router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "Home", headerRight: HomeHeaderRight }}
      />
      <Stack.Screen name="me" options={{ title: "My Account" }} />
    </Stack>
  );
}

function HomeHeaderRight() {
  const user = useUser();
  if (!user) {
    return null;
  }

  return (
    <TouchableOpacity onPress={() => router.push("/me")}>
      <Image
        source={user.avatar_url}
        contentFit="cover"
        className="flex-1 rounded-xl"
        style={{
          width: 32,
          height: 32,
        }}
      />
    </TouchableOpacity>
  );
}
