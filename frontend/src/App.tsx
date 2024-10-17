import React, { useState } from 'react';
import Calendar from './components/calendar/calendar';
import ActionPane from './components/action_pane/action_pane';
import dayjs from 'dayjs';

interface CalendarEvent {
  id: string;  // Add an id field
  date: string;
  title: string;
  description: string;
  type: string;
  tags: string[];
}

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>(['News', 'Business', 'Sports', 'Entertainment'])

  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const today = dayjs().startOf('day');
    const eventDate = dayjs(newEvent.date);

    try {
      if (eventDate.isBefore(today)) {
      alert("Cannot add events for past dates.");
      return;
    }

    const eventWithId = { ...newEvent, id: Date.now().toString() };
    setEvents([...events, eventWithId]);
    } catch (error) {
      if (error instanceof Error)
      {
        alert(error.message);
      } else {
        alert("An unexpected error occured")
      }
      
    }
  };

  const handleEditEvent = (editedEvent: CalendarEvent) => {
    setEvents(events.map(event =>
      event.id === editedEvent.id ? editedEvent : event
    ))
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
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