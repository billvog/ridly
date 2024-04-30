import { AuthProvider } from "@/modules/authentication/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSegments } from "expo-router";
import React from "react";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: JSX.Element;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  const segments = useSegments();
  const isInTabs = segments[0] === "(tabs)";

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
      <Toast position="bottom" bottomOffset={isInTabs ? 90 : 60} />
    </>
  );
};
