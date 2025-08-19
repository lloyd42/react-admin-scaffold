import { setupWorker } from "msw/browser";
import { handlers as tableHandlers } from "./handlers/table";
import { handlers as userHandlers } from "./handlers/user";

const handlers = [...tableHandlers, ...userHandlers];
export const worker = setupWorker(...handlers);
