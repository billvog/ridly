import Button from "@/modules/ui/Button";
import { GetUserProfileQuery, getUserProfileQueryKey, useFollowUser } from "@/types/gen";
import { handleMutationError } from "@/utils/mutationError";
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
      buttonStyle={classNames("mr-auto px-4 py-2", buttonBackgroundColor)}
      textStyle="text-sm"
      loading={followUserMutation.isPending}
    >
      {buttonText}
    </Button>
  );
}
