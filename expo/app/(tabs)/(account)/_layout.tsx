import { Stack } from "expo-router";
import React from "react";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "#f4511e",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "My Account" }} />
      <Stack.Screen
        name="accountInfo"
        options={{ title: "Account Information" }}
      />
    </Stack>
  );
}
