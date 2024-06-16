import { usePromptUserToCompleteSignup } from "@/hooks/user/usePromptUserToCompleteSignup";
import { useUpdateUserLocation } from "@/hooks/user/useUpdateUserLocation";
import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { User, useUserMe } from "@/types/gen";
import { clearAuthTokens } from "@/utils/authTokens";
import React, { useContext, useEffect, useState } from "react";
import { handleQueryError } from "../../utils/queryError";
import { Text } from "react-native";
import FullscreenError from "../ui/FullscreenError";
import Button from "../ui/Button";

type AuthContextType = {
  user: User | null;
  initializing: boolean;
  didUpdateLocation?: boolean;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  initializing: true,
  didUpdateLocation: undefined,
});

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const [isServerError, setIsServerError] = useState(false);

  const meQuery = useUserMe({ query: { retry: false } });

  useEffect(() => {
    if (meQuery.isLoading) {
      return;
    }

    if (meQuery.isError) {
      setUser(null);
      handleQueryError(meQuery.error as any, (error, status) => {
        // Clear tokens if the user the sent token contains is not found.
        // That means the user has been deleted, so we shoud log them out.
        if (error.detail === "User not found") {
          clearAuthTokens();
        }

        // If status is 5xx, we should show a server error screen.
        setIsServerError(status >= 500);
      });
    } else if (meQuery.isSuccess) {
      setUser(meQuery.data);
    }

    setInitializing(false);
  }, [meQuery]);

  // Propmt user to complete signup if they haven't.
  usePromptUserToCompleteSignup(user);

  // Update user's last known location.
  const didUpdateLocation = useUpdateUserLocation(user);

  if (meQuery.isLoading) {
    return <FullscreenSpinner />;
  }

  if (isServerError) {
    return <ServerError onRetry={() => meQuery.refetch()} />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
        didUpdateLocation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

function ServerError({ onRetry }: { onRetry: () => void }) {
  return (
    <FullscreenError>
      <Text className="font-extrabold text-red-500 text-2xl text-center">{`Something went wrong.\nPlease try again later.`}</Text>
      <Button buttonStyle="mt-8 mx-auto" textStyle="font-extrabold" onPress={onRetry}>
        Retry
      </Button>
    </FullscreenError>
  );
}
