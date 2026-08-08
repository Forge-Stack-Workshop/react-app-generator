import { setupWorker } from "msw/browser";
import { exampleHandlers } from "./handlers/example.handlers";

export const worker = setupWorker(...exampleHandlers);
