import Button from "@/modules/ui/Button";
import ButtonStyles from "@/modules/ui/user-profile/buttons/ButtonStyles";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

export default function EditButton() {
  const router = useRouter();

  const editPressed = React.useCallback(() => {
    router.push("/(tabs)/(account)/editProfile");
  }, [router]);

  return (
    <Button
      onPress={editPressed}
      buttonStyle={ButtonStyles.button}
      textStyle={ButtonStyles.text}
      icon={<Feather name="edit-3" size={14} color="white" />}
    >
      Edit
    </Button>
  );
}
