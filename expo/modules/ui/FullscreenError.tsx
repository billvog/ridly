import FullscreenMessage from "@/modules/ui/FullscreenMessage";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type FullscreenError = {
  children: string | React.ReactNode;
};

export default function FullscreenError({ children }: FullscreenError) {
  return (
    <FullscreenMessage>
      <MaterialIcons name="error-outline" size={40} color="red" />
      <View className="mt-4">
        {typeof children === "string" ? (
          <Text className="font-extrabold text-2xl text-center text-red-500">
            {children}
          </Text>
        ) : (
          children
        )}
      </View>
    </FullscreenMessage>
  );
}
