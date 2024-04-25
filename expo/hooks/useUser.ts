import { useContext } from "react";
import { AuthContext } from "@/modules/authentication/AuthContext";

export const useUser = () => {
  const auth = useContext(AuthContext);
  return auth.user;
};
