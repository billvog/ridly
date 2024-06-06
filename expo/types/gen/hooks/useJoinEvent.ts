import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { JoinEventMutationResponse, JoinEventPathParams, JoinEvent403, JoinEvent404 } from "../types/JoinEvent";
import type { UseMutationOptions } from "@tanstack/react-query";

 type JoinEventClient = typeof client<JoinEventMutationResponse, JoinEvent403 | JoinEvent404, never>;
type JoinEvent = {
    data: JoinEventMutationResponse;
    error: JoinEvent403 | JoinEvent404;
    request: never;
    pathParams: JoinEventPathParams;
    queryParams: never;
    headerParams: never;
    response: JoinEventMutationResponse;
    client: {
        parameters: Partial<Parameters<JoinEventClient>[0]>;
        return: Awaited<ReturnType<JoinEventClient>>;
    };
};
/**
 * @link /event/:id/join/
 */
export function useJoinEvent(id: JoinEventPathParams["id"], options: {
    mutation?: UseMutationOptions<JoinEvent["response"], JoinEvent["error"], JoinEvent["request"]>;
    client?: JoinEvent["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<JoinEvent["data"], JoinEvent["error"], JoinEvent["request"]>({
                method: "post",
                url: `/event/${id}/join/`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}