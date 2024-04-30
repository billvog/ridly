import { useUser } from "@/hooks/useUser";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";

export default function Layout() {
  const user = useUser();

  if (!user) {
    return <Redirect href="/guest/login" />;
  }

  return (
    <Tabs
      initialRouteName="(home)"
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
      <Tabs.Screen
        name="(my-events)"
        options={{
          title: "My Events",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="event" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          title: "Account",
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={user.avatar_url}
                contentFit="cover"
                tintColor={focused ? null : "grey"}
                className="rounded-full"
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
