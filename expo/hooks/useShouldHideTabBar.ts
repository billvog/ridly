import { useSegments } from "expo-router";

export function useShouldHideTabBar() {
  const segments = useSegments();
  return segments[2] === "hunt";
}
