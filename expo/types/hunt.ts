import { TEvent } from "@/types/event";

export type THuntEvent = Pick<TEvent, "name">;

export type THunt = {
  id: string;
  event: THuntEvent;
  clue_count: number;
};
