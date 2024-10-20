import React, { useEffect, useState } from 'react';
import Calendar from './components/calendar/calendar';
import ActionPane from './components/action_pane/action_pane';
import dayjs from 'dayjs';
import { ICalendarEvent } from './types/event_types';
import { getEvents, createEvent, updateEvent, deleteEvent } from './api/event_api';

function App() {
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>(['News', 'Business', 'Sports', 'Entertainment'])

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleAddEvent = async (newEvent: Omit<ICalendarEvent, '_id'>) => {
    const today = dayjs().startOf('day');
    const eventDate = dayjs(newEvent.date);

    try {
      if (eventDate.isBefore(today)) {
        alert("Cannot add events for past dates.");
        return;
      }

      const createdEvent = await createEvent(newEvent);
      setEvents([...events, createdEvent]);
    } catch (error) {
      console.error('Failed to add event:', error);
      alert("An unexpected error occurred");
    }
  };

  const handleEditEvent = async (editedEvent: ICalendarEvent) => {
    try {
      const updatedEvent = await updateEvent(editedEvent);
      setEvents(prevEvents => prevEvents.map(event =>
        event._id === updatedEvent._id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Failed to update event:', error);
      alert("An unexpected error occurred");
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
      setEvents(prevEvents => prevEvents.filter(event => event._id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert("An unexpected error occurred");
    }
  };

  const handleAddEventType = (newType: string) => {
    if (!eventTypes.includes(newType)) {
      setEventTypes([...eventTypes, newType]);
    }
  };

  return (
    <main className='w-screen h-screen p-4 grid grid-cols-7 gap-4 bg-gradient-to-br from-blue-300 to-white'>
      <ActionPane onAddEvent={handleAddEvent} eventTypes={eventTypes} onAddEventType={handleAddEventType} />
      <Calendar events={events} onDeleteEvent={handleDeleteEvent} onEditEvent={handleEditEvent}/>
    </main>
  );
}

export default App;