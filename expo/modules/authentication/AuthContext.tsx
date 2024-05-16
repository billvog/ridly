import { TUser } from "@/types/user";
import { api } from "@/utils/api";
import { clearAuthTokens } from "@/utils/authTokens";
import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";

type AuthContextType = {
  user: TUser | null;
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
  const [user, setUser] = useState<TUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  const meQuery = useQuery({
    queryKey: ["user", "me"],
    queryFn: () => api("/user/me/"),
  });

  useEffect(() => {
    if (!meQuery.data) {
      setUser(null);
    } else if (meQuery.data.status === 200) {
      setUser(meQuery.data.data.user);
    } else if (
      meQuery.data.status === 403 &&
      meQuery.data.data.detail === "User not found"
    ) {
      clearAuthTokens();
    }

    setInitializing(false);
  }, [meQuery.data]);

  if (meQuery.isError) {
    return (
      <View>
        <Text>server error (500)</Text>
      </View>
    );
  }

  if (meQuery.isLoading) {
    return (
      <View>
        <Text>loading...</Text>
      </View>
    );
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
