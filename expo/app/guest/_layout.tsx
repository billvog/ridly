import { Redirect, Stack } from "expo-router";
import { useUser } from "@/hooks/useUser";

export default function Layout() {
  const user = useUser();

  if (user) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
