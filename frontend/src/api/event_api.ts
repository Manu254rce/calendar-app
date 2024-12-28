import api from './axios_config'
import { ICalendarEvent, IComment } from '../types/event_types'

export const getEvents = async (): Promise<ICalendarEvent[]> => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const createEvent = async (event: Omit<ICalendarEvent, '_id'>): Promise<ICalendarEvent> => {
  try {
    const response = await api.post('/events', event);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const updateEvent = async (event: ICalendarEvent): Promise<ICalendarEvent> => {
  try {
    const response = await api.put(`/events/${event._id}`, event);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/events/${id}`);
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const getEventsAsParticipant = async (): Promise<ICalendarEvent[]> => {
  try {
    const response = await api.get('/events/participant');
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const addComment = async (eventId: string, content: string): Promise<IComment> => {
  try {
    const response = await api.post(`/events/${eventId}/comments`, { content });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const getEventComments = async (eventId: string): Promise<IComment[]> => {
  try {
    const response = await api.get(`/events/${eventId}/comments`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw error;
  }
};

export const clearAllEvents = async (): Promise<void> => {
  try {
      await api.delete('/events/clear');
  } catch (error) {
      console.error('Error clearing events:', error);
      throw error;
  }
};