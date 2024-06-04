import client from "@kubb/swagger-client/client";
import { useMutation } from "@tanstack/react-query";
import type { EventJoinCreateMutationResponse, EventJoinCreatePathParams } from "../types/EventJoinCreate";
import type { UseMutationOptions } from "@tanstack/react-query";

 type EventJoinCreateClient = typeof client<EventJoinCreateMutationResponse, never, never>;
type EventJoinCreate = {
    data: EventJoinCreateMutationResponse;
    error: never;
    request: never;
    pathParams: EventJoinCreatePathParams;
    queryParams: never;
    headerParams: never;
    response: EventJoinCreateMutationResponse;
    client: {
        parameters: Partial<Parameters<EventJoinCreateClient>[0]>;
        return: Awaited<ReturnType<EventJoinCreateClient>>;
    };
};
/**
 * @link /event/:id/join/
 */
export function useEventJoinCreate(id: EventJoinCreatePathParams["id"], options: {
    mutation?: UseMutationOptions<EventJoinCreate["response"], EventJoinCreate["error"], EventJoinCreate["request"]>;
    client?: EventJoinCreate["client"]["parameters"];
} = {}) {
    const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {};
    return useMutation({
        mutationFn: async () => {
            const res = await client<EventJoinCreate["data"], EventJoinCreate["error"], EventJoinCreate["request"]>({
                method: "post",
                url: `/event/${id}/join/`,
                ...clientOptions
            });
            return res.data;
        },
        ...mutationOptions
    });
}