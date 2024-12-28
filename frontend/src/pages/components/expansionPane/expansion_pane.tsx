import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BsChat, BsSearch } from 'react-icons/bs'
import { useAuth } from '../../../context/AuthContext';

import { ICalendarEvent, IComment } from '../../../types/event_types';
import api from '../../../api/axios_config';
import { addComment, getEventComments } from '../../../api/event_api';
interface SearchBarProps {
  events: ICalendarEvent[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<ICalendarEvent[]>>
}
// interface ExpansionPaneProps {
//   eventComments: { [eventId: string]: IComment[] };
//   setEventComments: React.Dispatch<React.SetStateAction<{ [eventId: string]: IComment[] }>>;
// }

const ExpansionPane = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ICalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<ICalendarEvent | null>(null);
  const [eventComments, setEventComments] = useState<{ [eventId: string]: IComment[] }>({});

  const fetchComments = async (eventId: string): Promise<IComment[]> => {
    try {
      const comments = await getEventComments(eventId);
      return comments;
    } catch (error) {
      console.error('Failed to fetch comments', error);
      return [];
    }
  };

  const handleAddComment = async (eventId: string, commentText: string) => {
    try {
      const addedComment = await addComment(eventId, commentText);
      setEventComments(prev => ({
        ...prev,
        [eventId]: [addedComment, ...(prev[eventId] || [])]
      }));
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const fetchedUserEvents = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await api.get(`/events?userId=${user?.id}`)
      setEvents(response.data);
      setFilteredEvents(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false);
    }
  }, [user?.id])

  useEffect(() => {
    fetchedUserEvents()
  }, [fetchedUserEvents])

  return (
    <div className="p-3 space-y-6 w-full md:w-1/2 lg:w-1/3 h-full flex flex-col">
      <SearchBar events={events} setFilteredEvents={setFilteredEvents} />
      <div className="flex-1 overflow-y-auto h-64 md:h-80 lg:h-96 no-scrollbar">
      <EventList
        events={filteredEvents}
        isLoading={isLoading}
        error={error}
        setSelectedEvent={setSelectedEvent}
        fetchComments={fetchComments}
        selectedEvent={selectedEvent}
        eventComments={eventComments}
        setEventComments={setEventComments}
        onAddComment={handleAddComment}
      />
      </div>
    </div>
  )
}

