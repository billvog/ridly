import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { UserUpdateLastKnownLocationMutationRequest, UserUpdateLastKnownLocationMutationResponse, UserUpdateLastKnownLocation400, UserUpdateLastKnownLocation403 } from "../types/UserUpdateLastKnownLocation";
import type { UseMutationOptions } from "@tanstack/react-query";

 type UserUpdateLastKnownLocationClient = typeof client<UserUpdateLastKnownLocationMutationResponse, UserUpdateLastKnownLocation400 | UserUpdateLastKnownLocation403, UserUpdateLastKnownLocationMutationRequest>;
type UserUpdateLastKnownLocation = {
    data: UserUpdateLastKnownLocationMutationResponse;
    error: UserUpdateLastKnownLocation400 | UserUpdateLastKnownLocation403;
    request: UserUpdateLastKnownLocationMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UserUpdateLastKnownLocationMutationResponse;
    client: {
        parameters: Partial<Parameters<UserUpdateLastKnownLocationClient>[0]>;
        return: Awaited<ReturnType<UserUpdateLastKnownLocationClient>>;
    };
};
/**
 * @link /user/update/location/
 */
export function useUserUpdateLastKnownLocation(options: {
    mutation?: UseMutationOptions<UserUpdateLastKnownLocation["response"], UserUpdateLastKnownLocation["error"], UserUpdateLastKnownLocation["request"]>;
    client?: UserUpdateLastKnownLocation["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<UserUpdateLastKnownLocation["data"], UserUpdateLastKnownLocation["error"], UserUpdateLastKnownLocation["request"]>({
                method: "put",
                url: `/user/update/location/`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}