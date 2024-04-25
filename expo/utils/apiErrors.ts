import { UseFormSetError } from "react-hook-form";
import { APIResponse } from "./api";

export const setFormErrors = (
  response: APIResponse,
  setErrorFn: UseFormSetError<any>
) => {
  Object.keys(response.data).map((key) => {
    setErrorFn(key as any, {
      message: response.data[key][0],
    });
  });
};
