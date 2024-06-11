import { DetailedErrorResponse, ValidationError } from "@/types/gen";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

export function isValidationError(
  error: ValidationError | DetailedErrorResponse
): error is ValidationError {
  return (error as ValidationError).errors !== undefined;
}

export function handleMutationError(
  error: AxiosError<ValidationError | DetailedErrorResponse>,
  handleValidationError: (error: ValidationError) => void
) {
  function showErrorToast(message: string) {
    Toast.show({
      type: "error",
      text1: "Oops!",
      text2: message,
    });
  }

  const data = error.response?.data || null;

  if (data && isValidationError(data)) {
    handleValidationError(data);
    return;
  }

  showErrorToast(data?.detail || "An error occurred, please try again.");
}
