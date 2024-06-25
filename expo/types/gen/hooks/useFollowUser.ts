import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { FollowUserMutationResponse, FollowUserPathParams, FollowUser403, FollowUser404 } from "../types/FollowUser";
import type { UseMutationOptions } from "@tanstack/react-query";

 type FollowUserClient = typeof client<FollowUserMutationResponse, FollowUser403 | FollowUser404, never>;
type FollowUser = {
    data: FollowUserMutationResponse;
    error: FollowUser403 | FollowUser404;
    request: never;
    pathParams: FollowUserPathParams;
    queryParams: never;
    headerParams: never;
    response: FollowUserMutationResponse;
    client: {
        parameters: Partial<Parameters<FollowUserClient>[0]>;
        return: Awaited<ReturnType<FollowUserClient>>;
    };
};
/**
 * @description Follow or unfollow a user
 * @link /user/profile/:id/follow/
 */
export function useFollowUser(id: FollowUserPathParams["id"], options: {
    mutation?: UseMutationOptions<FollowUser["response"], FollowUser["error"], FollowUser["request"]>;
    client?: FollowUser["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<FollowUser["data"], FollowUser["error"], FollowUser["request"]>({
                method: "post",
                url: `/user/profile/${id}/follow/`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}