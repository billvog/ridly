import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { UserMeRetrieveQueryResponse, UserMeRetrieve403 } from "../types/UserMeRetrieve";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type UserMeRetrieveClient = typeof client<UserMeRetrieveQueryResponse, UserMeRetrieve403, never>;
type UserMeRetrieve = {
    data: UserMeRetrieveQueryResponse;
    error: UserMeRetrieve403;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UserMeRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<UserMeRetrieveClient>[0]>;
        return: Awaited<ReturnType<UserMeRetrieveClient>>;
    };
};
export const userMeRetrieveQueryKey = () => [{ url: "/user/me/" }] as const;
export type UserMeRetrieveQueryKey = ReturnType<typeof userMeRetrieveQueryKey>;
export function userMeRetrieveQueryOptions(options: UserMeRetrieve["client"]["parameters"] = {}) {
    const queryKey = userMeRetrieveQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UserMeRetrieve["data"], UserMeRetrieve["error"]>({
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
export function useUserMeRetrieve<TData = UserMeRetrieve["response"], TQueryData = UserMeRetrieve["response"], TQueryKey extends QueryKey = UserMeRetrieveQueryKey>(options: {
    query?: Partial<QueryObserverOptions<UserMeRetrieve["response"], UserMeRetrieve["error"], TData, TQueryData, TQueryKey>>;
    client?: UserMeRetrieve["client"]["parameters"];
} = {}): UseQueryResult<TData, UserMeRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? userMeRetrieveQueryKey();
    const query = useQuery({
        ...userMeRetrieveQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, UserMeRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const userMeRetrieveSuspenseQueryKey = () => [{ url: "/user/me/" }] as const;
export type UserMeRetrieveSuspenseQueryKey = ReturnType<typeof userMeRetrieveSuspenseQueryKey>;
export function userMeRetrieveSuspenseQueryOptions(options: UserMeRetrieve["client"]["parameters"] = {}) {
    const queryKey = userMeRetrieveSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UserMeRetrieve["data"], UserMeRetrieve["error"]>({
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
export function useUserMeRetrieveSuspense<TData = UserMeRetrieve["response"], TQueryKey extends QueryKey = UserMeRetrieveSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<UserMeRetrieve["response"], UserMeRetrieve["error"], TData, TQueryKey>>;
    client?: UserMeRetrieve["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, UserMeRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? userMeRetrieveSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...userMeRetrieveSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, UserMeRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}