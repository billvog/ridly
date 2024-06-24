import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { UpdateUserProfileMutationRequest, UpdateUserProfileMutationResponse, UpdateUserProfile403 } from "../types/UpdateUserProfile";
import type { UseMutationOptions } from "@tanstack/react-query";

 type UpdateUserProfileClient = typeof client<UpdateUserProfileMutationResponse, UpdateUserProfile403, UpdateUserProfileMutationRequest>;
type UpdateUserProfile = {
    data: UpdateUserProfileMutationResponse;
    error: UpdateUserProfile403;
    request: UpdateUserProfileMutationRequest;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UpdateUserProfileMutationResponse;
    client: {
        parameters: Partial<Parameters<UpdateUserProfileClient>[0]>;
        return: Awaited<ReturnType<UpdateUserProfileClient>>;
    };
};
/**
 * @link /user/profile/edit/
 */
export function useUpdateUserProfile(options: {
    mutation?: UseMutationOptions<UpdateUserProfile["response"], UpdateUserProfile["error"], UpdateUserProfile["request"]>;
    client?: UpdateUserProfile["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async (data) => {
            const res = await client<UpdateUserProfile["data"], UpdateUserProfile["error"], UpdateUserProfile["request"]>({
                method: "patch",
                url: `/user/profile/edit/`,
                data,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}