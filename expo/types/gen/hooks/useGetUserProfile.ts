import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { GetUserProfileQueryResponse, GetUserProfilePathParams, GetUserProfile404 } from "../types/GetUserProfile";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type GetUserProfileClient = typeof client<GetUserProfileQueryResponse, GetUserProfile404, never>;
type GetUserProfile = {
    data: GetUserProfileQueryResponse;
    error: GetUserProfile404;
    request: never;
    pathParams: GetUserProfilePathParams;
    queryParams: never;
    headerParams: never;
    response: GetUserProfileQueryResponse;
    client: {
        parameters: Partial<Parameters<GetUserProfileClient>[0]>;
        return: Awaited<ReturnType<GetUserProfileClient>>;
    };
};
export const getUserProfileQueryKey = (id: GetUserProfilePathParams["id"]) => [{ url: "/user/profile/:id/", params: { id: id } }] as const;
export type GetUserProfileQueryKey = ReturnType<typeof getUserProfileQueryKey>;
export function getUserProfileQueryOptions(id: GetUserProfilePathParams["id"], options: GetUserProfile["client"]["parameters"] = {}) {
    const queryKey = getUserProfileQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetUserProfile["data"], GetUserProfile["error"]>({
                method: "get",
                url: `/user/profile/${id}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @description Get user's profile along with their 5 first joined events
 * @link /user/profile/:id/
 */
export function useGetUserProfile<TData = GetUserProfile["response"], TQueryData = GetUserProfile["response"], TQueryKey extends QueryKey = GetUserProfileQueryKey>(id: GetUserProfilePathParams["id"], options: {
    query?: Partial<QueryObserverOptions<GetUserProfile["response"], GetUserProfile["error"], TData, TQueryData, TQueryKey>>;
    client?: GetUserProfile["client"]["parameters"];
} = {}): UseQueryResult<TData, GetUserProfile["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getUserProfileQueryKey(id);
    const query = useQuery({
        ...getUserProfileQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, GetUserProfile["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const getUserProfileSuspenseQueryKey = (id: GetUserProfilePathParams["id"]) => [{ url: "/user/profile/:id/", params: { id: id } }] as const;
export type GetUserProfileSuspenseQueryKey = ReturnType<typeof getUserProfileSuspenseQueryKey>;
export function getUserProfileSuspenseQueryOptions(id: GetUserProfilePathParams["id"], options: GetUserProfile["client"]["parameters"] = {}) {
    const queryKey = getUserProfileSuspenseQueryKey(id);
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<GetUserProfile["data"], GetUserProfile["error"]>({
                method: "get",
                url: `/user/profile/${id}/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @description Get user's profile along with their 5 first joined events
 * @link /user/profile/:id/
 */
export function useGetUserProfileSuspense<TData = GetUserProfile["response"], TQueryKey extends QueryKey = GetUserProfileSuspenseQueryKey>(id: GetUserProfilePathParams["id"], options: {
    query?: Partial<UseSuspenseQueryOptions<GetUserProfile["response"], GetUserProfile["error"], TData, TQueryKey>>;
    client?: GetUserProfile["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, GetUserProfile["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? getUserProfileSuspenseQueryKey(id);
    const query = useSuspenseQuery({
        ...getUserProfileSuspenseQueryOptions(id, clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, GetUserProfile["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}