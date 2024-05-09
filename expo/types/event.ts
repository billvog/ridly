import { TPublicUser } from "@/types/user";
import { TCreator } from "@/types/creator";

export type TEventParticipant = Pick<TPublicUser, "avatar_url">;

export type TEvent = {
  id: string;
  name: string;
  description: string;
  creator: TCreator;
  participants: TEventParticipant[];
  participant_count: number;
  location_name: string;
  happening_at: Date;
  has_joined: boolean;
  created_at: Date;
};
