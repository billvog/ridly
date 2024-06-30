import Button from "@/modules/ui/Button";
import ButtonStyles from "@/modules/ui/user-profile/buttons/ButtonStyles";
import { GetUserProfileQuery, getUserProfileQueryKey, useFollowUser } from "@/types/gen";
import { handleMutationError } from "@/utils/mutationError";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import React, { useCallback, useMemo } from "react";

type FollowButtonProps = {
  user: {
    id: string;
    profile: {
      follow_status: boolean;
    };
  };
};

export default function FollowButton({ user }: FollowButtonProps) {
  const queryClient = useQueryClient();
  const followUserMutation = useFollowUser(user.id);

  const buttonBackgroundColor = useMemo(
    () => (user.profile.follow_status ? "bg-red-500" : "bg-black"),
    [user]
  );

  const buttonText = useMemo(
    () => (user.profile.follow_status ? "Unfollow" : "Follow"),
    [user]
  );

  const buttonIconName = useMemo(
    () => (user.profile.follow_status ? "user-minus" : "user-plus"),
    [user]
  );

  const followPressed = useCallback(() => {
    followUserMutation.mutate(undefined as never, {
      onSuccess(data) {
        // Update the cache to reflect the new follow status
        queryClient.setQueryData<GetUserProfileQuery["Response"]>(
          getUserProfileQueryKey(user.id),
          (old) =>
            old
              ? {
                  ...old,
                  user: { ...old.user, profile: { ...old.user.profile, ...data } },
                }
              : undefined
        );
      },
      onError(error) {
        handleMutationError(error as any);
      },
    });
  }, []);

  return (
    <Button
      onPress={followPressed}
      loading={followUserMutation.isPending}
      buttonStyle={classNames(ButtonStyles.button, buttonBackgroundColor)}
      textStyle={ButtonStyles.text}
      icon={<Feather name={buttonIconName} size={ButtonStyles.iconWidth} color="white" />}
    >
      {buttonText}
    </Button>
  );
}
