// EXAMPLE — canonical pattern, copy & adapt.
// A shared zod schema + inferred type.
import { z } from "zod";

export const User = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

export type User = z.infer<typeof User>;
