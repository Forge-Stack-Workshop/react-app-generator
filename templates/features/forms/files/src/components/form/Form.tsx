import type { ReactNode } from "react";
import { FormProvider } from "react-hook-form";
import type { FieldValues, UseFormReturn } from "react-hook-form";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void | Promise<void>;
  children: ReactNode;
}

/**
 * Typed wrapper around a react-hook-form instance.
 *
 * Renders a native `<form>` bound to `form.handleSubmit(onSubmit)` and
 * exposes the form context via `FormProvider` so nested `Field` components
 * can read `register`/`formState` without prop drilling.
 */
export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}
