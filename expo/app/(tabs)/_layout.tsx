import { useUser } from "@/hooks/useUser";
import { Entypo } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

export default function Layout() {
  const user = useUser();

  if (!user) {
    return <Redirect href="/guest/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#f4511e",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="home" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
