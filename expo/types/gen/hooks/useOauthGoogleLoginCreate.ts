import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { OauthGoogleLoginCreateMutationRequest, OauthGoogleLoginCreateMutationResponse } from "../types/OauthGoogleLoginCreate";
import type { UseMutationOptions } from "@tanstack/react-query";

 type OauthGoogleLoginCreateClient = typeof client<OauthGoogleLoginCreateMutationResponse, never, OauthGoogleLoginCreateMutationRequest>;
type OauthGoogleLoginCreate = {
    data: OauthGoogleLoginCreateMutationResponse;
    error: never;
    request: OauthGoogleLoginCreateMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: OauthGoogleLoginCreateMutationResponse;
    client: {
        parameters: Partial<Parameters<OauthGoogleLoginCreateClient>[0]>;
        return: Awaited<ReturnType<OauthGoogleLoginCreateClient>>;
    };
};
/**
 * @link /oauth/google/login/
 */
export function useOauthGoogleLoginCreate(options: {
    mutation?: UseMutationOptions<OauthGoogleLoginCreate["response"], OauthGoogleLoginCreate["error"], OauthGoogleLoginCreate["request"]>;
    client?: OauthGoogleLoginCreate["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<OauthGoogleLoginCreate["data"], OauthGoogleLoginCreate["error"], OauthGoogleLoginCreate["request"]>({
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