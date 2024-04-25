export type TUser = {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  created_at: string;
};

export type TPublicUser = Pick<
  TUser,
  "id" | "first_name" | "last_name" | "username"
>;
