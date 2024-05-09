import { Redirect, Stack } from "expo-router";
import { useUser } from "@/hooks/useUser";

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
      <Stack.Screen name="[hunt]" />
    </Stack>
  );
}
