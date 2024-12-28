import React, { useEffect, useState } from 'react';
import api from '../api/axios_config';
import { User } from '../types/user_types';
import { useNavigate } from 'react-router-dom';
import { WebLoader } from './home';
import { HomeIcon, LockKeyholeIcon, Trash2Icon, UserCircle } from 'lucide-react';
import { BsSearch } from 'react-icons/bs';

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query) {
            try {
                const response = await api.get(`/admin/users/search?query=${query}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error searching users: ', error);
            }
        } else {
            setSearchResults([])
        }
    }

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.isAdmin) {
            setIsAdmin(true);
        } else {
            navigate('/home');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        if (isAdmin) {
            fetchUsers();
        }
    }, [isAdmin]);

    const handleDeleteUser = async (id: string) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this user?");
        if (!confirmDelete) return;

        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(user => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleUserSelect = async (user: User) => {
        try {
            await api.get(`/admin/users/${user._id}/details`);
            setSelectedUser({
                ...user,
                // events: userDetailsResponse.data.events,
                // comments: userDetailsResponse.data.comments
            });
        } catch (error) {
            console.error('Error fetching user details: ', error)
        }
    }; 

    const handleToggleAdmin = async (id: string) => {
        try {
            const userToUpdate = users.find(user => user._id === id);
            if (userToUpdate) {
                const updatedUser = { ...userToUpdate, isAdmin: !userToUpdate.isAdmin };
                await api.put(`/admin/users/${id}`, updatedUser);
                setUsers(users.map(user => (user._id === id ? updatedUser : user)));
            }
        } catch (error) {
            console.error('Error toggling admin status:', error);
        }
    };

    if (loading) return <div><WebLoader /></div>;

    return (
        <main className='absolute top-0 left-0 w-screen h-screen 
                                            bg-gradient-to-br from-blue-400 to-fuchsia-400 
                                        dark:from-blue-900 dark:to-fuchsia-800'>
            <NavBar user={currentUser} navigate={navigate} />
            <section className='p-4 flex flex-col md:flex-row space-y-2 md:space-x-2'>
                <div className="flex flex-col w-full md:w-2/3 max-h-[75vh] p-4 bg-white/50 backdrop-blur-md shadow-md rounded-md">
                    <h2 className='font-garamond text-base font-bold'>Manage Users</h2>
                    <hr className='border-gray-800 w-3/4 my-2' />
                    <SearchBar searchQuery={searchQuery} onSearch={handleSearch} />
                    <ul className='my-3 flex flex-col space-y-3 overflow-y-auto no-scrollbar w-full'>
                        {searchResults.length > 0 ? searchResults.map(user => (
                            <UserListItem 
                                        key={user._id} 
                                        user={user} 
                                        onToggleAdmin={handleToggleAdmin} 
                                        onDeleteUser={handleDeleteUser} 
                                        isCurrentUser={user._id === currentUser._id} 
                                        onUserSelect={handleUserSelect}/>
                        )) : users.map(user => (
                            <UserListItem 
                                         key={user._id} 
                                         user={user} 
                                         onToggleAdmin={handleToggleAdmin} 
                                         onDeleteUser={handleDeleteUser} 
                                         isCurrentUser={user._id === currentUser._id} 
                                         onUserSelect={handleUserSelect}/>
                        ))}
                    </ul>
                </div>
                <div className="flex flex-col w-full md:w-1/3 max-h-[75vh] p-4 bg-white/50 backdrop-blur-md shadow-md rounded-md">
                    <h2 className='font-garamond text-base font-bold'>User Details</h2>
                    <hr className='border-gray-800 w-3/4 my-2' />
                        <UserDetailsPanel user={selectedUser} />
                </div>
            </section>
        </main>
    );
};

interface UserListItemProps {
    user: User;
    onToggleAdmin: (id: string) => void;
    onDeleteUser: (id: string) => void;
    isCurrentUser: boolean;
    onUserSelect: (user: User) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, onToggleAdmin, onDeleteUser, isCurrentUser, onUserSelect }) => {
    return (
        <li className='bg-white rounded-md min-h-1/3 p-3 w-full flex flex-row justify-between items-center'>
            <button className='flex flex-col' onClick={() => onUserSelect(user)}>
                <p className='text-sm font-garamond font-extrabold text-blue-500'>{user.first_name} {user.last_name}</p>
                <p className='text-xs font-garamond font-bold'>{user.user_name} </p>
                <p className='text-xs font-garamond italic'>{user.email}</p>
            </button>
            <div className='flex flex-row items-center justify-end space-x-2 w-1/2'>
                {!isCurrentUser && (
                    <>
                        <button onClick={() => onToggleAdmin(user._id)} className={`px-3 py-2 rounded ${user.isAdmin ? 'bg-blue-800' : 'bg-slate-300'} text-white flex flex-row justify-between items-center space-x-3 shadow-md`}>
                            <LockKeyholeIcon className='w-4 h-4' />
                            <span className='text-xs hidden md:block font-bold'>{user.isAdmin ? 'Revoke Admin' : 'Grant Admin'}</span>
                        </button>
                        <button onClick={() => onDeleteUser(user._id)} className='flex flex-row items-center justify-between px-3 py-2 bg-red-500
                                                                                                                                                      rounded focus:bg-red-800 focus:ring-1 hover:bg-red-800 hover:shadow-md space-x-3'>
                            <span className='text-xs hidden md:block text-white font-semibold'>Delete User</span>
                            <Trash2Icon className='w-4 h-4 text-white' />
                        </button>
                    </>
                )}
            </div>
        </li>
    )
}

interface NavBarProps {
    user: User;
    navigate: (path: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ user, navigate }) => {
    return (
        <nav className='w-screen h-auto rounded-b bg-slate-200 dark:bg-slate-900 flex flex-row items-center justify-between p-2'>
            <div>
                <h1 className='text-lg font-garamond font-bold'>Admin Dashboard</h1>
                <span className='text-sm font-garamond flex flex-row items-center justify-start'><UserCircle className='w-5 h-5 mr-3' /> {user.user_name} </span>
            </div>
            <div>
                <button
                    onClick={() => navigate('/home')}
                    className="flex items-center justify-around text-white dark:text-slate-900 w-8 h-8
                                       bg-slate-900 dark:bg-slate-200 p-1 rounded-md group hover:bg-white dark:hover:bg-slate-900
                                    hover:text-slate-900 dark:hover:text-white transition"
                >
                    <HomeIcon className='text-white dark:text-slate-900 group-hover:text-slate-900 dark:group-hover:text-white 
                                                                    w-5 h-5' />
                </button>
            </div>
        </nav>
    )
}

interface SearchBarProps {
    searchQuery: string;
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch }) => {
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        onSearch(query);
    }

    return (
        <div className="relative w-1/2">
            <div className="flex w-full">
                <span
                    className="rounded-l bg-white px-2 py-2 text-gray-600"
                    aria-label="Search"
                >
                    <BsSearch className="h-5 w-5" />
                </span>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search users"
                    className="flex-grow rounded-r border p-2 text-black focus:outline-none focus:ring-blue-500 text-sm"
                />

            </div>
        </div>
    );
};

interface UserDetailsPanelProps {
    user: User | null;
}

const UserDetailsPanel: React.FC<UserDetailsPanelProps> = ({ user }) => {
    if (!user) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className='font-garamond text-gray-500'>Select a user to view details</p>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-4 space-y-1">
                <h3 className="text-sm font-bold">Personal Information</h3>
                <p className='text-xs font-medium text-blue-800 dark:text-blue-400'>Name: <span className='text-black'>{user.first_name} {user.last_name}</span></p>
                <p className='text-xs font-medium text-blue-800 dark:text-blue-400'>Username: <span className='text-black'>{user.user_name}</span></p>
                <p className='text-xs font-medium text-blue-800 dark:text-blue-400'>Email: <span className='text-black'>{user.email}</span></p>
                <p className='text-xs font-medium text-blue-800 dark:text-blue-400'>Job Role: <span className='text-black'>{user.user_role}</span></p>
                <p className='text-xs font-medium text-blue-800 dark:text-blue-400'>Admin Status: <span className='text-black'>{user.isAdmin ? 'Yes' : 'No'}</span></p>
            </div>

            {/* <div className="mb-4">
                <h3 className="font-bold">Events Created</h3>
                {user.events && user.events.length > 0 ? (
                    <ul>
                        {user.events.map(event => (
                            <li key={event._id} className="text-sm">
                                {event.title} - {new Date(event.date).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No events created</p>
                )}
            </div> */}

            {/* <div>
                <h3 className="font-bold">Comments</h3>
                {user.comments && user.comments.length > 0 ? (
                    <ul>
                        {user.comments.map(comment => (
                            <li key={comment._id} className="text-sm">
                                On event "{comment.eventTitle}": {comment.text}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-gray-500">No comments made</p>
                )}
            </div> */}
        </div>
    );
};

export default AdminPage;
