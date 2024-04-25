import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/modules/authentication/AuthContext";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

interface ProvidersProps {
  children: JSX.Element;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
      <Toast position="bottom" bottomOffset={60} />
    </>
  );
};
