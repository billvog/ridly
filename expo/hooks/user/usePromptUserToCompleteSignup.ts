import { useRouter } from "expo-router";
import { useEffect } from "react";
import { User } from "@/types/gen";

export function usePromptUserToCompleteSignup(user: User | null) {
  const router = useRouter();

  useEffect(() => {
    if (user && !user.did_complete_signup) {
      router.navigate("/(tabs)/(home)/complete-signup");
    }
  }, [user]);
}
