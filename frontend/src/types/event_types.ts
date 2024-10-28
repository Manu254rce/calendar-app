import { User } from "./user_types";
export interface ICalendarEvent {
  _id: string;
  title: string;
  date: Date;
  description: string;
  type: string;
  members: User['id'][];
  location?: {
    name?: string;
    address?: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  }
  tags: string[];
}