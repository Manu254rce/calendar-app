import React, { useState } from 'react';
import dayjs from 'dayjs';
import { User } from '../../../types/user_types'
import { ICalendarEvent } from '../../../types/event_types';
import { BsX } from 'react-icons/bs';
import MemberAutocomplete from '../searchUser/memberAutocomplete';

interface EventModalProps {
  onClose: () => void;
  onAddEvent: (event: Omit<ICalendarEvent, '_id'>) => void;
  eventTypes: string[];
  onAddEventType: (newType: string) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  onClose,
  onAddEvent,
  eventTypes,
  onAddEventType
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [description, setDescription] = useState('');
  const [type, setType] = useState(eventTypes[0]);
  const [members, setMembers] = useState<User[]>([]);
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [tags, setTags] = useState('');
  const [newEventType, setNewEventType] = useState('');
  const today = dayjs().format('YYYY-MM-DD');

  const handleAddMember = (member: User) => {
    setMembers((prevMembers) => [...prevMembers, member])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && date) {
      onAddEvent({
        title,
        date: new Date(date),
        description,
        type,
        members: members.map((m) => m.id),
        location: { name: locationName, address: locationAddress, },
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
    <div className='z-50 fixed top-0 right-0 bg-white bg-opacity-50
                    backdrop-blur-md w-screen h-screen
                    flex flex-col items-center justify-center'>
      <div className='w-4/5 max-w-md h-4/5 overflow-y-auto overflow-x-hidden no-scrollbar p-5 
                    bg-gradient-to-br from-blue-800 to-fuchsia-800 shadow-md rounded-md'>
        <div className='flex flex-row justify-between'>
          <h1 className='text-xl md:text-2xl font-extrabold px-7 md:px-16 my-2 text-white'>Add Event</h1>
          <button onClick={onClose}>
            <BsX className='text-white text-2xl md:text-4xl' />
          </button>
        </div>
        <hr className='border-white w-4/5 mx-auto my-7' />
        <form onSubmit={handleSubmit} className='space-y-4 w-8/12 mx-auto'>
          <div>
            <label htmlFor="title" className="block mb-1 text-white text-sm md:text-md font-bold">Event Title</label>
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
            <label htmlFor="date" className="block mb-1 text-white text-sm md:text-md font-bold">Date</label>
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
            <label htmlFor="description" className="block mb-1 text-white text-sm md:text-md font-bold">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded text-black"
              rows={3}
            />
          </div>
          <div>
            <label htmlFor="type" className="block mb-1 text-white text-sm md:text-md font-bold">Event Type</label>
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
              className='flex-grow p-2 w-1/2 rounded text-black'
            />
            <button type='button' onClick={handleAddNewEventType} className='bg-white text-blue-900 px-4 py-2 rounded'>
              Add
            </button>
          </div>
          <div>
            <label htmlFor="members" className="block mb-1 text-white text-sm md:text-md font-bold">Members</label>
            <MemberAutocomplete onMemberSelect={handleAddMember} />
            {members.length > 0 && (
              <ul className='w-auto h-auto flex flex-col sm:flex-row flex-wrap space-x-1 space-y-1'>
                {members.map((member) => (
                  <li key={member.id} className='bg-white px-4 rounded-full shadow-md flex flex-row flex-wrap items-center w-auto'>
                    <h1 className='text-black text-sm grow font-bold italic'>{member.user_name}</h1>
                    <BsX
                      className="ml-2 text-red-500 text-xs cursor-pointer"
                      onClick={() => setMembers((prevMembers) => prevMembers.filter((m) => m.id !== member.id))} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <label htmlFor="locationName" className="block mb-1 text-white text-sm md:text-md font-bold">Location Name</label>
            <input
              type="text"
              id="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div>
            <label htmlFor="locationAddress" className="block mb-1 text-white text-sm md:text-md font-bold">Location Address</label>
            <input
              type="text"
              id="locationAddress"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block mb-1 text-white text-sm md:text-md font-bold">Tags (comma separated)</label>
            <input
              type='text'
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
          </div>
          <button type="submit" className="bg-slate-900 text-white px-4 py-2 rounded font-bold text-sm md:text-md">
            Add Event
          </button>
        </form>
      </div>
    </div>
  )
}

export default EventModal