export type TSocketResponse =
  | [status: "success", id: string, result: any]
  | [status: "error", id: string, { code: TSocketError }];

export type TSocketResult = {
  command: string;
  payload: any;
};

export type TSocketError = "validation_error" | "clue_404" | "unlock_failed";
