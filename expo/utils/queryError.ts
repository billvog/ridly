import { DetailedError } from "@/types/gen";
import { AxiosError } from "axios";

type QueryError = DetailedError;

export function handleQueryError(
  error: AxiosError<QueryError>,
  handleError: (error: QueryError, status: number) => void
) {
  const response = error.response;
  if (!response) {
    return;
  }

  const data = response.data;
  const statusCode = response.status;

  handleError(data, statusCode);
}
