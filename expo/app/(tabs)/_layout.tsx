import { useShouldHideTabBar } from "@/hooks/useShouldHideTabBar";
import { useUser } from "@/hooks/user/useUser";
import { Feather } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(home)/index",
};

export default function Layout() {
  const user = useUser();
  const shouldHideTabBar = useShouldHideTabBar();

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
