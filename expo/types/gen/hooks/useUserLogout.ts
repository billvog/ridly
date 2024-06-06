import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { UserLogoutMutationResponse, UserLogout403 } from "../types/UserLogout";
import type { UseMutationOptions } from "@tanstack/react-query";

 type UserLogoutClient = typeof client<UserLogoutMutationResponse, UserLogout403, never>;
type UserLogout = {
    data: UserLogoutMutationResponse;
    error: UserLogout403;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UserLogoutMutationResponse;
    client: {
        parameters: Partial<Parameters<UserLogoutClient>[0]>;
        return: Awaited<ReturnType<UserLogoutClient>>;
    };
};
/**
 * @link /user/logout/
 */
export function useUserLogout(options: {
    mutation?: UseMutationOptions<UserLogout["response"], UserLogout["error"], UserLogout["request"]>;
    client?: UserLogout["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<UserLogout["data"], UserLogout["error"], UserLogout["request"]>({
                method: "delete",
                url: `/user/logout/`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}