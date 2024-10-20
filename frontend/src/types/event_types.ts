export interface ICalendarEvent {
  _id: string;
  title: string;
  date: Date;
  description: string;
  type: string;
  tags: string[];
}