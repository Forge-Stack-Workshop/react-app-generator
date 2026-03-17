import { setupWorker } from "msw/browser";
import { territoriesHandlers } from "./handlers/territories.handlers";
import { usersKpiHandlers } from "./handlers/users.handlers";
import { shuttlesHandlers } from "./handlers/shuttles.handlers"

export const worker = setupWorker(
  ...territoriesHandlers,
  ...usersKpiHandlers,
  ...shuttlesHandlers,
);
