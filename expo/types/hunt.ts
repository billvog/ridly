import { HuntClue } from "@/types/gen";
import { LocationPoint } from "@/types/general";

export type CapturedHuntClue = HuntClue & {
  location_point: LocationPoint;
};

export type HuntSocketCommand = "hunt.cl.current" | "hunt.cl.unlock" | "hunt.loc.check";

export type HuntSocketResult =
  | {
      command: "hunt.cl.current";
      payload: HuntClue;
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
