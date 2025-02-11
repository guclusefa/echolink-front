export interface Signalement {
  id?: string;
  userId?: string;
  catId: number;
  description: string;
  priorityLevel: number;
  longitude: number;
  latitude: number;
  created_at?: string;
  closed_at?: string;
}