import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type FullscreenError = {
  children: string | React.ReactNode;
};

export default function FullscreenError({ children }: FullscreenError) {
  return (
    <View className="w-full h-full flex-1 flex justify-center items-center">
      <MaterialIcons name="error-outline" size={32} color="red" />
      <View className="mt-4">
        {typeof children === "string" ? (
          <Text className="font-extrabold text-2xl text-red-500">
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
}
