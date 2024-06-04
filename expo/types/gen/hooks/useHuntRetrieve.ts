import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { HuntRetrieveQueryResponse, HuntRetrievePathParams } from "../types/HuntRetrieve";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type HuntRetrieveClient = typeof client<HuntRetrieveQueryResponse, never, never>;
type HuntRetrieve = {
    data: HuntRetrieveQueryResponse;
    error: never;
    request: never;
    pathParams: HuntRetrievePathParams;
    queryParams: never;
    headerParams: never;
    response: HuntRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<HuntRetrieveClient>[0]>;
        return: Awaited<ReturnType<HuntRetrieveClient>>;
    };
};
export const huntRetrieveQueryKey = (id: HuntRetrievePathParams["id"]) => [{ url: "/hunt/:id/", params: { id: id } }] as const;
export type HuntRetrieveQueryKey = ReturnType<typeof huntRetrieveQueryKey>;
export function huntRetrieveQueryOptions(id: HuntRetrievePathParams["id"], options: HuntRetrieve["client"]["parameters"] = {}) {
    const queryKey = huntRetrieveQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<HuntRetrieve["data"], HuntRetrieve["error"]>({
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
export function useHuntRetrieve<TData = HuntRetrieve["response"], TQueryData = HuntRetrieve["response"], TQueryKey extends QueryKey = HuntRetrieveQueryKey>(id: HuntRetrievePathParams["id"], options: {
    query?: Partial<QueryObserverOptions<HuntRetrieve["response"], HuntRetrieve["error"], TData, TQueryData, TQueryKey>>;
    client?: HuntRetrieve["client"]["parameters"];
} = {}): UseQueryResult<TData, HuntRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntRetrieveQueryKey(id);
    const query = useQuery({
        ...huntRetrieveQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, HuntRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const huntRetrieveSuspenseQueryKey = (id: HuntRetrievePathParams["id"]) => [{ url: "/hunt/:id/", params: { id: id } }] as const;
export type HuntRetrieveSuspenseQueryKey = ReturnType<typeof huntRetrieveSuspenseQueryKey>;
export function huntRetrieveSuspenseQueryOptions(id: HuntRetrievePathParams["id"], options: HuntRetrieve["client"]["parameters"] = {}) {
    const queryKey = huntRetrieveSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<HuntRetrieve["data"], HuntRetrieve["error"]>({
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
export function useHuntRetrieveSuspense<TData = HuntRetrieve["response"], TQueryKey extends QueryKey = HuntRetrieveSuspenseQueryKey>(id: HuntRetrievePathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<HuntRetrieve["response"], HuntRetrieve["error"], TData, TQueryKey>>;
    client?: HuntRetrieve["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, HuntRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntRetrieveSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...huntRetrieveSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, HuntRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}