import { useUser } from "@/hooks/useUser";
import { Link, Stack } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerRight: HomeHeaderRight }} />
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
        <Text className="font-bold">{user.username}</Text>
      </Link>
    </View>
  );
}
