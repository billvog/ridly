import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { EventListQueryResponse } from "../types/EventList";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type EventListClient = typeof client<EventListQueryResponse, never, never>;
type EventList = {
    data: EventListQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: EventListQueryResponse;
    client: {
        parameters: Partial<Parameters<EventListClient>[0]>;
        return: Awaited<ReturnType<EventListClient>>;
    };
};
export const eventListQueryKey = () => [{ url: "/event/" }] as const;
export type EventListQueryKey = ReturnType<typeof eventListQueryKey>;
export function eventListQueryOptions(options: EventList["client"]["parameters"] = {}) {
    const queryKey = eventListQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<EventList["data"], EventList["error"]>({
                method: "get",
                url: `/event/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/
 */
export function useEventList<TData = EventList["response"], TQueryData = EventList["response"], TQueryKey extends QueryKey = EventListQueryKey>(options: {
    query?: Partial<QueryObserverOptions<EventList["response"], EventList["error"], TData, TQueryData, TQueryKey>>;
    client?: EventList["client"]["parameters"];
} = {}): UseQueryResult<TData, EventList["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventListQueryKey();
    const query = useQuery({
        ...eventListQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, EventList["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const eventListSuspenseQueryKey = () => [{ url: "/event/" }] as const;
export type EventListSuspenseQueryKey = ReturnType<typeof eventListSuspenseQueryKey>;
export function eventListSuspenseQueryOptions(options: EventList["client"]["parameters"] = {}) {
    const queryKey = eventListSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<EventList["data"], EventList["error"]>({
                method: "get",
                url: `/event/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/
 */
export function useEventListSuspense<TData = EventList["response"], TQueryKey extends QueryKey = EventListSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<EventList["response"], EventList["error"], TData, TQueryKey>>;
    client?: EventList["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, EventList["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventListSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...eventListSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, EventList["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}