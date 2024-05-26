import { useUser } from "@/hooks/useUser";
import { Redirect, Stack } from "expo-router";

export default function Layout() {
  const user = useUser();

  if (!user) {
    return <Redirect href="/guest/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
