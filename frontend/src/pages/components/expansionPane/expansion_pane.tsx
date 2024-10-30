import React, { useCallback, useEffect, useRef, useState } from 'react'
import { BsSearch } from 'react-icons/bs'
import { useAuth } from '../../../context/AuthContext';
import { User } from '../../../types/user_types'
import { ICalendarEvent } from '../../../types/event_types';
import api from '../../../api/axios_config';
import { WebLoader } from '../../home';

interface WelcomeUserProps {
  user: User;
}

interface SearchBarProps {
  events: ICalendarEvent[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<ICalendarEvent[]>>
}

const ExpansionPane = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<ICalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<ICalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="col-span-3 p-5 space-y-6 h-screen">
      {user ? <WelcomeUser user={user} /> : <div> Loading User ...</div>}
      <SearchBar events={events} setFilteredEvents={setFilteredEvents} />
      <EventList
        events={filteredEvents}
        isLoading={isLoading}
        error={error}
      />
    </div>
  )
}

const WelcomeUser: React.FC<WelcomeUserProps> = React.memo(({ user }) => {
  console.log('Weocome User props: ', user);
  if (!user) {
    return (
      <div className="col-span-3 p-5 flex justify-center items-center">
        <WebLoader />
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-garamond font-bold">
        Hello, {user.user_name}
      </h1>
      <p className="text-lg font-bold text-gray-600">
        {user.email}
      </p>
    </div>
  )
})

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
          className="flex-grow rounded-l border p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          className="rounded-r bg-blue-900 px-4 py-3 text-white transition-all duration-300 hover:bg-gradient-to-l hover:from-blue-800 hover:to-fuchsia-700"
          aria-label="Search"
        >
          <BsSearch className="h-5 w-5" />
        </button>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute mt-1 w-full rounded-md border bg-white shadow-lg"
        >
          <div className="max-h-60 overflow-auto p-2">
            {isLoading ? (
              <div className="px-4 py-2 text-gray-500">
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
                    <span className="mr-2 text-blue-600">#</span>
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
}

const EventList: React.FC<EventListProps> = ({ events, isLoading, error }) => {
  if (isLoading) {
    return <div className="text-center py-4">Loading events...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>
  }

  if (events.length === 0) {
    return <div className="text-center py-4 bg-white rounded">No events found</div>
  }

  return (
    <div className="h-3/4 space-y-4 overflow-y-scroll no-scrollbar">
      {events.map(event => (
        <div
          key={event._id}
          className="h-60 p-4 bg-white/50 border rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-y-auto no-scrollbar"
        >
          <h3 className="text-xl font-bold">{event.title}</h3>
          <p className="text-gray-600 mt-2">{event.description}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {event.tags.map(tag => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ExpansionPane