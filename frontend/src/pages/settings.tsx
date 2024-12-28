import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarCog, HomeIcon, InfoIcon, KeyIcon, Laptop, LockKeyhole, PaletteIcon, Trash, User2Icon, UserCircle2 } from 'lucide-react';
import api from '../api/axios_config';
import { useDarkMode } from '../hooks/useDarkMode';
import { Switch } from '@headlessui/react'
import { BsGithub } from 'react-icons/bs';

const Settings: React.FC = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState(user?.first_name || '');
    const [lastName, setLastName] = useState(user?.last_name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [userName, setUserName] = useState(user?.user_name || '');
    const [userRole, setUserRole] = useState(user?.user_role || '');
    const [isAdmin, setIsAdmin] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const [activeSection, setActiveSection] = useState<string>('');

    const [darkMode, setDarkMode] = useDarkMode();
    const [isEnabled, setIsEnabled] = useState(darkMode);

    const personalInfoRef = useRef<HTMLDivElement>(null);
    const changePasswordRef = useRef<HTMLDivElement>(null);
    const eventSettingsRef = useRef<HTMLDivElement>(null);
    const appearanceRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);

    const jobRoleOptions = [
        { value: '', label: 'Select a job role' },
        { value: 'radio_presenting', label: 'Radio Presenting' },
        { value: 'onsite_journalist', label: 'On-site Journalist' },
        { value: 'newsroom', label: 'Newsroom' },
        { value: 'digital', label: 'Digital Editor' },
        { value: 'developer', label: 'Developer' }
    ];

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user && user.isAdmin) {
            setIsAdmin(true);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            })
        }, { threshold: 0.5 })

        if (personalInfoRef.current) observer.observe(personalInfoRef.current);
        if (changePasswordRef.current) observer.observe(changePasswordRef.current);
        if (eventSettingsRef.current) observer.observe(eventSettingsRef.current);
        if (appearanceRef.current) observer.observe(appearanceRef.current);
        if (aboutRef.current) observer.observe(aboutRef.current);

        return () => {
            observer.disconnect();
        }
    }, []);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await api.put('/users/update', {
                firstName,
                lastName,
                email,
                userName,
                userRole,
                preferences: {
                    theme: isEnabled ? 'dark' : 'light',
                }
            })
            alert('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings', error);
            alert('Failed to update settings');
        }
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match');
            return;
        }

        try {
            await api.put('/users/change_password', {
                currentPassword,
                newPassword,
            })
            alert('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error('Failed to change password', error);
            alert('Failed to change password');
        }
    };

    const handleClearAllEvents = async () => {
        const confirmClear = window.confirm("Are you sure you want to clear all events?");
        if (confirmClear) {
            try {
                await api.delete('/events/clear');
                alert('All events cleared successfully!');
            } catch (error) {
                console.error('Failed to clear events', error);
                alert('Failed to clear events');
            }
        }
    };

    return (
        <main className="w-screen min-h-screen  bg-slate-200 dark:bg-slate-800
                                               flex flex-row justify-between items-stretch">
            <div className='w-1/12 md:w-1/3 bg-white/40 dark:bg-black/40 p-4 md:p-6 
                                            rounded-md h-screen flex flex-col justify-start items-center fixed top-0 left-0'>
                <div className="relative inline-block group">
                <UserCircle2 className='w-24 h-24 text-slate-900 dark:text-slate-200' />
                    <span className="text-[9px] font-bold italic text-white p-2 rounded-full bg-slate-500 absolute -bottom-0.5 -right-4 flex flex-row items-center">
                        <Laptop className='w-3 h-3 mx-1'/> {user?.user_name}
                    </span>
                </div>
                <h1 className='text-3xl text-blue-900 dark:text-blue-300 font-garamond font-bold hidden md:block'>{user?.first_name}   {user?.last_name}</h1>
                {isAdmin && (
                    <span className='rounded-full bg-orange-500 text-white font-bold text-[9px] px-2 py-1 flex flex-row items-center shadow-md'>
                        <LockKeyhole className='w-3 h-3 mx-1' /> Admin
                    </span>
                )}

                <div className='flex flex-col w-full items-start justify-evenly ml-6 py-5'>
                    <h1 className='text-sm dark:text-white hidden md:block'>User name:
                        <span className='font-bold italic'>  {user?.user_name}</span>
                    </h1>
                    <h1 className='text-sm dark:text-white hidden md:block'>Email address:
                        <span className='font-bold italic'>  {user?.email}</span>
                    </h1>
                </div>
                <hr className='border-slate-900 dark:border-white w-3/4 mx-auto my-3' />
                <div className='rounded w-full h-full md:h-4/5 overflow-y-auto'>
                    <ul className='min-w-full h-full flex flex-col justify-start'>
                        <SettingLink icon={<User2Icon />} isActive={activeSection === 'personalInfo'} scrollTo={personalInfoRef}>Account Setting</SettingLink>
                        <SettingLink icon={<KeyIcon />} isActive={activeSection === 'changePassword'} scrollTo={changePasswordRef}>Change Password</SettingLink>
                        <SettingLink icon={<CalendarCog />} isActive={activeSection === 'eventSettings'} scrollTo={eventSettingsRef}>Event Settings</SettingLink>
                        <SettingLink icon={<PaletteIcon />} isActive={activeSection === 'appearance'} scrollTo={appearanceRef}>Appearance and Personalization</SettingLink>
                        <SettingLink icon={<InfoIcon />} isActive={activeSection === 'about'} scrollTo={aboutRef}>About Calendar App</SettingLink>
                    </ul>
                </div>
            </div>
            <div className="p-4 md:p-8 h-full overflow-y-auto bg-gradient-to-bl from-blue-300 to-fuchsia-400 
                                               dark:bg-gradient-to-br dark:from-blue-900 dark:to-fuchsia-700 fixed top-0 right-0 w-full md:w-2/3">
                <section className='flex flex-row items-center justify-between w-full'>
                    <h1 className="text-3xl md:text-4xl font-garamond  font-bold text-blue-900 dark:text-blue-300">Settings</h1>
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center justify-around text-white dark:text-slate-900 mt-6 w-10 h-10
                                       bg-slate-900 dark:bg-slate-200 p-1 rounded-md group hover:bg-white dark:hover:bg-slate-900
                                    hover:text-slate-900 dark:hover:text-white transition"
                    >
                        <HomeIcon className='text-white dark:text-slate-900 group-hover:text-slate-900 dark:group-hover:text-white 
                                                                    w-5 h-5' />
                    </button>

                </section>
                <hr className='my-4 w-5/6 border-slate-900 dark:border-white' />
                <section id="personalInfo" ref={personalInfoRef} className="mb-8">
                    <h2 className="text-xl md:text-2xl dark:text-white font-garamond font-semibold mb-4">Personal Information</h2>
                    <form onSubmit={handleSaveChanges} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white">First Name</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black dark:text-white">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white">Username</label>
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white">Job Role(dept)</label>
                            <select
                                value={userRole}
                                onChange={(e) => setUserRole(e.target.value)}
                                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            >
                                {jobRoleOptions.map((option) => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-1/3 bg-blue-900 dark:bg-blue-500 text-white text-sm py-3 rounded-full 
                                                     hover:bg-blue-500 dark:hover:bg-blue-900 hover:shadow-md hover-animation"
                        >
                            Save Settings
                        </button>
                    </form>
                </section>
                <hr className='my-4 w-3/4 border-slate-900 dark:border-white' />
                <section id="changePassword" ref={changePasswordRef} className="mb-8">
                    <h2 className="text-xl md:text-2xl dark:text-white font-semibold font-garamond mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="p-3 mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full md:w-1/3 bg-blue-900 dark:bg-blue-500 text-white text-sm py-3 rounded-full 
                                                     hover:bg-blue-500 dark:hover:bg-blue-900 hover:shadow-md hover-animation"
                        >
                            Change Password
                        </button>
                    </form>
                </section>
                <hr className='my-4 w-3/4 border-slate-900 dark:border-white' />
                <section id="eventSettings" ref={eventSettingsRef} className="mb-8">
                    <h2 className="text-xl md:text-2xl dark:text-white font-garamond font-semibold mb-4">Event Settings</h2>
                    <div className='w-full flex flex-row items-center justify-start'>
                        <h1 className='mx-3 my-6 text-sm text-slate-900 dark:text-white grow'>Clear All Events</h1>
                        <button
                            onClick={handleClearAllEvents}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                        >
                            <Trash className='w-5 h-5 md:w-3 md:h-w-3' />
                        </button>
                    </div>
                </section>
                <hr className='my-4 w-3/4 border-slate-900 dark:border-white' />
                <section id="appearance" ref={appearanceRef} className="mb-8">
                    <h2 className="text-xl md:text-2xl dark:text-white font-garamond font-semibold mb-4">Appearance</h2>
                    <div className='w-full flex flex-row items-center'>
                        <h1 className='mx-3 my-8 text-sm text-slate-900 dark:text-white grow'>Set theme :</h1>
                        <Toggle isEnabled={isEnabled} setIsEnabled={setIsEnabled} setDarkMode={setDarkMode} />
                    </div>
                </section>
                <hr className='my-4 w-3/4 border-slate-900 dark:border-white' />
                <section id="about" ref={aboutRef} className="mb-8">
                    <h2 className="text-xl md:text-2xl dark:text-white font-garamond font-semibold mb-4">About</h2>
                    <div className='h-80 flex flex-col items-center justify-center'>
                        <h1 className='text-md font-medium text-slate-900 dark:text-white font-garamond'>Calendar App</h1>
                        <small className='font-medium text-slate-900 dark:text-white font-garamond'>2024</small>
                        <p className='text-slate-900 dark:text-white text-sm'>
                            You can contribute to the project over at
                            <a href='https://www.github.com/Manu254rce/calendar-app' className='font-bold text-blue-600 dark:text-blue-400'> Github </a>
                        </p>
                        <BsGithub className='text-xl md:text-2xl mt-1 text-slate-900 dark:text-white' />
                        {/* <img alt='KBC logo' src='public/KBC_Channel_1 [Converted].png'/> */}
                    </div>
                </section>
            </div>
        </main>
    );
}

interface SettingLinkProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    scrollTo: React.RefObject<HTMLDivElement>;
    isActive: boolean;
}

