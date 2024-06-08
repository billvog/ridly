import { HuntGameNavigationOptions } from "@/app/shared/hunt/game";
import { Stack } from "expo-router";
import React from "react";

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
      <Stack.Screen name="index" options={{ title: "My Events" }} />
      <Stack.Screen name="hunt/[id]" options={HuntGameNavigationOptions} />
    </Stack>
  );
}
