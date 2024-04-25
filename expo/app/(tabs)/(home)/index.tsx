import React from "react";
import { Text, View } from "react-native";
import { useSetNavigationOptions } from "@/hooks/useSetNavigationOptions";

export default function Page() {
  useSetNavigationOptions({ title: "Home" });
  return (
    <View className="p-6">
      <Text>This is the home page.</Text>
    </View>
  );
}
