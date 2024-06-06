import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { EventQueryResponse, EventPathParams, Event404 } from "../types/Event";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type EventClient = typeof client<EventQueryResponse, Event404, never>;
type Event = {
    data: EventQueryResponse;
    error: Event404;
    request: never;
    pathParams: EventPathParams;
    queryParams: never;
    headerParams: never;
    response: EventQueryResponse;
    client: {
        parameters: Partial<Parameters<EventClient>[0]>;
        return: Awaited<ReturnType<EventClient>>;
    };
};
export const eventQueryKey = (id: EventPathParams["id"]) => [{ url: "/event/:id/", params: { id: id } }] as const;
export type EventQueryKey = ReturnType<typeof eventQueryKey>;
export function eventQueryOptions(id: EventPathParams["id"], options: Event["client"]["parameters"] = {}) {
    const queryKey = eventQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Event["data"], Event["error"]>({
                method: "get",
                url: `/event/${id}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/:id/
 */
export function useEvent<TData = Event["response"], TQueryData = Event["response"], TQueryKey extends QueryKey = EventQueryKey>(id: EventPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<Event["response"], Event["error"], TData, TQueryData, TQueryKey>>;
    client?: Event["client"]["parameters"];
} = {}): UseQueryResult<TData, Event["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventQueryKey(id);
    const query = useQuery({
        ...eventQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Event["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const eventSuspenseQueryKey = (id: EventPathParams["id"]) => [{ url: "/event/:id/", params: { id: id } }] as const;
export type EventSuspenseQueryKey = ReturnType<typeof eventSuspenseQueryKey>;
export function eventSuspenseQueryOptions(id: EventPathParams["id"], options: Event["client"]["parameters"] = {}) {
    const queryKey = eventSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Event["data"], Event["error"]>({
                method: "get",
                url: `/event/${id}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/:id/
 */
export function useEventSuspense<TData = Event["response"], TQueryKey extends QueryKey = EventSuspenseQueryKey>(id: EventPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<Event["response"], Event["error"], TData, TQueryKey>>;
    client?: Event["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, Event["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...eventSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Event["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}