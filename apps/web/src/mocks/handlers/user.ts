import { faker } from "@faker-js/faker";
import { delay, HttpResponse, http } from "msw";
import { convertFlatToTree } from "@/utils/tree";
import {
	DB_MENU,
	DB_PERMISSION,
	DB_ROLE,
	DB_ROLE_PERMISSION,
	DB_USER,
	DB_USER_ROLE,
} from "../assets";
import { withAuthorization } from "../utils";

const API_BASE_URL = "/mock";

export const handlers = [
	http.post(`${API_BASE_URL}/login/username`, async ({ request }) => {
		const { username, password } = (await request.json()) as Record<
			string,
			string
		>;

		const user = DB_USER.find((item) => item.username === username);

		if (!user || user.password !== password) {
			return HttpResponse.json({
				success: false,
				msg: "Incorrect username or password.",
				data: null,
			});
		}

		const token = faker.string.uuid();
		sessionStorage.setItem(token, user.username);

		return HttpResponse.json({
			success: true,
			message: "success",
			data: {
				token: token,
			},
		});
	}),
	http.post(`${API_BASE_URL}/login/phone`, async ({ request }) => {
		const { phone, captcha } = (await request.json()) as Record<string, string>;

		const user = DB_USER.find((item) => item.phone === phone);

		const code = sessionStorage.getItem(phone);
		if (!user || code !== captcha) {
			return HttpResponse.json({
				success: false,
				msg: "Incorrect phone or captcha.",
				data: null,
			});
		}

		const token = faker.string.uuid();
		sessionStorage.setItem(token, user.username);

		await delay(300);

		return HttpResponse.json({
			success: true,
			message: "success",
			data: {
				token: token,
			},
		});
	}),
	http.post(`${API_BASE_URL}/captcha`, async ({ request }) => {
		const { phone } = (await request.json()) as Record<string, string>;

		if (!phone) {
			return HttpResponse.json({
				success: false,
				msg: "Incorrect phone.",
				data: null,
			});
		}

		const captcha = faker.number.int(6);
		sessionStorage.setItem(phone, captcha.toString());
		setTimeout(() => {
			sessionStorage.removeItem("captcha");
		}, 60 * 1000);

		await delay(300);

		return HttpResponse.json({
			success: true,
			message: "success",
			data: {
				code: captcha,
			},
		});
	}),
	http.get(`${API_BASE_URL}/user/profile`, async ({ request }) => {
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

		// delete password
		const { password: _, ...userWithoutPassword } = user;

		// user role
		const roles = DB_USER_ROLE.filter((item) => item.userId === user.id).map(
			(item) => DB_ROLE.find((role) => role.id === item.roleId),
		);

		// user permissions
		const permissions = DB_ROLE_PERMISSION.filter((item) =>
			roles.some((role) => role?.id === item.roleId),
		).map((item) =>
			DB_PERMISSION.find((permission) => permission.id === item.permissionId),
		);

		const menu = convertFlatToTree(DB_MENU);

		await delay(300);

		return HttpResponse.json({
			success: true,
			msg: "success",
			data: Array.from({ length: 10 }).map(() => ({
				avatar: faker.image.avatarGitHub(),
				address: faker.location.streetAddress(),
				userWithoutPassword,
				roles,
				permissions,
				menu,
			})),
		});
	}),
];
