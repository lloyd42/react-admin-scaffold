import axios, { type AxiosRequestConfig } from "axios";

// 统一的后端响应数据结构
export interface ApiResponse<T = unknown> {
	success: boolean;
	msg: string;
	data: T;
}

// 分页数据结构
export type ApiPaginatedResponse<T> = {
	success: boolean;
	msg: string;
	data: {
		list: T;
		total: number;
	};
};

export type PaginatedData<T> = {
	list: T;
	total: number;
};

const axiosInstance = axios.create({
	baseURL:
		import.meta.env.VITE_APP_API_MODE === "mock"
			? "/mock"
			: import.meta.env.VITE_APP_API_BASE_URL,
	timeout: 50000,
	headers: { "Content-Type": "application/json;charset=utf-8" },
	// transformResponse: (data) => data, // 会覆盖axios的自动JSON解析
});

axiosInstance.interceptors.request.use(
	(config) => {
		// 在这里添加 token 等逻辑
		const token = localStorage.getItem("token");
		if (token && config.headers) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
	(response) => {
		const { success, msg, data } = response.data;

		// 如果是文件下载等非 json 类型，直接返回响应体
		if (response.headers["content-type"] !== "application/json") {
			return response.data;
		}

		// 如果请求成功，直接返回 data 部分
		if (success) {
			return data;
		}

		// 如果 success 不为真，则为业务错误
		const error = new Error(msg || "业务错误");
		return Promise.reject(error);
	},
	(error) => {
		const { response, message } = error || {};
		console.error("请求错误:", response?.data.msg || message || "网络请求失败");
		if (response.status === 401) {
			localStorage.removeItem("token");
		}
		return Promise.reject(error);
	},
);

class APIClient {
	get<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "GET" });
	}
	post<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "POST" });
	}
	put<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "PUT" });
	}
	delete<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return this.request<T>({ ...config, method: "DELETE" });
	}
	request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
		return axiosInstance.request<unknown, T>(config);
	}
}

export default new APIClient();
