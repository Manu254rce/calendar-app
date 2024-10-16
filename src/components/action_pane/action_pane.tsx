import React, { useState } from 'react'
import { BsPlus } from 'react-icons/bs'

interface Event {
    date: string;
    title: string;
    // description: string;
}

interface ActionPaneProps {
    onAddEvent: (event: Event) => void;
}

const ActionPane: React.FC<ActionPaneProps> = ({ onAddEvent }) => {
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');
    // const [description, setDesc] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (title && date) {
            onAddEvent({ title, date });
            setTitle('');
            setDate('');
            setShowForm(false);
        }
    }
    return (
        <div className='bg-blue-900 rounded-md p-5 '>
            <button className='bg-white p-3 rounded-full'>
                <BsPlus onClick={() => setShowForm(!showForm)} className='text-4xl text-blue-900' />
            </button>
            {showForm && (
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label htmlFor='title' className='block mb-1'>Event Title</label>
                        <input
                            type='text'
                            id='title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className='w-full p-2 rounded-md text-blue-900'
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor='date' className='block mb-1'>Date</label>
                        <input
                            type='date'
                            id='date'
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className='w-full p-2 rounded-md text-blue-900'
                            required
                        />
                    </div>
                    <button type='submit' className='bg-white text-blue-900 px-4 py-2 rounded-md'>
                        Add Event
                    </button>
                </form>
            )}
        </div>
    )
};

export default ActionPane