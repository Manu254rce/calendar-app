import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { BsBoxArrowLeft, BsEyeFill, BsGearFill, BsPlus, BsCalendar2Fill, BsFillHouseGearFill } from 'react-icons/bs';
import { Menu, UserCircle, X } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { WebLoader } from '../../home';
import { User } from '../../../types/user_types';
import { IconType } from 'react-icons';

interface ActionPaneProps {
    onToggleSideBar: () => void;
    setCurrentMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    setCalendarView: React.Dispatch<React.SetStateAction<'month' | 'week' | 'day'>>;
}

interface MobileMenuItemProps {
    icon: IconType;
    label: string;
    onClick: () => void;
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

    const MobileMenuItem: React.FC<MobileMenuItemProps> = ({ icon: Icon, label, onClick }) => (
        <button
            onClick={() => {
                onClick();
                setIsMobileMenuOpen(false);
            }}
            className="flex items-center w-full p-3 hover:bg-white/10 rounded-lg"
        >
            <Icon className="text-xl text-white" />
            <span className="ml-3 text-sm text-white">{label}</span>
        </button>
    );

    const renderDesktopButtons = () => (
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

    const renderMobileMenu = () => (
        <div className={`
            fixed bottom-20 right-4 z-40 h-auto
            bg-gradient-to-b from-blue-800 to-fuchsia-700 
            rounded-lg shadow-lg p-2 
            transform transition-all duration-300
            ${isMobileMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
        `}>
            <div className="w-64 space-y-3 pb-9">
                <MobileMenuItem icon={BsPlus} label="Add Event" onClick={onToggleSideBar} />
                <MobileMenuItem icon={BsCalendar2Fill} label="Return to today" onClick={() => setCurrentMonth(dayjs())} />
                <MobileMenuItem icon={BsEyeFill} label="Change View" onClick={cycleCalendarView} />
                <MobileMenuItem icon={BsGearFill} label="Settings" onClick={handleOpenSettings} />
                {isAdmin && (
                    <MobileMenuItem 
                        icon={BsFillHouseGearFill} 
                        label="Go to Admin" 
                        onClick={() => navigate('/admin')} 
                    />
                )}
                <MobileMenuItem icon={BsBoxArrowLeft} label="Logout" onClick={handleLogout} />
            </div>
        </div>
    );

    return (
        <>
             <div className={`
                fixed top-0 left-0 hidden md:flex bg-gradient-to-b from-blue-800 to-fuchsia-700 
                shadow-md py-3 px-4 text-white w-20 hover:w-1/4 h-screen 
                flex-col items-center justify-start space-y-10 overflow-y-scroll no-scrollbar
                group transition-all duration-300 ease-in-out z-30
            `}>
                <div className="w-full flex group-hover:px-10">
                    {user ? <WelcomeUser user={user} /> : <WebLoader />}
                </div>
                {renderDesktopButtons()}
            </div>

            <div className="md:hidden">
                <button
                    onClick={toggleMobileMenu}
                    className="fixed bottom-4 right-4 z-30 
                             w-14 h-14 bg-blue-600 
                             rounded-full shadow-lg 
                             flex items-center justify-center
                             hover:bg-blue-700 active:scale-95"
                >
                    {isMobileMenuOpen ? (
                        <X className="text-white w-6 h-6" />
                    ) : (
                        <Menu className="text-white w-6 h-6" />
                    )}
                </button>
                {renderMobileMenu()}
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30"
                        onClick={toggleMobileMenu}
                    />
                )}
            </div>
        </>
    );
};

const WelcomeUser: React.FC<{ user: User }> = React.memo(({ user }) => {
    if (!user) return <WebLoader />;
    
    return (
        <div className="flex items-center">
            <UserCircle className="w-6 h-6 lg:w-10 lg:h-10" />
            <div className="ml-5 hidden group-hover:block">
                <h1 className="text-md font-bold">{user.user_name}</h1>
                <p className="text-xs text-slate-200">{user.email}</p>
            </div>
        </div>
    );
});

export default ActionPane;