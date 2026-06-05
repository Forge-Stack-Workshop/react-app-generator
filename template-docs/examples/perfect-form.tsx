// EXAMPLE — canonical pattern, copy & adapt.
// A controlled form with schema validation.
import { useState, type ChangeEvent, type FormEvent } from "react";
import { z } from "zod";

const Schema = z.object({ email: z.string().email() });

export function PerfectForm({
  onSubmit,
}: {
  onSubmit: (v: { email: string }) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handle(e: FormEvent) {
    e.preventDefault();
    const r = Schema.safeParse({ email });
    if (!r.success) return setError("Invalid email");
    setError(null);
    onSubmit(r.data);
  }

  return (
    <form onSubmit={handle}>
      <input
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />
      {error && <p role="alert">{error}</p>}
      <button type="submit">Submit</button>
    </form>
  );
}
