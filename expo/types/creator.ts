import { TPublicUser } from "@/types/user";

export type TCreator<UserType = TPublicUser> = {
  id: string;
  user: UserType;
};
