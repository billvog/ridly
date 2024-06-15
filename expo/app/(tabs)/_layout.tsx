import { useLocationPermission } from "@/hooks/useLocationPermission";
import { useShouldHideTabBar } from "@/hooks/useShouldHideTabBar";
import { useUser } from "@/hooks/useUser";
import { useUserUpdateLastKnownLocation } from "@/types/gen";
import { Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Redirect, Tabs } from "expo-router";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "(home)/index",
};

export default function Layout() {
  const user = useUser();
  const shouldHideTabBar = useShouldHideTabBar();

  const locationPermissions = useLocationPermission();
  const updateLastKnownLocationMutation = useUserUpdateLastKnownLocation();

  // Get user's current location, and update it in the backend.
  useEffect(() => {
    if (!user || !locationPermissions.determined || !locationPermissions.foreground) {
      return;
    }

    // Fetch current location.
    Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low }).then(
      (response) => {
        const position = response.coords;
        updateLastKnownLocationMutation.mutateAsync({
          last_known_location: { lat: position.latitude, long: position.longitude },
        });
      }
    );

    // Send location to backend.
  }, [user, locationPermissions]);

  if (!user) {
    return <Redirect href="/guest/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#f4511e",
        tabBarStyle: {
          display: shouldHideTabBar ? "none" : "flex",
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(my-events)"
        options={{
          title: "My Events",
          tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
