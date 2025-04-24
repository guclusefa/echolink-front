export interface Signalement {
  id?: string;
  title?: string;
  description?: string;
  latitude: number;
  longitude: number;
  category_id: number;
  user_id?: string;
  priority_level: string;
  status: string;
  created_at?: Date;
  updated_at?: Date;
  closed_at?: Date;
  categoryName?: string;
  userEmail?: string;
  userName?: string;
  userLastName?: string;
}