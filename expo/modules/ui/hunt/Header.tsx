import { Entypo } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import React from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <View className="absolute top-0 w-full">
      <SafeAreaView>
        <BlurView
          tint="dark"
          className="mx-4 my-2 px-6 py-4 rounded-xl overflow-hidden flex flex-row items-center"
        >
          {/* If we can go back, display back button */}
          {router.canGoBack() && (
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Entypo name="chevron-left" size={20} color="white" />
            </TouchableOpacity>
          )}
          <Text className="font-extrabold text-xl text-white">{title}</Text>
        </BlurView>
      </SafeAreaView>
    </View>
  );
}
