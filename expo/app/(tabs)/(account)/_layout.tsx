import { EventDetailsNavigationOptions } from "@/app/shared/event/details";
import { HuntGameNavigationOptions } from "@/app/shared/hunt/game";
import { ProfileShowNavigationOptions } from "@/app/shared/profile/show";
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
      <Stack.Screen name="accountInfo" options={{ title: "Account Information" }} />
      <Stack.Screen name="editProfile" options={{ title: "Edit Profile" }} />

      <Stack.Screen name="hunt/[id]" options={HuntGameNavigationOptions} />
      <Stack.Screen name="event/[id]" options={EventDetailsNavigationOptions} />
      <Stack.Screen name="profile/[id]" options={ProfileShowNavigationOptions} />
    </Stack>
  );
}
