import { TPublicUser } from "@/types/user";
import { TCreator } from "@/types/creator";

export type TEvent = {
  id: string;
  name: string;
  description: string;
  creator: TCreator;
  participants: TPublicUser[];
  participant_count: number;
  location: string;
  happening_at: Date;
  has_joined: boolean;
  created_at: Date;
};
