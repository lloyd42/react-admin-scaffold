import { faker } from "@faker-js/faker";
import type { Table } from "@/pages/table/type";
import { DB_USER } from "./assets";

export const fakeAvatars = (count: number) => {
	const result: string[] = [];
	for (let index = 0; index < count; index += 1) {
		result.push(faker.image.avatarGitHub());
	}
	return result;
};

// 用于生成单个 Table 记录的函数
export const createMockTable = (): Table => {
	const id = faker.number.int({ min: 1, max: 100000 });
	const state = faker.helpers.arrayElement(["open", "closed", "processing"]);
	const createdAt = faker.date.past().toISOString();

	return {
		id,
		url: faker.internet.url(),
		number: faker.number.int({ min: 100, max: 999 }),
		title: faker.lorem.sentence({ min: 3, max: 8 }),
		labels: faker.helpers.arrayElements(
			[
				{ name: "bug", color: "red" },
				{ name: "feature", color: "blue" },
				{ name: "documentation", color: "green" },
				{ name: "enhancement", color: "purple" },
			],
			faker.number.int({ min: 1, max: 3 }),
		),
		state,
		comments: faker.number.int({ min: 0, max: 100 }),
		created_at: createdAt,
		updated_at: faker.date
			.between({ from: createdAt, to: new Date() })
			.toISOString(),
		// 只有当 state 是 'closed' 时才有关闭时间
		closed_at:
			state === "closed" ? faker.date.recent().toISOString() : undefined,
	};
};

// 用于生成指定数量的 Table 列表
export const createMockTableList = (count: number): Table[] => {
	return Array.from({ length: count }, createMockTable);
};

export const withAuthorization = (request: Request) => {
	if (!request.headers.get("authorization")) {
		console.error("Token loss.");
		sessionStorage.clear();
		return;
	}

	const code = request.headers.get("authorization")?.split(" ")[1];

	const username = code && sessionStorage.getItem(code);

	const user = DB_USER.find((item) => item.username === username);

	if (!user) {
		console.error("User does not exist.");
		sessionStorage.clear();
		return;
	}

	return user;
};
