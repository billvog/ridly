import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { OauthLoginMutationRequest, OauthLoginMutationResponse, OauthLoginPathParams, OauthLogin400 } from "../types/OauthLogin";
import type { UseMutationOptions } from "@tanstack/react-query";

 type OauthLoginClient = typeof client<OauthLoginMutationResponse, OauthLogin400, OauthLoginMutationRequest>;
type OauthLogin = {
    data: OauthLoginMutationResponse;
    error: OauthLogin400;
    request: OauthLoginMutationRequest;
    pathParams: OauthLoginPathParams;
    queryParams: never;
    headerParams: never;
    response: OauthLoginMutationResponse;
    client: {
        parameters: Partial<Parameters<OauthLoginClient>[0]>;
        return: Awaited<ReturnType<OauthLoginClient>>;
    };
};
/**
 * @link /oauth/:provider/login/
 */
export function useOauthLogin(provider: OauthLoginPathParams["provider"], options: {
    mutation?: UseMutationOptions<OauthLogin["response"], OauthLogin["error"], OauthLogin["request"]>;
    client?: OauthLogin["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<OauthLogin["data"], OauthLogin["error"], OauthLogin["request"]>({
                method: "post",
                url: `/oauth/${provider}/login/`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}