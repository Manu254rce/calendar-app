import dayjs from 'dayjs';
import React, { useState } from 'react';
import { BsPlus } from 'react-icons/bs';

interface CalendarEvent {
  date: string;
  title: string;
}

interface ActionPaneProps {
  onAddEvent: (event: CalendarEvent) => void;
}

const ActionPane: React.FC<ActionPaneProps> = ({ onAddEvent }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date) {
      onAddEvent({ title, date });
      setTitle('');
      setDate(dayjs().format('YYYY-MM-DD'));
      setShowForm(false);
    }
  };

  return (
    <div className='bg-blue-900 rounded-md p-5 text-white'>
      <button 
        className='bg-white p-3 rounded-full mb-4'
        onClick={() => setShowForm(!showForm)}
      >
        <BsPlus className='text-4xl text-blue-900'/>
      </button>
      {showForm && (
        <form onSubmit={handleSubmit} className='space-y-4'>
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
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 rounded text-black"
              required
            />
          </div>
          <button type="submit" className="bg-white text-blue-900 px-4 py-2 rounded">
            Add Event
          </button>
        </form>
      )}
    </div>
  );
};

export default ActionPane;