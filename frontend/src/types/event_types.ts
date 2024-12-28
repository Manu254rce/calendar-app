// import { User } from "./user_types";
export interface ICalendarEvent {
  _id: string;
  title: string;
  date: Date;
  description: string;
  type: string;
  members: string[];
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

export interface IComment {
  _id?: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: Date;
  eventId: string;
}