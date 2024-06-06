import FullscreenSpinner from "@/modules/ui/FullscreenSpinner";
import { User, useUserMe } from "@/types/gen";
import { clearAuthTokens } from "@/utils/authTokens";
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
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const meQuery = useUserMe();

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

  // function retryFailure() {
  //   meQuery.refetch();
  // }
  //
  // if (false) {
  //   return (
  //     <FullscreenError>
  //       <Text className="font-extrabold text-red-500 text-2xl text-center">{`Something went wrong.\nPlease try again later.`}</Text>
  //       <Button
  //         buttonStyle="mt-8 mx-auto"
  //         textStyle="font-extrabold"
  //         onPress={retryFailure}
  //       >
  //         Retry
  //       </Button>
  //     </FullscreenError>
  //   );
  // }

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
