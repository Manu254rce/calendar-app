import React, { useState } from 'react';
import dayjs from 'dayjs';
import { ICalendarEvent } from '../../../types/event_types';
import { BsX } from 'react-icons/bs';

interface EventModalProps {
  onClose: () => void;
  onAddEvent: (event: Omit<ICalendarEvent, '_id'>) => void;
  eventTypes: string[];
  onAddEventType: (newType: string) => void;
}

const EventModal: React.FC<EventModalProps> = (
  { onClose,
    onAddEvent,
    eventTypes,
    onAddEventType }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [description, setDescription] = useState('');
  const [type, setType] = useState(eventTypes[0]);
  const [tags, setTags] = useState('');
  const [newEventType, setNewEventType] = useState('');
  const today = dayjs().format('YYYY-MM-DD');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date) {
      onAddEvent({
        title,
        date: new Date(date),
        description,
        type,
        tags: tags.split(',').map(tag => tag.trim())
      });
      setTitle('');
      setDate(dayjs().format('YYYY-MM-DD'));
      setDescription('');
      setType(eventTypes[0]);
      setTags('');
    }
  };

  const handleAddNewEventType = () => {
    if (newEventType) {
      onAddEventType(newEventType);
      setType(newEventType);
      setNewEventType('');
    }
  };


  return (
    <div className='fixed top-0 right-0 bg-white bg-opacity-50
                    backdrop-blur-md w-screen h-screen 
                    flex flex-col items-center justify-center'>
      <div className='w-7/12 h-4/5 overflow-y-scroll no-scrollbar p-5 
                    bg-blue-900 shadow-md rounded-md'>
        <div className='flex flex-row justify-between'>
          <h1 className='text-2xl text-white'>Add Event</h1>
          <button onClick={onClose}>
            <BsX className='text-white text-4xl' />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4 w-10/12 mx-auto'>
          <div>
            <label htmlFor="title" className="block mb-1">Event Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 rounded text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block mb-1">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded text-black"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block mb-1">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded text-black"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="date" className="block mb-1">Event Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 rounded text-black"
            >
              {eventTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={newEventType}
              onChange={(e) => setNewEventType(e.target.value)}
              placeholder='New event type'
              className='flex-grow p-2 rounded text-black'
            />
            <button type='button' onClick={handleAddNewEventType} className='bg-white text-blue-900 px-4 py-2 rounded'>
              Add
            </button>
          </div>
          <div>
            <label htmlFor="tags" className="block mb-1">Tags (comma separated)</label>
            <input
              type='text'
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <button type="submit" className="bg-white text-blue-900 px-4 py-2 rounded">
            Add Event
          </button>
        </form>
      </div>
    </div>
  )
}

export default EventModal