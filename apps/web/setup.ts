import { afterAll, afterEach, beforeAll } from "vitest";
import { worker } from "./src/mocks/node";

beforeAll(() => {
	worker.listen();
});

afterEach(() => {
	worker.resetHandlers();
});

afterAll(() => {
	worker.close();
});
