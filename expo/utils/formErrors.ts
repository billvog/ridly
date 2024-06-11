import { UseFormSetError } from "react-hook-form";

export function setFormErrors<TErrors extends object = any>(
  errors: TErrors,
  setErrorFn: UseFormSetError<any>
) {
  Object.keys(errors).map((key) => {
    setErrorFn(key, {
      message: (errors[key as keyof TErrors] as string[])[0],
    });
  });
}
