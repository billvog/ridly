import { TSocketError } from "@/types/socket";

export function socketErrorToMessage(error: TSocketError): string {
  var ret = "";
  switch (error) {
    case "validation_error":
      ret = "Validation error";
      break;
    case "clue_404":
      ret = "Clue not found";
      break;
    case "unlock_failed":
      ret = "Unlock failed";
      break;
  }

  return ret;
}
