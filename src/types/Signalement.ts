export interface Signalement {
  id?: string;
  catId: number;
  description: string;
  priorityLevel: number;
  longitude: number;
  latitude: number;
}