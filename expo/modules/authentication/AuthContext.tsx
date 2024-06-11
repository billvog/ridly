import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { User, useUserMe } from "@/types/gen";
import { clearAuthTokens } from "@/utils/authTokens";
import { useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  initializing: boolean;
};

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  initializing: true,
});

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const meQuery = useUserMe({ query: { retry: false } });

  useEffect(() => {
    if (meQuery.isLoading) {
      return;
    }

    if (meQuery.isError) {
      setUser(null);

      if (meQuery.error.detail === "User not found") {
        clearAuthTokens();
      }
    } else if (meQuery.isSuccess) {
      setUser(meQuery.data);
    }

    setInitializing(false);
  }, [meQuery]);

  // Propmt user to complete signup if they haven't
  useEffect(() => {
    if (user && !user.did_complete_signup) {
      router.navigate("/(tabs)/(home)/complete-signup");
    }
  }, [user]);

  if (meQuery.isLoading) {
    return <FullscreenSpinner />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        initializing,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
