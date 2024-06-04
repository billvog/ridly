import client from "@kubb/swagger-client/client";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import type { UserTestTokenRetrieveQueryResponse, UserTestTokenRetrieve404 } from "../types/UserTestTokenRetrieve";
import type { QueryObserverOptions, UseQueryResult, QueryKey, UseSuspenseQueryOptions, UseSuspenseQueryResult } from "@tanstack/react-query";

 type UserTestTokenRetrieveClient = typeof client<UserTestTokenRetrieveQueryResponse, UserTestTokenRetrieve404, never>;
type UserTestTokenRetrieve = {
    data: UserTestTokenRetrieveQueryResponse;
    error: UserTestTokenRetrieve404;
    request: never;
    pathParams: never;
    queryParams: never;
    headerParams: never;
    response: UserTestTokenRetrieveQueryResponse;
    client: {
        parameters: Partial<Parameters<UserTestTokenRetrieveClient>[0]>;
        return: Awaited<ReturnType<UserTestTokenRetrieveClient>>;
    };
};
export const userTestTokenRetrieveQueryKey = () => [{ url: "/user/test-token/" }] as const;
export type UserTestTokenRetrieveQueryKey = ReturnType<typeof userTestTokenRetrieveQueryKey>;
export function userTestTokenRetrieveQueryOptions(options: UserTestTokenRetrieve["client"]["parameters"] = {}) {
    const queryKey = userTestTokenRetrieveQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UserTestTokenRetrieve["data"], UserTestTokenRetrieve["error"]>({
                method: "get",
                url: `/user/test-token/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @description Test endpoint to get an access token for the first user in the database used for WebSockets. Only for testing!
 * @link /user/test-token/
 */
export function useUserTestTokenRetrieve<TData = UserTestTokenRetrieve["response"], TQueryData = UserTestTokenRetrieve["response"], TQueryKey extends QueryKey = UserTestTokenRetrieveQueryKey>(options: {
    query?: Partial<QueryObserverOptions<UserTestTokenRetrieve["response"], UserTestTokenRetrieve["error"], TData, TQueryData, TQueryKey>>;
    client?: UserTestTokenRetrieve["client"]["parameters"];
} = {}): UseQueryResult<TData, UserTestTokenRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? userTestTokenRetrieveQueryKey();
    const query = useQuery({
        ...userTestTokenRetrieveQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseQueryResult<TData, UserTestTokenRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}
export const userTestTokenRetrieveSuspenseQueryKey = () => [{ url: "/user/test-token/" }] as const;
export type UserTestTokenRetrieveSuspenseQueryKey = ReturnType<typeof userTestTokenRetrieveSuspenseQueryKey>;
export function userTestTokenRetrieveSuspenseQueryOptions(options: UserTestTokenRetrieve["client"]["parameters"] = {}) {
    const queryKey = userTestTokenRetrieveSuspenseQueryKey();
    return queryOptions({
        queryKey,
        queryFn: async () => {
            const res = await client<UserTestTokenRetrieve["data"], UserTestTokenRetrieve["error"]>({
                method: "get",
                url: `/user/test-token/`,
                ...options
            });
            return res.data;
        },
    });
}
/**
 * @description Test endpoint to get an access token for the first user in the database used for WebSockets. Only for testing!
 * @link /user/test-token/
 */
export function useUserTestTokenRetrieveSuspense<TData = UserTestTokenRetrieve["response"], TQueryKey extends QueryKey = UserTestTokenRetrieveSuspenseQueryKey>(options: {
    query?: Partial<UseSuspenseQueryOptions<UserTestTokenRetrieve["response"], UserTestTokenRetrieve["error"], TData, TQueryKey>>;
    client?: UserTestTokenRetrieve["client"]["parameters"];
} = {}): UseSuspenseQueryResult<TData, UserTestTokenRetrieve["error"]> & {
    queryKey: TQueryKey;
} {
    const { query: queryOptions, client: clientOptions = {} } = options ?? {};
    const queryKey = queryOptions?.queryKey ?? userTestTokenRetrieveSuspenseQueryKey();
    const query = useSuspenseQuery({
        ...userTestTokenRetrieveSuspenseQueryOptions(clientOptions) as unknown as QueryObserverOptions,
        queryKey,
        ...queryOptions as unknown as Omit<QueryObserverOptions, "queryKey">
    }) as UseSuspenseQueryResult<TData, UserTestTokenRetrieve["error"]> & {
        queryKey: TQueryKey;
    };
    query.queryKey = queryKey as TQueryKey;
    return query;
}