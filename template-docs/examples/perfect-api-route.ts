// EXAMPLE — canonical pattern, copy & adapt.
// A typed, validated API route handler.
import { z } from "zod";

const Query = z.object({ id: z.string().uuid() });

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const parsed = Query.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  // TODO: business logic via a service, never inline here.
  return Response.json({ id: parsed.data.id });
}
