import { ModalProvider } from "@/modules/ModalContext";
import { AuthProvider } from "@/modules/authentication/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useSegments } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

// Setup notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface ProvidersProps {
  children: JSX.Element;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const segments = useSegments();
  const isInTabs = segments[0] === "(tabs)";

  // Request notification permissions and get push token on mount
  useEffect(() => {
    RequestNotificationsPermission();
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ModalProvider>{children}</ModalProvider>
        </AuthProvider>
      </QueryClientProvider>
      <Toast position="bottom" bottomOffset={isInTabs ? 90 : 60} />
    </>
  );
};

async function RequestNotificationsPermission() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get push token for push notification!");
    return;
  }

  // TODO: Get ExpoPushToken for push notifications and return it.

  /*
  const token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
  return token;
  */
}
