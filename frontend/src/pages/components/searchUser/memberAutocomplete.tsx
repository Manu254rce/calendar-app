import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, User as UserIcon } from 'lucide-react';
import api from '../../../api/axios_config';
import { User } from '../../../types/user_types';

interface MemberAutocompleteProps {
    onMemberSelect: (member: User) => void;
    placeholder?: string;
}

const MemberAutocomplete: React.FC<MemberAutocompleteProps> = ({
    onMemberSelect,
    placeholder = "Search for a member"
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<User[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

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

    const fetchUsers = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get(`/users/search?query=${query}`);
            setSuggestions(response.data);
            setShowDropdown(true);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputValue.trim()) {
                fetchUsers(inputValue);
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [inputValue, fetchUsers]);

    const handleSelect = (user: User) => {
        onMemberSelect(user);
        setInputValue('');
        setShowDropdown(false);
        setSuggestions([]);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (!e.target.value.trim()) {
            setSuggestions([]);
            setShowDropdown(false);
        }
    };

    return (
        <div className="relative w-full">
            <div className="flex w-full">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onFocus={() => inputValue.trim() && setShowDropdown(true)}
                    placeholder={placeholder}
                    className="flex-grow rounded-l border p-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    type="button"
                    className="rounded-r bg-blue-900 px-4 py-3 text-white transition-all duration-300 hover:bg-gradient-to-l hover:from-blue-800 hover:to-fuchsia-700"
                    aria-label="Search members"
                >
                    <Search className="h-5 w-5" />
                </button>
            </div>

            {showDropdown && (
                <div
                    ref={dropdownRef}
                    className="absolute mt-1 w-full rounded-md border bg-white shadow-lg"
                >
                    <div className="max-h-60 overflow-auto no-scrollbar">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-4 text-gray-500">
                                Loading Users...
                            </div>
                        ) : error ? (
                            <div className="p-4 text-red-500">
                                {error}
                            </div>
                        ) : suggestions.length > 0 ? (
                            suggestions.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleSelect(user)}
                                    className="flex w-full items-start gap-3 px-4 py-3 text-left 
                            hover:bg-gradient-to-r hover:from-blue-800 hover:to-fuchsia-800
                            hover-animation group 
                           focus:bg-blue-100 focus:outline-none"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                        <UserIcon className="h-5 w-5" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-gray-900 group-hover:text-white">
                                            {user.user_name}
                                        </span>
                                        <span className="text-sm text-gray-500 group-hover:text-white">
                                            {user.last_name}, {user.first_name}
                                        </span>
                                    </div>
                                </button>
                            ))
                        ) : inputValue.trim() ? (
                            <div className="p-4 text-center text-gray-500">
                                No members found
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberAutocomplete;