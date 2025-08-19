import { faker } from "@faker-js/faker";
import { delay, HttpResponse, http } from "msw";
import type { Table } from "@/pages/table/type"; // 引入 Table 类型
import type { ApiPaginatedResponse, ApiResponse } from "@/utils/api"; // 引入你的通用响应类型
import {
	createMockTable,
	createMockTableList,
	withAuthorization,
} from "../utils";

// 使用一个内存中的数组来模拟数据库
let tablesDB = createMockTableList(120); // 初始生成 120 条数据

const API_BASE_URL = "/mock";

export const handlers = [
	// 1. Mock 获取表格列表 (GET /tables)
	http.get(`${API_BASE_URL}/tables`, async ({ request }) => {
		const user = withAuthorization(request);

		if (!user) {
			return HttpResponse.json(
				{
					success: false,
					msg: "Unauthorized",
					data: null,
				},
				{ status: 401 },
			);
		}

		const url = new URL(request.url);

		// 1. 解析分页参数
		const current = Number.parseInt(url.searchParams.get("current") || "1", 10);
		const pageSize = Number.parseInt(
			url.searchParams.get("pageSize") || "10",
			10,
		);

		// 2. 解析排序参数
		const sortField = url.searchParams.get("sortField") || "created_at";
		const sortOrder = url.searchParams.get("sortOrder") || "descend";

		// 3. 解析筛选参数
		const title = url.searchParams.get("title") || "";
		const state = url.searchParams.getAll("state[]") || [];
		const startTime = url.searchParams.get("startTime") || "";
		const endTime = url.searchParams.get("endTime") || "";

		// 4. 筛选逻辑
		let filteredData = [...tablesDB];

		// 标题筛选（模糊匹配）
		if (title) {
			filteredData = filteredData.filter((table) =>
				table.title.toLowerCase().includes(title.toLowerCase()),
			);
		}

		// 状态筛选（多选）
		if (state.length > 0) {
			filteredData = filteredData.filter((table) =>
				state.includes(table.state),
			);
		}

		// 时间范围筛选
		if (startTime && endTime) {
			const startDate = new Date(startTime);
			const endDate = new Date(endTime);

			filteredData = filteredData.filter((table) => {
				const createdAt = new Date(table.created_at);
				return createdAt >= startDate && createdAt <= endDate;
			});
		}

		// 5. 排序逻辑
		filteredData.sort((a, b) => {
			const fieldA = a[sortField as keyof Table] as string;
			const fieldB = b[sortField as keyof Table] as string;

			if (sortOrder === "ascend") {
				return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0;
			}
			return fieldA > fieldB ? -1 : fieldA < fieldB ? 1 : 0;
		});

		// 模拟分页
		const total = filteredData.length;
		const start = (current - 1) * pageSize;
		const end = start + pageSize;
		const paginatedData = filteredData.slice(start, end);

		// 模拟网络延迟
		await delay(300);

		return HttpResponse.json<ApiPaginatedResponse<Table[]>>({
			success: true,
			msg: "success",
			data: paginatedData,
			total: total,
		});
	}),

	// 2. Mock 获取单个表格详情 (GET /tables/:id)
	http.get(`${API_BASE_URL}/tables/:id`, async ({ params }) => {
		const { id } = params;
		const table = tablesDB.find((t) => t.id === Number(id));

		await delay(200);

		if (!table) {
			return new HttpResponse(null, { status: 404, statusText: "Not Found" });
		}

		return HttpResponse.json<ApiResponse<Table>>({
			success: true,
			msg: "success",
			data: table,
		});
	}),

	// 3. Mock 创建表格 (POST /tables)
	http.post(`${API_BASE_URL}/tables`, async ({ request }) => {
		const newTableData = (await request.json()) as Omit<Table, "id">;

		// 创建一个完整的新 Table 对象
		const newTable: Table = {
			...createMockTable(), // 用 factory 生成一些随机字段
			...newTableData, // 用请求体中的数据覆盖
			id: faker.number.int({ min: 10001, max: 20000 }), // 分配一个新 ID
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		};

		tablesDB.unshift(newTable); // 将新数据添加到数组开头

		await delay(500);

		return HttpResponse.json<ApiResponse<Table>>(
			{
				success: true,
				msg: "success",
				data: newTable,
			},
			{ status: 201 }, // HTTP 状态码 201 Created
		);
	}),

	// 4. Mock 更新表格 (PUT /tables)
	http.put(`${API_BASE_URL}/tables`, async ({ request }) => {
		const updatedTable = (await request.json()) as Table;
		const index = tablesDB.findIndex((t) => t.id === updatedTable.id);

		await delay(400);

		if (index === -1) {
			return new HttpResponse(null, { status: 404, statusText: "Not Found" });
		}

		// 更新数据库中的数据
		tablesDB[index] = {
			...tablesDB[index],
			...updatedTable,
			updated_at: new Date().toISOString(),
		};

		return HttpResponse.json<ApiResponse<Table>>({
			success: true,
			msg: "success",
			data: tablesDB[index],
		});
	}),

	// 5. Mock 删除表格 (DELETE /tables)
	http.delete(`${API_BASE_URL}/tables`, async ({ request }) => {
		// 假设你的 delete 请求是将 id 放在请求体中
		const id = (await request.json()) as number;
		const initialLength = tablesDB.length;

		tablesDB = tablesDB.filter((t) => t.id !== id);

		await delay(600);

		if (tablesDB.length === initialLength) {
			return new HttpResponse(null, { status: 404, statusText: "Not Found" });
		}

		return HttpResponse.json<ApiResponse>({
			success: true,
			msg: "success",
			data: null,
		});
	}),
];
