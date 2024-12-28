import { useEffect, useRef, useState } from 'react';
import Calendar from './components/calendar/calendar';
import ActionPane from './components/action_pane/action_pane';
import EventModal from './components/newEvent_modal/newEvent_modal';
import dayjs from 'dayjs';
import { ICalendarEvent, IComment } from '../types/event_types';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../api/event_api';
import animationData from '../loaders/CalendarWebLoader.json';
import lottie from 'lottie-web';
import ExpansionPane from './components/expansionPane/expansion_pane';
import { useNavigate } from 'react-router-dom';

export function WebLoader() {
  const animBox = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: animBox.current!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
  }, []);

  return (
    <div
      ref={animBox}
      style={{ width: "100%", height: "100%" }}
      className="fixed z-50 left-0 top-0 bg-white 
      bg-opacity-50 backdrop-blur-2xl"
    />
  );
}

export default function Home() {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [eventTypes, setEventTypes] = useState<string[]>(['News', 'Business', 'Sports', 'Entertainment'])
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setIsLoading(false);
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

      setIsCreatingEvent(true);
      const createdEvent = await createEvent(newEvent);
      setEvents([...events, createdEvent]);
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to add event:', error);
      alert("An unexpected error occurred");
    } finally {
      setIsCreatingEvent(false);
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

  const handleToggleSideBar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <main className='min-w-screen h-screen bg-gradient-to-br from-blue-300 to-fuchsia-400 flex flex-row overflow-y-scroll 
                                          no-scrollbar dark:bg-gradient-to-br dark:from-blue-900 dark:to-fuchsia-900'>
      {isLoading && <WebLoader />}
      <ActionPane
        onToggleSideBar={handleToggleSideBar}
        setCurrentMonth={setCurrentMonth}
        setCalendarView={setCalendarView}
      />
      <section className="absolute top-0 right-0 p-1 flex flex-col md:flex-row h-full w-full md:w-11/12">
        <Calendar
          events={events}
          onDeleteEvent={handleDeleteEvent}
          onEditEvent={handleEditEvent}
          currentMonth={currentMonth}
          setCurrentMonth={setCurrentMonth}
          calendarView={calendarView}
        />
        {isOpen && (
          <EventModal
            onClose={handleToggleSideBar}
            onAddEvent={handleAddEvent}
            onAddEventType={handleAddEventType}
            eventTypes={eventTypes}
          // isCreating={isCreatingEvent}
          />
        )}
        <ExpansionPane />
      </section>

    </main>
  );
}