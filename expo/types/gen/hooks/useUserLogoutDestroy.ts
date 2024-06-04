import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { UserLogoutDestroyMutationResponse } from "../types/UserLogoutDestroy";
import type { UseMutationOptions } from "@tanstack/react-query";

 type UserLogoutDestroyClient = typeof client<UserLogoutDestroyMutationResponse, never, never>;
type UserLogoutDestroy = {
    data: UserLogoutDestroyMutationResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UserLogoutDestroyMutationResponse;
    client: {
        parameters: Partial<Parameters<UserLogoutDestroyClient>[0]>;
        return: Awaited<ReturnType<UserLogoutDestroyClient>>;
    };
};
/**
 * @link /user/logout/
 */
export function useUserLogoutDestroy(options: {
    mutation?: UseMutationOptions<UserLogoutDestroy["response"], UserLogoutDestroy["error"], UserLogoutDestroy["request"]>;
    client?: UserLogoutDestroy["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<UserLogoutDestroy["data"], UserLogoutDestroy["error"], UserLogoutDestroy["request"]>({
                method: "delete",
                url: `/user/logout/`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}