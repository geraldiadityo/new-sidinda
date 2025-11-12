import { axiosUse } from "@/lib/axiosFucn";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/query-client";
import { UserFormValues } from "@/lib/validation/master/user-validation";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { getSkpdQueryRoot } from "./skpd";

export type GetUsersParams = {
    page: number;
    pageSize: number;
    keyword?: string;
}

export async function getUsers(
    params: GetUsersParams
): Promise<ResponsesWithTotal<User>> {
    try {
        const res = await axiosUse.get('/api/pengguna/user', {
            params: params
        });
        const resData = await res.data;

        return {
            data: resData.data,
            total: resData.totalItem
        }
    } catch (err){
        throw err;
    }
}

export const getUserQueryKey = (params: GetUsersParams) => ['users', params];
export const getUserQueryRoot = () => ['users'];

const getUserQueryOptions = (params: GetUsersParams) => {
    return queryOptions({
        queryKey: getUserQueryKey(params),
        queryFn: () => getUsers(params),
        placeholderData: (prev) => prev
    });
};


type UseGetUserParams = {
    param: GetUsersParams,
    queryConfig?: QueryConfig<typeof getUserQueryOptions>
};

export const useGetUsers = (params: UseGetUserParams) => {
    return useQuery({
        ...getUserQueryOptions(params.param),
        ...params.queryConfig
    });
}
// create user
export async function createUser(data: UserFormValues): Promise<ResponseDataCommon<User>> {
    try {
        const res = await axiosUse.post('/api/pengguna/user', data);
        const resData = await res.data;

        return {
            data: resData.data,
            message: resData.message
        }
    } catch (err){
        throw err
    }
}

type UseCreateUserParams = {
    mutationConfig?: MutationConfig<typeof createUser>;
}

export const useCreateUser = (params: UseCreateUserParams = {}) => {
    return useMutation({
        mutationFn: createUser,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({queryKey: getSkpdQueryRoot()}),
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context)
        }
    });
}

// remove user
export async function removeUser(id: number): Promise<ResponseDataCommon<boolean>> {
    try {
        const res = await axiosUse.delete(`/api/pengguna/user/${id}`);
        const resData = await res.data;

        return {
            data: resData.data,
            message: resData.message
        }
    } catch (err){
        throw err
    }
}

type UseDeleteUserParams = {
    mutationConfig?: MutationConfig<typeof removeUser>;
}

export const useDeleteUser = (params: UseDeleteUserParams = {}) => {
    return useMutation({
        mutationFn: removeUser,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({queryKey: getSkpdQueryRoot()}),
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context)
        }
    })
}
