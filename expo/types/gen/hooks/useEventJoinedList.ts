import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { EventJoinedListQueryResponse } from "../types/EventJoinedList";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type EventJoinedListClient = typeof client<EventJoinedListQueryResponse, never, never>;
type EventJoinedList = {
    data: EventJoinedListQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: EventJoinedListQueryResponse;
    client: {
        parameters: Partial<Parameters<EventJoinedListClient>[0]>;
        return: Awaited<ReturnType<EventJoinedListClient>>;
    };
};
export const eventJoinedListQueryKey = () => [{ url: "/event/joined/" }] as const;
export type EventJoinedListQueryKey = ReturnType<typeof eventJoinedListQueryKey>;
export function eventJoinedListQueryOptions(options: EventJoinedList["client"]["parameters"] = {}) {
    const queryKey = eventJoinedListQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<EventJoinedList["data"], EventJoinedList["error"]>({
                method: "get",
                url: `/event/joined/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/joined/
 */
export function useEventJoinedList<TData = EventJoinedList["response"], TQueryData = EventJoinedList["response"], TQueryKey extends QueryKey = EventJoinedListQueryKey>(options: {
    query?: Partial<QueryObserverOptions<EventJoinedList["response"], EventJoinedList["error"], TData, TQueryData, TQueryKey>>;
    client?: EventJoinedList["client"]["parameters"];
} = {}): UseQueryResult<TData, EventJoinedList["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventJoinedListQueryKey();
    const query = useQuery({
        ...eventJoinedListQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, EventJoinedList["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const eventJoinedListSuspenseQueryKey = () => [{ url: "/event/joined/" }] as const;
export type EventJoinedListSuspenseQueryKey = ReturnType<typeof eventJoinedListSuspenseQueryKey>;
export function eventJoinedListSuspenseQueryOptions(options: EventJoinedList["client"]["parameters"] = {}) {
    const queryKey = eventJoinedListSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<EventJoinedList["data"], EventJoinedList["error"]>({
                method: "get",
                url: `/event/joined/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/joined/
 */
export function useEventJoinedListSuspense<TData = EventJoinedList["response"], TQueryKey extends QueryKey = EventJoinedListSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<EventJoinedList["response"], EventJoinedList["error"], TData, TQueryKey>>;
    client?: EventJoinedList["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, EventJoinedList["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventJoinedListSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...eventJoinedListSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, EventJoinedList["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}