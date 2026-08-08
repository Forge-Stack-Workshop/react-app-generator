import { useFormContext } from "react-hook-form";

interface FieldProps {
  name: string;
  label: string;
  type?: string;
}

/**
 * Labelled input bound to the nearest `Form`'s react-hook-form context.
 *
 * Reads `register`/`formState` via `useFormContext`, so it must be rendered
 * inside a `Form` (which provides that context through `FormProvider`).
 */
export function Field({ name, label, type = "text" }: FieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message;

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} type={type} {...register(name)} />
      {typeof error === "string" && <span role="alert">{error}</span>}
    </div>
  );
}
