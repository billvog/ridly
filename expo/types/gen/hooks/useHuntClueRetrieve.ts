import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { HuntClueRetrieveQueryResponse, HuntClueRetrievePathParams } from "../types/HuntClueRetrieve";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type HuntClueRetrieveClient = typeof client<HuntClueRetrieveQueryResponse, never, never>;
type HuntClueRetrieve = {
    data: HuntClueRetrieveQueryResponse;
    error: never;
    request: never;
    pathParams: HuntClueRetrievePathParams;
    queryParams: never;
    headerParams: never;
    response: HuntClueRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<HuntClueRetrieveClient>[0]>;
        return: Awaited<ReturnType<HuntClueRetrieveClient>>;
    };
};
export const huntClueRetrieveQueryKey = (clueOrder: HuntClueRetrievePathParams["clue_order"], id: HuntClueRetrievePathParams["id"]) => [{ url: "/hunt/:id/clue/:clue_order/", params: { id: id, clueOrder: clueOrder } }] as const;
export type HuntClueRetrieveQueryKey = ReturnType<typeof huntClueRetrieveQueryKey>;
export function huntClueRetrieveQueryOptions(clueOrder: HuntClueRetrievePathParams["clue_order"], id: HuntClueRetrievePathParams["id"], options: HuntClueRetrieve["client"]["parameters"] = {}) {
    const queryKey = huntClueRetrieveQueryKey(clueOrder, id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<HuntClueRetrieve["data"], HuntClueRetrieve["error"]>({
                method: "get",
                url: `/hunt/${id}/clue/${clueOrder}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /hunt/:id/clue/:clue_order/
 */
export function useHuntClueRetrieve<TData = HuntClueRetrieve["response"], TQueryData = HuntClueRetrieve["response"], TQueryKey extends QueryKey = HuntClueRetrieveQueryKey>(clueOrder: HuntClueRetrievePathParams["clue_order"], id: HuntClueRetrievePathParams["id"], options: {
    query?: Partial<QueryObserverOptions<HuntClueRetrieve["response"], HuntClueRetrieve["error"], TData, TQueryData, TQueryKey>>;
    client?: HuntClueRetrieve["client"]["parameters"];
} = {}): UseQueryResult<TData, HuntClueRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntClueRetrieveQueryKey(clueOrder, id);
    const query = useQuery({
        ...huntClueRetrieveQueryOptions(clueOrder, id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, HuntClueRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const huntClueRetrieveSuspenseQueryKey = (clueOrder: HuntClueRetrievePathParams["clue_order"], id: HuntClueRetrievePathParams["id"]) => [{ url: "/hunt/:id/clue/:clue_order/", params: { id: id, clueOrder: clueOrder } }] as const;
export type HuntClueRetrieveSuspenseQueryKey = ReturnType<typeof huntClueRetrieveSuspenseQueryKey>;
export function huntClueRetrieveSuspenseQueryOptions(clueOrder: HuntClueRetrievePathParams["clue_order"], id: HuntClueRetrievePathParams["id"], options: HuntClueRetrieve["client"]["parameters"] = {}) {
    const queryKey = huntClueRetrieveSuspenseQueryKey(clueOrder, id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<HuntClueRetrieve["data"], HuntClueRetrieve["error"]>({
                method: "get",
                url: `/hunt/${id}/clue/${clueOrder}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /hunt/:id/clue/:clue_order/
 */
export function useHuntClueRetrieveSuspense<TData = HuntClueRetrieve["response"], TQueryKey extends QueryKey = HuntClueRetrieveSuspenseQueryKey>(clueOrder: HuntClueRetrievePathParams["clue_order"], id: HuntClueRetrievePathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<HuntClueRetrieve["response"], HuntClueRetrieve["error"], TData, TQueryKey>>;
    client?: HuntClueRetrieve["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, HuntClueRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntClueRetrieveSuspenseQueryKey(clueOrder, id);
    const query = useSuspenseQuery({
        ...huntClueRetrieveSuspenseQueryOptions(clueOrder, id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, HuntClueRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}