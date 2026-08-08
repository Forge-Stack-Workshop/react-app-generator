import { useForm } from "react-hook-form";
import type { UseFormProps, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

/**
 * `useForm` pre-wired with a Zod schema resolver.
 *
 * Infers the form's value type directly from the schema, so `handleSubmit`
 * callbacks receive a fully typed `z.infer<TSchema>` payload.
 */
export function useZodForm<TSchema extends z.ZodType>(
  schema: TSchema,
  options?: Omit<UseFormProps<z.infer<TSchema>>, "resolver">,
): UseFormReturn<z.infer<TSchema>> {
  return useForm<z.infer<TSchema>>({
    ...options,
    resolver: zodResolver(schema),
  });
}
