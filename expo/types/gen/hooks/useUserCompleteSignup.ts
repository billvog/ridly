import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { UserCompleteSignupMutationRequest, UserCompleteSignupMutationResponse, UserCompleteSignup400, UserCompleteSignup403 } from "../types/UserCompleteSignup";
import type { UseMutationOptions } from "@tanstack/react-query";

 type UserCompleteSignupClient = typeof client<UserCompleteSignupMutationResponse, UserCompleteSignup400 | UserCompleteSignup403, UserCompleteSignupMutationRequest>;
type UserCompleteSignup = {
    data: UserCompleteSignupMutationResponse;
    error: UserCompleteSignup400 | UserCompleteSignup403;
    request: UserCompleteSignupMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UserCompleteSignupMutationResponse;
    client: {
        parameters: Partial<Parameters<UserCompleteSignupClient>[0]>;
        return: Awaited<ReturnType<UserCompleteSignupClient>>;
    };
};
/**
 * @link /user/complete-signup/
 */
export function useUserCompleteSignup(options: {
    mutation?: UseMutationOptions<UserCompleteSignup["response"], UserCompleteSignup["error"], UserCompleteSignup["request"]>;
    client?: UserCompleteSignup["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<UserCompleteSignup["data"], UserCompleteSignup["error"], UserCompleteSignup["request"]>({
                method: "put",
                url: `/user/complete-signup/`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}