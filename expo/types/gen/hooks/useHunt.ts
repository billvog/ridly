import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { HuntQueryResponse, HuntPathParams, Hunt404 } from "../types/Hunt";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type HuntClient = typeof client<HuntQueryResponse, Hunt404, never>;
type Hunt = {
    data: HuntQueryResponse;
    error: Hunt404;
    request: never;
    pathParams: HuntPathParams;
    queryParams: never;
    headerParams: never;
    response: HuntQueryResponse;
    client: {
        parameters: Partial<Parameters<HuntClient>[0]>;
        return: Awaited<ReturnType<HuntClient>>;
    };
};
export const huntQueryKey = (id: HuntPathParams["id"]) => [{ url: "/hunt/:id/", params: { id: id } }] as const;
export type HuntQueryKey = ReturnType<typeof huntQueryKey>;
export function huntQueryOptions(id: HuntPathParams["id"], options: Hunt["client"]["parameters"] = {}) {
    const queryKey = huntQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Hunt["data"], Hunt["error"]>({
                method: "get",
                url: `/hunt/${id}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /hunt/:id/
 */
export function useHunt<TData = Hunt["response"], TQueryData = Hunt["response"], TQueryKey extends QueryKey = HuntQueryKey>(id: HuntPathParams["id"], options: {
    query?: Partial<QueryObserverOptions<Hunt["response"], Hunt["error"], TData, TQueryData, TQueryKey>>;
    client?: Hunt["client"]["parameters"];
} = {}): UseQueryResult<TData, Hunt["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntQueryKey(id);
    const query = useQuery({
        ...huntQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, Hunt["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const huntSuspenseQueryKey = (id: HuntPathParams["id"]) => [{ url: "/hunt/:id/", params: { id: id } }] as const;
export type HuntSuspenseQueryKey = ReturnType<typeof huntSuspenseQueryKey>;
export function huntSuspenseQueryOptions(id: HuntPathParams["id"], options: Hunt["client"]["parameters"] = {}) {
    const queryKey = huntSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<Hunt["data"], Hunt["error"]>({
                method: "get",
                url: `/hunt/${id}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /hunt/:id/
 */
export function useHuntSuspense<TData = Hunt["response"], TQueryKey extends QueryKey = HuntSuspenseQueryKey>(id: HuntPathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<Hunt["response"], Hunt["error"], TData, TQueryKey>>;
    client?: Hunt["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, Hunt["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...huntSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, Hunt["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}