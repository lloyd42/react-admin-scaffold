import { useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "@/utils/api";
import apiClient from "@/utils/api";
import type {
	CaptchaResult,
	GetCaptchaParams,
	LoginResult,
	PostPhoneLoginParams,
	PostUsernameLoginParams,
} from "./type";

export const usernameLogin = (
	params: PostUsernameLoginParams,
): Promise<LoginResult> => {
	return apiClient.post<LoginResult>({
		url: "/login/username",
		method: "POST",
		data: params,
	});
};

export const phoneLogin = (
	params: PostPhoneLoginParams,
): Promise<LoginResult> => {
	return apiClient.post<LoginResult>({
		url: "/login/phone",
		method: "POST",
		data: params,
	});
};

export const getCaptcha = (
	params: GetCaptchaParams,
): Promise<ApiResponse<CaptchaResult>> => {
	return apiClient.post<ApiResponse<CaptchaResult>>({
		url: "/captcha",
		method: "POST",
		data: params,
	});
};

export const useUsernameLogin = () => {
	return useMutation({
		mutationFn: (params: PostUsernameLoginParams) => usernameLogin(params),
	});
};

export const usePhoneLogin = () => {
	return useMutation({
		mutationFn: (params: PostPhoneLoginParams) => phoneLogin(params),
	});
};

export const useCaptcha = () => {
	return useMutation({
		mutationFn: (params: GetCaptchaParams) => getCaptcha(params),
	});
};
