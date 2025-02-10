export interface Job {
  _id?: string;
  name: string;
  description: string;
  priority: number;
  startDate: string;
  endDate: string;
  status: string;
  duration: number;
  __v?: number;
  assignedTo?: string[];
}
