import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { EventRetrieveQueryResponse, EventRetrievePathParams } from "../types/EventRetrieve";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type EventRetrieveClient = typeof client<EventRetrieveQueryResponse, never, never>;
type EventRetrieve = {
    data: EventRetrieveQueryResponse;
    error: never;
    request: never;
    pathParams: EventRetrievePathParams;
    queryParams: never;
    headerParams: never;
    response: EventRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<EventRetrieveClient>[0]>;
        return: Awaited<ReturnType<EventRetrieveClient>>;
    };
};
export const eventRetrieveQueryKey = (id: EventRetrievePathParams["id"]) => [{ url: "/event/:id/", params: { id: id } }] as const;
export type EventRetrieveQueryKey = ReturnType<typeof eventRetrieveQueryKey>;
export function eventRetrieveQueryOptions(id: EventRetrievePathParams["id"], options: EventRetrieve["client"]["parameters"] = {}) {
    const queryKey = eventRetrieveQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<EventRetrieve["data"], EventRetrieve["error"]>({
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
export function useEventRetrieve<TData = EventRetrieve["response"], TQueryData = EventRetrieve["response"], TQueryKey extends QueryKey = EventRetrieveQueryKey>(id: EventRetrievePathParams["id"], options: {
    query?: Partial<QueryObserverOptions<EventRetrieve["response"], EventRetrieve["error"], TData, TQueryData, TQueryKey>>;
    client?: EventRetrieve["client"]["parameters"];
} = {}): UseQueryResult<TData, EventRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventRetrieveQueryKey(id);
    const query = useQuery({
        ...eventRetrieveQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, EventRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const eventRetrieveSuspenseQueryKey = (id: EventRetrievePathParams["id"]) => [{ url: "/event/:id/", params: { id: id } }] as const;
export type EventRetrieveSuspenseQueryKey = ReturnType<typeof eventRetrieveSuspenseQueryKey>;
export function eventRetrieveSuspenseQueryOptions(id: EventRetrievePathParams["id"], options: EventRetrieve["client"]["parameters"] = {}) {
    const queryKey = eventRetrieveSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<EventRetrieve["data"], EventRetrieve["error"]>({
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
export function useEventRetrieveSuspense<TData = EventRetrieve["response"], TQueryKey extends QueryKey = EventRetrieveSuspenseQueryKey>(id: EventRetrievePathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<EventRetrieve["response"], EventRetrieve["error"], TData, TQueryKey>>;
    client?: EventRetrieve["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, EventRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventRetrieveSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...eventRetrieveSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, EventRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}