const SettingLink: React.FC<SettingLinkProps> = ({ children, icon, scrollTo, isActive }) => {
    const handleClick = () => {
        if (scrollTo.current) {
            scrollTo.current.scrollIntoView({ behavior: 'smooth' });
        }
    }
    return (
        <li>
            <button onClick={handleClick}
                className={`w-full py-4 px-3 flex items-center flex-row justify-start text-sm space-x-4
                                                font-bold rounded-md hover:bg-gradient-to-l from-blue-500 to-fuchsia-500 ' 
                                                ${isActive ? 'text-blue-400 font-bold' : 'text-slate-900 dark:text-white'} `}>
                {icon}
                <span className='text-xs'>{children}</span>
            </button>
        </li>
    )
}

interface ToggleProps {
    isEnabled: boolean;
    setIsEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setDarkMode: (mode: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ isEnabled, setIsEnabled, setDarkMode }) => {
    const handleModeToggle = (): void => {
        setDarkMode(!isEnabled)
        setIsEnabled(!isEnabled)
    }

    useEffect(() => {
        const className = 'dark';
        const bodyClass = window.document.body.classList;
        isEnabled ? bodyClass.add(className) : bodyClass.remove(className);
    }, [isEnabled]);

    return (
        <div className='flex-flex-row space-y-3'>
            <label className="block text-xs font-extralight text-slate-900 dark:text-white">
                {isEnabled ? 'Dark' : 'Light'}
            </label>
            <Switch
                checked={isEnabled}
                onChange={setIsEnabled}
                onClick={handleModeToggle}
                className={`${isEnabled ? 'bg-gradient-to-br from-slate-900 to-blue-900' : 'bg-gradient-to-bl from-blue-600 to-blue-400'
                    } relative inline-flex h-6 w-11 items-center rounded-full drop-shadow-md my-auto transition-all ease-in-out duration-300`}
            >
                <span
                    className={`${isEnabled ? 'translate-x-6 bg-white drop-shadow-[0_0_2px_#fff]' :
                        'translate-x-1 bg-yellow-300'
                        } inline-block h-4 w-4 transform rounded-full transition-all ease-in-out duration-300`}
                />
            </Switch>
        </div>
    )
}


export default Settings;