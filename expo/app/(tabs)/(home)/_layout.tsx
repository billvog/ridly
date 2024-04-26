import { useUser } from "@/hooks/useUser";
import { Link, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

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
    <View>
      <Link href="/me">
        <Text className="font-bold text-white">{user.username}</Text>
      </Link>
    </View>
  );
}
