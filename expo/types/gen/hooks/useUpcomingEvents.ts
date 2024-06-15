import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { UpcomingEventsQueryResponse } from "../types/UpcomingEvents";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type UpcomingEventsClient = typeof client<UpcomingEventsQueryResponse, never, never>;
type UpcomingEvents = {
    data: UpcomingEventsQueryResponse;
    error: never;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UpcomingEventsQueryResponse;
    client: {
        parameters: Partial<Parameters<UpcomingEventsClient>[0]>;
        return: Awaited<ReturnType<UpcomingEventsClient>>;
    };
};
export const upcomingEventsQueryKey = () => [{ url: "/event/upcoming/" }] as const;
export type UpcomingEventsQueryKey = ReturnType<typeof upcomingEventsQueryKey>;
export function upcomingEventsQueryOptions(options: UpcomingEvents["client"]["parameters"] = {}) {
    const queryKey = upcomingEventsQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UpcomingEvents["data"], UpcomingEvents["error"]>({
                method: "get",
                url: `/event/upcoming/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/upcoming/
 */
export function useUpcomingEvents<TData = UpcomingEvents["response"], TQueryData = UpcomingEvents["response"], TQueryKey extends QueryKey = UpcomingEventsQueryKey>(options: {
    query?: Partial<QueryObserverOptions<UpcomingEvents["response"], UpcomingEvents["error"], TData, TQueryData, TQueryKey>>;
    client?: UpcomingEvents["client"]["parameters"];
} = {}): UseQueryResult<TData, UpcomingEvents["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? upcomingEventsQueryKey();
    const query = useQuery({
        ...upcomingEventsQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, UpcomingEvents["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const upcomingEventsSuspenseQueryKey = () => [{ url: "/event/upcoming/" }] as const;
export type UpcomingEventsSuspenseQueryKey = ReturnType<typeof upcomingEventsSuspenseQueryKey>;
export function upcomingEventsSuspenseQueryOptions(options: UpcomingEvents["client"]["parameters"] = {}) {
    const queryKey = upcomingEventsSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UpcomingEvents["data"], UpcomingEvents["error"]>({
                method: "get",
                url: `/event/upcoming/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /event/upcoming/
 */
export function useUpcomingEventsSuspense<TData = UpcomingEvents["response"], TQueryKey extends QueryKey = UpcomingEventsSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<UpcomingEvents["response"], UpcomingEvents["error"], TData, TQueryKey>>;
    client?: UpcomingEvents["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, UpcomingEvents["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? upcomingEventsSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...upcomingEventsSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, UpcomingEvents["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}