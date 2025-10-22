import { axiosUse } from "@/lib/axiosFucn";
import { MutationConfig, queryClient, QueryConfig } from "@/lib/query-client";
import { SkpdFormValues } from "@/lib/validation/master/skpd-validation";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

export type GetSkpdParams = {
    page: number;
    pageSize: number;
    keyword?: string;
}

export async function getSkpds(
    params: GetSkpdParams
): Promise<ResponsesWithTotal<Skpd>> {
    try {
        const res = await axiosUse.get('/api/skpd', {params});
        const resData = await res.data;

        return {
            data: resData.data,
            total: resData.totalItem
        }
    } catch(err){
        throw err;
    }
}

export const getSkpdQueryKey = (params: GetSkpdParams) => ['skpds', params];
export const getSkpdQueryRoot = () => ['skpds'];

const getSkpdsQueryOptions = (params: GetSkpdParams) => {
    return queryOptions({
        queryKey: getSkpdQueryKey(params),
        queryFn: () => getSkpds(params),
        placeholderData: (prevData) => prevData
    });
}

type UseGetSkpdParams = {
    params: GetSkpdParams,
    queryConfig?: QueryConfig<typeof getSkpdsQueryOptions>
};

export const useGetSkpds = (params: UseGetSkpdParams) => {
    return useQuery({
        ...getSkpdsQueryOptions(params.params),
        ...params.queryConfig
    });
}

export async function createSkpd(data: SkpdFormValues): Promise<ResponseDataCommon<Skpd>>{
    try {
        const res = await axiosUse.post('/api/skpd', data);
        const resData = await res.data;

        return {
            data: resData.data,
            message: resData.message
        }
    } catch (err){
        throw err;
    }
}

type UseCreateSkpdParams = {
    mutationConfig?: MutationConfig<typeof createSkpd>;
}

export const useCreateSkpd = (params: UseCreateSkpdParams = {}) => {
    return useMutation({
        mutationFn: createSkpd,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({queryKey: getSkpdQueryRoot()}),
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context)
        }
    })
}

// update skpd
export async function updateSkpd({ id, data }: {id: number, data: SkpdFormValues}): Promise<ResponseDataCommon<Skpd>>{
    try {
        const res = await axiosUse.put(`/api/skpd/${id}`, data);
        const resData = await res.data;

        return {
            data: resData.data,
            message: resData.message
        }
    } catch (err){
        throw err;
    }
}

type UseUpdateSkpdParams = {
    mutationConfig?: MutationConfig<typeof updateSkpd>;
}

export const useUpdateSkdp = (params: UseUpdateSkpdParams = {}) => {
    return useMutation({
        mutationFn: updateSkpd,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({queryKey: getSkpdQueryRoot()}),
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context)
        }
    })
}

// delete skpd

export async function deleteSkpd(id: number): Promise<ResponseDataCommon<boolean>> {
    try {
        const res = await axiosUse.delete(`/api/skpd/${id}`);
        const resData = await res.data;

        return {
            data: resData.data,
            message: resData.message
        }
    } catch (err){
        throw err
    }
}

type UseDeleteSkpdParams = {
    mutationConfig?: MutationConfig<typeof deleteSkpd>;
}

export const useDeleteSkpd = (params: UseDeleteSkpdParams = {}) => {
    return useMutation({
        mutationFn: deleteSkpd,
        ...params.mutationConfig,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: getSkpdQueryRoot() }),
            params.mutationConfig?.onSuccess?.(data, variables, onMutateResult, context)
        }
    })
}