import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export default function CreatorBadge() {
  return (
    <View className="mt-4 mr-auto flex-row items-center px-2 py-1 bg-orange-100 border border-orange-200 rounded-xl">
      <Feather name="tool" size={14} color="orange" />
      <Text className="ml-1.5 font-bold text-xs">Creator</Text>
    </View>
  );
}
