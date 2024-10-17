import React, { useState } from 'react';
import { BsPlus } from 'react-icons/bs';
import dayjs from 'dayjs';

interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    type: string;
    tags: string[];
}

interface ActionPaneProps {
    onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    eventTypes: string[];
    onAddEventType: (newType: string) => void;
}

const ActionPane: React.FC<ActionPaneProps> = ({ onAddEvent, eventTypes, onAddEventType }) => {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [description, setDescription] = useState('');
    const [type, setType] = useState(eventTypes[0]);
    const [tags, setTags] = useState('');
    const [newEventType, setNewEventType] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && date) {
            onAddEvent({ title, date, description, type, tags: tags.split(',').map(tag => tag.trim()) });
            setTitle('');
            setDate(dayjs().format('YYYY-MM-DD'));
            setDescription('');
            setType(eventTypes[0]);
            setTags('');
            setShowForm(false);
        }
    };

    const handleAddNewEventType = () => {
        if (newEventType) {
            onAddEventType(newEventType);
            setType(newEventType);
            setNewEventType('');
        }
    };

    const today = dayjs().format('YYYY-MM-DD');

    return (
        <div className='bg-blue-900 rounded-md p-3 col-span-2 text-white overflow-y-scroll'>
            <button
                className='bg-white p-3 rounded-full mb-4'
                onClick={() => setShowForm(!showForm)}
            >
                <BsPlus className='text-4xl text-blue-900' />
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
            )}
        </div>
    );
};

export default ActionPane;