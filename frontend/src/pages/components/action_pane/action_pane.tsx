import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { BsBoxArrowLeft, BsEyeFill, BsGearFill, BsPlus, BsCalendar2Fill, BsFillHouseGearFill } from 'react-icons/bs';
import { Menu, UserCircle, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WebLoader } from '../../home';
import { User } from '../../../types/user_types';

interface ActionPaneProps {
    onToggleSideBar: () => void;
    setCurrentMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    setCalendarView: React.Dispatch<React.SetStateAction<'month' | 'week' | 'day'>>;
}

const ActionPane: React.FC<ActionPaneProps> = ({
    onToggleSideBar,
    setCurrentMonth,
    setCalendarView
}) => {
    const { user } = useAuth();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.isAdmin) {
            setIsAdmin(true);
        }
    }, []);

    const cycleCalendarView = () => {
        setCalendarView((currentView) => {
            switch (currentView) {
                case 'month': return 'week';
                case 'week': return 'day';
                case 'day': return 'month';
                default: return 'month';
            }
        })
    }

    const handleOpenSettings = () => {
        navigate('/settings');
        setIsMobileMenuOpen(false);
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    const renderActionButtons = () => (
        <>
            <button
                onClick={onToggleSideBar}
                className='flex flex-row w-full items-center hover:bg-white group/edit 
                           hover:rounded-md hover:text-blue-900 hover-animation'
            >
                <div className='p-2'>
                    <BsPlus className='text-xl text-white group-hover/edit:text-blue-900' />
                </div>
                <div className='ml-6 opacity-0 group-hover:opacity-100 
                                hover-animation whitespace-nowrap flex items-center'>
                    <h1 className='text-sm'>Add an Event</h1>
                </div>
            </button>

            <hr className='md:w-10 group-hover:w-2/3 mx-auto' />

            <button
                onClick={() => setCurrentMonth(dayjs())}
                className='flex w-full items-center hover:bg-white group/edit
                           hover:rounded-md hover:text-blue-900 hover-animation'
            >
                <div className='p-2'>
                    <BsCalendar2Fill className='text-xl text-white group-hover/edit:text-blue-900' />
                </div>
                <div className='ml-6 opacity-0 group-hover:opacity-100 
                                hover-animation whitespace-nowrap flex items-center'>
                    <h1 className='text-sm'>Return to current date</h1>
                </div>
            </button>

            <button
                onClick={cycleCalendarView}
                className='flex w-full items-center hover:bg-white group/edit
                           hover:rounded-md hover:text-blue-900 hover-animation'
            >
                <div className='p-2'>
                    <BsEyeFill className='text-xl text-white group-hover/edit:text-blue-900' />
                </div>
                <div className='ml-6 opacity-0 group-hover:opacity-100 
                                hover-animation whitespace-nowrap flex items-center'>
                    <h1 className='text-sm'>Change calendar view</h1>
                </div>
            </button>

            <button
                onClick={handleOpenSettings}
                className='flex w-full items-center hover:bg-white group/edit
                           hover:rounded-md hover:text-blue-900 hover-animation'
            >
                <div className='p-2'>
                    <BsGearFill className='text-xl text-white group-hover/edit:text-blue-900' />
                </div>
                <div className='ml-6 opacity-0 group-hover:opacity-100 
                                hover-animation whitespace-nowrap flex items-center'>
                    <h1 className='text-sm'>Settings</h1>
                </div>
            </button>

            {isAdmin && (<button
                onClick={() => navigate('/admin')}
                className='flex w-full items-center hover:bg-white group/edit
                           hover:rounded-md hover:text-blue-900 hover-animation'
            >
                <div className='p-2'>
                    <BsFillHouseGearFill className='text-xl text-white group-hover/edit:text-blue-900' />
                </div>
                <div className='ml-6 opacity-0 group-hover:opacity-100 
                                hover-animation whitespace-nowrap flex items-center'>
                    <h1 className='text-sm'>Go to admin page</h1>
                </div>
            </button>
            )}

            <hr className='md:w-10 group-hover:w-2/3 mx-auto' />

            <button
                onClick={handleLogout}
                className='flex w-full items-center hover:bg-white group/edit
                           hover:rounded-md hover:text-blue-900 hover-animation'
            >
                <div className='p-2'>
                    <BsBoxArrowLeft className='text-xl text-white group-hover/edit:text-blue-900' />
                </div>
                <div className='ml-6 opacity-0 group-hover:opacity-100
                                hover-animation whitespace-nowrap flex items-center'>
                    <h1 className='text-sm'>Logout</h1>
                </div>
            </button>
        </>
    );

    return (
        <>
            <button
                className="md:hidden fixed bottom-0 z-30 m-3 bg-blue-700 
                    text-white p-2 rounded-full"
                onClick={toggleMobileMenu}
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div
                className={`bg-gradient-to-b  from-blue-800 to-fuchsia-700 shadow-md py-3 px-4 text-white w-12 hover:w-1/4 h-screen z-20 absolute top-0 left-0
                    flex flex-col items-center justify-start space-y-10 hover-animation overflow-y-auto no-scrollbar
                    group md:w-20 md:hover:w-1/4 transform transition-transform duration-300 ease-in-out
                    ${isMobileMenuOpen
                        ? 'translate-x-0 md:translate-x-0'
                        : '-translate-x-full md:translate-x-0'}
                `}
            >
                <div className="w-full flex group-hover:px-10 group-hover:opacity-100 hover-animation">
                    {user ? <WelcomeUser user={user} /> : <div> Loading User ...</div>}
                </div>
                {renderActionButtons()}
            </div>

            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
                    onClick={toggleMobileMenu}
                />
            )}
        </>
    );
};

interface WelcomeUserProps {
    user: User;
}

const WelcomeUser: React.FC<WelcomeUserProps> = React.memo(({ user }) => {
    console.log('Welcome User props: ', user);
    if (!user) {
        return (
            <div className="flex justify-center items-center">
                <WebLoader />
            </div>
        );
    }
    return (
        <div className="flex flex-row">
            <UserCircle className='w-6 h-6 lg:w-10 lg:h-10' />
            <div className='flex flex-col flex-grow ml-5'>
                <h1 className="hidden group-hover:block text-md font-garamond font-bold dark:text-white">
                    Hello, {user.user_name}
                </h1>
                <p className="hidden group-hover:block text-xs font-bold text-slate-200">
                    {user.email}
                </p>
            </div>
        </div>
    )
})

export default ActionPane;