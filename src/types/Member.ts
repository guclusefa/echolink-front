export interface Member {
  _id?: string;
  email?: string;
  name: string;
  lastName: string;
  password?: string;
  longitude?: number;
  latitude?: number;
  created_at?: Date;
  is_verified?: boolean;
  verification_token?: string;
}
