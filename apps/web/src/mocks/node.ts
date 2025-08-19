import { setupServer } from "msw/node";
import { handlers as tableHandlers } from "./handlers/table";
import { handlers as userHandlers } from "./handlers/user";

const handlers = [...tableHandlers, ...userHandlers];
export const worker = setupServer(...handlers);
