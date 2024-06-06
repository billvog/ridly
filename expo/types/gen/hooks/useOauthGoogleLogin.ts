import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { OauthGoogleLoginMutationRequest, OauthGoogleLoginMutationResponse, OauthGoogleLogin400 } from "../types/OauthGoogleLogin";
import type { UseMutationOptions } from "@tanstack/react-query";

 type OauthGoogleLoginClient = typeof client<OauthGoogleLoginMutationResponse, OauthGoogleLogin400, OauthGoogleLoginMutationRequest>;
type OauthGoogleLogin = {
    data: OauthGoogleLoginMutationResponse;
    error: OauthGoogleLogin400;
    request: OauthGoogleLoginMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: OauthGoogleLoginMutationResponse;
    client: {
        parameters: Partial<Parameters<OauthGoogleLoginClient>[0]>;
        return: Awaited<ReturnType<OauthGoogleLoginClient>>;
    };
};
/**
 * @link /oauth/google/login/
 */
export function useOauthGoogleLogin(options: {
    mutation?: UseMutationOptions<OauthGoogleLogin["response"], OauthGoogleLogin["error"], OauthGoogleLogin["request"]>;
    client?: OauthGoogleLogin["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<OauthGoogleLogin["data"], OauthGoogleLogin["error"], OauthGoogleLogin["request"]>({
                method: "post",
                url: `/oauth/google/login/`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}