const SearchBar: React.FC<SearchBarProps> = ({ events, setFilteredEvents }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTagSuggestions = useCallback(async (query: string) => {
    if (!query.startsWith('#')) return;

    setIsLoading(true);
    setError(null);

    try {
      const searchTerm = query.slice(1).toLowerCase();
      const response = await api.get(`/events/tags?search=${searchTerm}`);
      setSuggestions(Array.isArray(response.data) ? response.data : []);
      setShowDropdown(true);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to fetch tag suggestions');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredEvents(events);
      setShowDropdown(false);
      return;
    }

    try {
      const isTagSearch = query.startsWith('#');
      const searchTerm = isTagSearch ? query.slice(1) : query;

      const response = await api.get('/events/search', {
        params: {
          query: searchTerm,
          searchType: isTagSearch ? 'tag' : 'text'
        }
      });

      setFilteredEvents(response.data);

      if (isTagSearch) {
        await fetchTagSuggestions(query);
      } else {
        setShowDropdown(false);
      }
    } catch (err) {
      console.error('Error searching events:', err);
      setError('Failed to search events');
      setFilteredEvents([]);
    }
  }, [events, setFilteredEvents, fetchTagSuggestions]);

  const handleTagClick = async (tag: string) => {
    setSearchQuery(`#${tag}`);
    try {
      const response = await api.get('/events/search', {
        params: {
          query: tag,
          searchType: 'tag'
        }
      });
      setFilteredEvents(response.data);
    } catch (err) {
      console.error('Error searching by tag:', err);
      setError('Failed to search by tag');
      setFilteredEvents([]);
    }
    setShowDropdown(false);
  };



  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        fetchTagSuggestions(searchQuery);
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchTagSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full">
      <div className="flex w-full">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search (use # to search with tags)"
          className="flex-grow rounded-l border p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="button"
          className="rounded-r bg-blue-900 px-2 py-2 text-white transition-all duration-300 hover:bg-gradient-to-l hover:from-blue-800 hover:to-fuchsia-700"
          aria-label="Search"
        >
          <BsSearch className="h-4 w-4" />
        </button>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute mt-1 w-full rounded-md border bg-white shadow-lg"
        >
          <div className="max-h-60 overflow-auto p-2">
            {isLoading ? (
              <div className="px-4 py-2 text-gray-500 text-xs">
                Loading suggestions...
              </div>
            ) : error ? (
              <div className="px-4 py-2 text-red-500">
                {error}
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map(tag => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="w-full rounded-md px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-100 focus:outline-none"
                >
                  <span className="inline-flex items-center">
                    <span className="mr-2 text-blue-600 text-sm">#</span>
                    {tag}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                No matching tags found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface EventListProps {
  events: ICalendarEvent[];
  isLoading: boolean;
  error: string | null;
  setSelectedEvent: React.Dispatch<React.SetStateAction<ICalendarEvent | null>>;
  fetchComments: (eventId: string) => Promise<IComment[]>;
  selectedEvent: ICalendarEvent | null;
  eventComments: { [eventId: string]: IComment[] };
  setEventComments: React.Dispatch<React.SetStateAction<{ [eventId: string]: IComment[] }>>;
  onAddComment: (eventId: string, commentText: string) => Promise<void>;
}

const EventList: React.FC<EventListProps> = ({
  events, isLoading, error, setSelectedEvent, fetchComments,
  selectedEvent, eventComments, setEventComments, onAddComment }) => {
  const [showComments, setShowComments] = useState<{ [eventId: string]: boolean }>({});
  const [newComment, setNewComment] = useState('');

  const loadComments = async (eventId: string) => {
    try {
      const comments = await fetchComments(eventId);
      setEventComments(prev => ({
        ...prev,
        [eventId]: comments
      }));
    } catch (error) {
      console.error('Failed to load comments', error);
    }
  };

  const submitComment = async () => {
    if (!selectedEvent || !newComment.trim()) return;

    try {
      await onAddComment(selectedEvent._id, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Failed to add comment', error);
    }
  };

  const toggleComments = (event: ICalendarEvent) => {
    setSelectedEvent(event);
    setShowComments(prev => ({
      ...prev,
      [event._id]: !prev[event._id]
    }));

    if (!eventComments[event._id]) {
      loadComments(event._id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading events...</div>
  }

  if (error) {
    return <div className="text-red-800 text-center py-4">{error}</div>
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-4 bg-white rounded">No events found</div>
    )
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div
          key={event._id}
          className="h-60 p-4 bg-white/30 dark:bg-slate-900/30 border  border-white dark:border-black
                                    rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-y-auto no-scrollbar"
        >
          <h3 className="text-md font-bold dark:text-white">{event.title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-xs">{event.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span
                key={tag}
                className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
          <button onClick={() => toggleComments(event)} className='mt-5 font-bold text-xs dark:text-white'>
            {showComments[event._id] ? 'Hide Comments' : 'View Comments'}
          </button>
          {showComments[event._id] && eventComments[event._id] && eventComments[event._id].length > 0 && (
            <div className="mt-4 border-t pt-2">
              <h4 className="text-xs font-semibold mb-2 dark:text-white">Comments:</h4>
              <div className="space-y-2">
                {eventComments[event._id].map(comment => (
                  <div key={comment._id} className="bg-gray-100 p-1 rounded">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-xs">{comment.userName}</span>
                      <span className="text-xs text-fuchsia-900">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-fuchsia-700 text-sm font-bold italic">"{comment.text}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
            <div className="mt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment"
                  className="flex-grow p-1 border rounded-full text-xs"
                />
                <button
                  onClick={submitComment}
                  className="bg-blue-900 hover:bg-gradient-to-br hover:from-blue-800 hover:to-fuchsia-800 
                        text-white font-bold p-2 rounded-full"
                >
                  <BsChat/>
                </button>
              </div>
            </div>
        </div>
      ))}
    </div>
  )
}

export default ExpansionPane