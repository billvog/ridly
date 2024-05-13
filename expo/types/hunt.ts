import { TEvent } from "@/types/event";
import { LocationPoint } from "@/types/general";

export type THuntEvent = Pick<TEvent, "name" | "location_name" | "location_coordinates">;

export type THunt = {
  id: string;
  event: THuntEvent;
  clue_count: number;
};

export type THuntClue = {
  id: string;
  riddle: string;
  order: number;
};

export type TCapturedHuntClue = THuntClue & {
  location_point: LocationPoint;
};

export type THuntSocketResponse =
  | {
      type: "loc.check";
      near: false;
    }
  | { type: "loc.check"; near: true; clue_location: LocationPoint }
  | {
      type: "cl.unlock";
      unlocked: boolean;
      won?: boolean;
    }
  | {
      type: "cl.current";
      clue: THuntClue;
    };
