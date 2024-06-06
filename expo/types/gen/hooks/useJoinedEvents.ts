import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { JoinedEventsQueryResponse, JoinedEvents403 } from "../types/JoinedEvents";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type JoinedEventsClient = typeof client<JoinedEventsQueryResponse, JoinedEvents403, never>;
type JoinedEvents = {
    data: JoinedEventsQueryResponse;
    error: JoinedEvents403;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: JoinedEventsQueryResponse;
    client: {
        parameters: Partial<Parameters<JoinedEventsClient>[0]>;
        return: Awaited<ReturnType<JoinedEventsClient>>;
    };
};
export const joinedEventsQueryKey = () => [{ url: "/event/joined/" }] as const;
export type JoinedEventsQueryKey = ReturnType<typeof joinedEventsQueryKey>;
export function joinedEventsQueryOptions(options: JoinedEvents["client"]["parameters"] = {}) {
    const queryKey = joinedEventsQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<JoinedEvents["data"], JoinedEvents["error"]>({
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
export function useJoinedEvents<TData = JoinedEvents["response"], TQueryData = JoinedEvents["response"], TQueryKey extends QueryKey = JoinedEventsQueryKey>(options: {
    query?: Partial<QueryObserverOptions<JoinedEvents["response"], JoinedEvents["error"], TData, TQueryData, TQueryKey>>;
    client?: JoinedEvents["client"]["parameters"];
} = {}): UseQueryResult<TData, JoinedEvents["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? joinedEventsQueryKey();
    const query = useQuery({
        ...joinedEventsQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, JoinedEvents["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const joinedEventsSuspenseQueryKey = () => [{ url: "/event/joined/" }] as const;
export type JoinedEventsSuspenseQueryKey = ReturnType<typeof joinedEventsSuspenseQueryKey>;
export function joinedEventsSuspenseQueryOptions(options: JoinedEvents["client"]["parameters"] = {}) {
    const queryKey = joinedEventsSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<JoinedEvents["data"], JoinedEvents["error"]>({
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
export function useJoinedEventsSuspense<TData = JoinedEvents["response"], TQueryKey extends QueryKey = JoinedEventsSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<JoinedEvents["response"], JoinedEvents["error"], TData, TQueryKey>>;
    client?: JoinedEvents["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, JoinedEvents["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? joinedEventsSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...joinedEventsSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, JoinedEvents["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}