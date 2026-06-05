// EXAMPLE — canonical pattern, copy & adapt.
// A page: composition + loading/error states, no data logic inline.
import { useUser } from "./perfect-hook";

export function UserPage({ id }: { id: string }) {
  const { data, isLoading, error } = useUser(id);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p role="alert">Something went wrong.</p>;
  return <h1>{data.id}</h1>;
}
