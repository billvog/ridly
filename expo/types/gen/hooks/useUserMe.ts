import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { UserMeQueryResponse, UserMe403 } from "../types/UserMe";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type UserMeClient = typeof client<UserMeQueryResponse, UserMe403, never>;
type UserMe = {
    data: UserMeQueryResponse;
    error: UserMe403;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UserMeQueryResponse;
    client: {
        parameters: Partial<Parameters<UserMeClient>[0]>;
        return: Awaited<ReturnType<UserMeClient>>;
    };
};
export const userMeQueryKey = () => [{ url: "/user/me/" }] as const;
export type UserMeQueryKey = ReturnType<typeof userMeQueryKey>;
export function userMeQueryOptions(options: UserMe["client"]["parameters"] = {}) {
    const queryKey = userMeQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UserMe["data"], UserMe["error"]>({
                method: "get",
                url: `/user/me/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /user/me/
 */
export function useUserMe<TData = UserMe["response"], TQueryData = UserMe["response"], TQueryKey extends QueryKey = UserMeQueryKey>(options: {
    query?: Partial<QueryObserverOptions<UserMe["response"], UserMe["error"], TData, TQueryData, TQueryKey>>;
    client?: UserMe["client"]["parameters"];
} = {}): UseQueryResult<TData, UserMe["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? userMeQueryKey();
    const query = useQuery({
        ...userMeQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, UserMe["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const userMeSuspenseQueryKey = () => [{ url: "/user/me/" }] as const;
export type UserMeSuspenseQueryKey = ReturnType<typeof userMeSuspenseQueryKey>;
export function userMeSuspenseQueryOptions(options: UserMe["client"]["parameters"] = {}) {
    const queryKey = userMeSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UserMe["data"], UserMe["error"]>({
                method: "get",
                url: `/user/me/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @link /user/me/
 */
export function useUserMeSuspense<TData = UserMe["response"], TQueryKey extends QueryKey = UserMeSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<UserMe["response"], UserMe["error"], TData, TQueryKey>>;
    client?: UserMe["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, UserMe["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? userMeSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...userMeSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, UserMe["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}