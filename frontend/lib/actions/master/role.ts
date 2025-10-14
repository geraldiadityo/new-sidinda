import { axiosUse } from "@/lib/axiosFucn";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/query-client";
import { RoleFormValues } from "@/lib/validation/master/role-validation";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

// get all roles
export async function getRoles(): Promise<ResponsesDataCommon<Role>> {
    try {
        const res = await axiosUse.get('/api/pengguna/role');
        const resData = res.data;
        
        return {
            data: resData.data
        }
    } catch (err){
        throw err
    }
}

export const getRolesQueryKey = () => ['roles'];

const getRolesQueryOptions = () => {
    return queryOptions({
        queryKey: getRolesQueryKey(),
        queryFn: getRoles,
    })
}

type UseGetRolesParams = {
    queryConfig?: QueryConfig<typeof getRolesQueryOptions>;
}

export const useGetRoles = (params: UseGetRolesParams = {}) => {
    return useQuery({
        ...getRolesQueryOptions(),
        ...params.queryConfig,
    })
}

// create role
export async function createRole(data: RoleFormValues): Promise<ResponseDataCommon<Role>> {
    try {
        const res = await axiosUse.post('/api/pengguna/role', data);
        const resData = await res.data;

        return {
            data: resData.data,
            message: resData.message
        }
    } catch (err){
        throw err
    }
}

type UseCreateRoleParams = {
    mutationConfig?: MutationConfig<typeof createRole>;
}

export const useCreateRole = (params: UseCreateRoleParams = {}) => {
    return useMutation({
        mutationFn: createRole,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            // default behavior
            queryClient.invalidateQueries({ queryKey: getRolesQueryKey() })
            // customize success
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context)
        }
    })
}