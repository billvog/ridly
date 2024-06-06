import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { HuntClueQueryResponse, HuntCluePathParams, HuntClue404 } from "../types/HuntClue";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type HuntClueClient = typeof client<HuntClueQueryResponse, HuntClue404, never>;
type HuntClue = {
    data: HuntClueQueryResponse;
    error: HuntClue404;
    request: never;
    pathParams: HuntCluePathParams;
    queryParams: never;
    headerParams: never;
    response: HuntClueQueryResponse;
    client: {
        parameters: Partial<Parameters<HuntClueClient>[0]>;
        return: Awaited<ReturnType<HuntClueClient>>;
    };
};
export const huntClueQueryKey = (clueOrder: HuntCluePathParams["clue_order"], id: HuntCluePathParams["id"]) => [{ url: "/hunt/:id/clue/:clue_order/", params: { id: id, clueOrder: clueOrder } }] as const;
export type HuntClueQueryKey = ReturnType<typeof huntClueQueryKey>;
export function huntClueQueryOptions(clueOrder: HuntCluePathParams["clue_order"], id: HuntCluePathParams["id"], options: HuntClue["client"]["parameters"] = {}) {
    const queryKey = huntClueQueryKey(clueOrder, id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<HuntClue["data"], HuntClue["error"]>({
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
export function useHuntClue<TData = HuntClue["response"], TQueryData = HuntClue["response"], TQueryKey extends QueryKey = HuntClueQueryKey>(clueOrder: HuntCluePathParams["clue_order"], id: HuntCluePathParams["id"], options: {
    query?: Partial<QueryObserverOptions<HuntClue["response"], HuntClue["error"], TData, TQueryData, TQueryKey>>;
    client?: HuntClue["client"]["parameters"];
} = {}): UseQueryResult<TData, HuntClue["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntClueQueryKey(clueOrder, id);
    const query = useQuery({
        ...huntClueQueryOptions(clueOrder, id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, HuntClue["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const huntClueSuspenseQueryKey = (clueOrder: HuntCluePathParams["clue_order"], id: HuntCluePathParams["id"]) => [{ url: "/hunt/:id/clue/:clue_order/", params: { id: id, clueOrder: clueOrder } }] as const;
export type HuntClueSuspenseQueryKey = ReturnType<typeof huntClueSuspenseQueryKey>;
export function huntClueSuspenseQueryOptions(clueOrder: HuntCluePathParams["clue_order"], id: HuntCluePathParams["id"], options: HuntClue["client"]["parameters"] = {}) {
    const queryKey = huntClueSuspenseQueryKey(clueOrder, id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<HuntClue["data"], HuntClue["error"]>({
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
export function useHuntClueSuspense<TData = HuntClue["response"], TQueryKey extends QueryKey = HuntClueSuspenseQueryKey>(clueOrder: HuntCluePathParams["clue_order"], id: HuntCluePathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<HuntClue["response"], HuntClue["error"], TData, TQueryKey>>;
    client?: HuntClue["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, HuntClue["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? huntClueSuspenseQueryKey(clueOrder, id);
    const query = useSuspenseQuery({
        ...huntClueSuspenseQueryOptions(clueOrder, id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, HuntClue["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}