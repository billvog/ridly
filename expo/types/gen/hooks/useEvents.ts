import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { EventsQueryResponse } from "../types/Events";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type EventsClient = typeof client<EventsQueryResponse, never, never>;
type Events = {
    data: EventsQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: EventsQueryResponse;
    client: {
        parameters: Partial<Parameters<EventsClient>[0]>;
        return: Awaited<ReturnType<EventsClient>>;
    };
};
export const eventsQueryKey = () => [{ url: "/event/" }] as const;
export type EventsQueryKey = ReturnType<typeof eventsQueryKey>;
export function eventsQueryOptions(options: Events["client"]["parameters"] = {}) {
    const queryKey = eventsQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Events["data"], Events["error"]>({
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
export function useEvents<TData = Events["response"], TQueryData = Events["response"], TQueryKey extends QueryKey = EventsQueryKey>(options: {
    query?: Partial<QueryObserverOptions<Events["response"], Events["error"], TData, TQueryData, TQueryKey>>;
    client?: Events["client"]["parameters"];
} = {}): UseQueryResult<TData, Events["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventsQueryKey();
    const query = useQuery({
        ...eventsQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Events["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const eventsSuspenseQueryKey = () => [{ url: "/event/" }] as const;
export type EventsSuspenseQueryKey = ReturnType<typeof eventsSuspenseQueryKey>;
export function eventsSuspenseQueryOptions(options: Events["client"]["parameters"] = {}) {
    const queryKey = eventsSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Events["data"], Events["error"]>({
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
export function useEventsSuspense<TData = Events["response"], TQueryKey extends QueryKey = EventsSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<Events["response"], Events["error"], TData, TQueryKey>>;
    client?: Events["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, Events["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? eventsSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...eventsSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Events["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}