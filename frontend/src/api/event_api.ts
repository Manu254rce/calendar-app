import api from './axios_config'
import { ICalendarEvent } from '../types/event_types'

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