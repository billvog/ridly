// Configure axios instance.
import "@/utils/axios";

import { ModalProvider } from "@/modules/ModalContext";
import { AuthProvider } from "@/modules/authentication/AuthContext";
import { Store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { useSegments } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-toast-message";
import { Provider as ReduxProvider } from "react-redux";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <ReduxProvider store={Store}>
            <AuthProvider>
              <ModalProvider>{children}</ModalProvider>
            </AuthProvider>
          </ReduxProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
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
