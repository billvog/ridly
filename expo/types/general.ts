export type LocationPoint = {
  lat: number;
  long: number;
};

export type TSocketResponse =
  | [status: "success", id: string, result: any]
  | [status: "error", id: string, message: string];

export type TSocketResult = {
  command: string;
  payload: any;
};
