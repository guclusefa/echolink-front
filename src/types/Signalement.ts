export interface Signalement {
  id: number;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  category_id: number;
  categoryName: string;
  priority_level: string;
  user_id: number;
  userName: string;
  userLastName: string;
  created_at: string;
  closed_at?: string;
}