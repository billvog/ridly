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

export type THuntSocketCommand = "hunt.cl.current" | "hunt.cl.unlock" | "hunt.loc.check";

export type THuntSocketResult =
  | {
      command: "hunt.cl.current";
      payload: THuntClue;
    }
  | {
      command: "hunt.cl.unlock";
      payload: {
        unlocked: boolean;
        won?: boolean;
      };
    }
  | {
      command: "hunt.loc.check";
      payload:
        | {
            near: false;
          }
        | { near: true; clue_location: LocationPoint };
    };
