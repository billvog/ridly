import React from "react";
import FullscreenMessage from "@/modules/ui/FullscreenMessage";
import { ActivityIndicator } from "react-native";

export default function FullscreenSpinner() {
  return (
    <FullscreenMessage>
      <ActivityIndicator size={"large"} />
    </FullscreenMessage>
  );
}
