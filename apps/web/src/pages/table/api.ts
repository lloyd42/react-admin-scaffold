import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient, { type PaginatedData } from "@/utils/api";
import type { GetTablesParams, Table } from "./type";

export const getTableList = (
	params: GetTablesParams,
): Promise<PaginatedData<Table[]>> => {
	const { current, pageSize, ...filters } = params;
	const apiParams = {
		current,
		pageSize,
		...filters,
	};
	return apiClient.get<PaginatedData<Table[]>>({
		url: "/tables",
		method: "GET",
		params: apiParams,
	});
};

export const getTableById = async (id: number): Promise<Table> => {
	return await apiClient.get({
		url: `/tables/${id}`,
		method: "GET",
	});
};

export const createTable = async (table: Omit<Table, "id">): Promise<Table> => {
	return await apiClient.post({
		url: "/tables",
		method: "POST",
		data: table,
	});
};

export const updateTable = async (table: Table): Promise<Table> => {
	return await apiClient.put({
		url: "/tables",
		method: "PUT",
		data: table,
	});
};

export const deleteTable = async (id: number): Promise<void> => {
	return await apiClient.delete({
		url: "/tables",
		method: "DELETE",
		data: id,
	});
};

// 查询键工厂，方便管理
const tablesKeys = {
	all: ["tables"] as const,
	tables: () => [...tablesKeys.all, "table"] as const,
	table: (filters: string) => [...tablesKeys.tables(), { filters }] as const, // 示例：带过滤器的列表
	details: () => [...tablesKeys.all, "detail"] as const,
	detail: (id: number) => [...tablesKeys.details(), id] as const,
};

export const useGetTables = (params: GetTablesParams) => {
	return useQuery({
		// 查询键包含分页参数，这样分页变化时会自动重新查询
		queryKey: [tablesKeys.tables(), params],
		queryFn: () => getTableList(params),
	});
};

export const useGetTableById = (id: number) => {
	return useQuery({
		queryKey: tablesKeys.detail(id), // 动态查询键
		queryFn: () => getTableById(id),
		enabled: !!id, // 只有当 id 存在时才执行查询
	});
};

export const useCreateTable = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (newTable: Omit<Table, "id">) => createTable(newTable),
		onSuccess: () => {
			// 创建成功后，使文章列表的查询失效，以便自动重新获取最新数据
			queryClient.invalidateQueries({ queryKey: tablesKeys.tables() });
		},
	});
};

export const useUpdateTable = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (updatedTable: Table) => updateTable(updatedTable),
		onSuccess: (data) => {
			// 更新成功后，同时使列表和对应详情的查询失效
			queryClient.invalidateQueries({ queryKey: tablesKeys.tables() });
			queryClient.invalidateQueries({ queryKey: tablesKeys.detail(data.id) });
		},
	});
};

export const useDeleteTable = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => deleteTable(id),
		onSuccess: (_, id) => {
			// 删除成功后
			queryClient.invalidateQueries({ queryKey: tablesKeys.tables() });
			// 也可以乐观地从详情缓存中移除
			queryClient.removeQueries({ queryKey: tablesKeys.detail(id) });
		},
	});
};
