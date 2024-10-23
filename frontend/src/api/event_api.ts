import axios from 'axios';
import { ICalendarEvent } from '../types/event_types'

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getEvents = async (): Promise<ICalendarEvent[]> => {
  const response = await api.get('/events');
  return response.data;
};

export const createEvent = async (event: Omit<ICalendarEvent, '_id'>): Promise<ICalendarEvent> => {

  const response = await api.post('/events', event);
  return response.data;
};

export const updateEvent = async (event: ICalendarEvent): Promise<ICalendarEvent> => {

  const response = await api.put(`/events/${event._id}`, event);
  return response.data;
};

export const deleteEvent = async (id: string):  Promise<void> => {
  await api.delete(`/events/${id}`);
};