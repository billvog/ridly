import { TEvent } from "@/types/event";

export type THuntEvent = Pick<
  TEvent,
  "name" | "location_name" | "location_coordinates"
>;

export type THunt = {
  id: string;
  event: THuntEvent;
  clue_count: number;
};
