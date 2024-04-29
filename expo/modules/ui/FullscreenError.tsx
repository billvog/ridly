import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import FullscreenMessage from "@/modules/ui/FullscreenMessage";

type FullscreenError = {
  children: string | React.ReactNode;
};

export default function FullscreenError({ children }: FullscreenError) {
  return (
    <FullscreenMessage>
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
    </FullscreenMessage>
  );
}
