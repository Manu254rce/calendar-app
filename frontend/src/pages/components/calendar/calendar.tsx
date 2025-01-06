import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek';
import "dayjs/locale";
import { BsChevronLeft, BsChevronRight, BsX, BsTrash, BsPencilFill } from "react-icons/bs";
import { Users, MapPin, MapPinHouse, MessageCirclePlus } from "lucide-react";
import { ICalendarEvent, IComment } from "../../../types/event_types";
import { User } from "../../../types/user_types";
import api from '../../../api/axios_config';
import axios from "axios";

dayjs.locale("en");
dayjs.extend(isoWeek);

interface CalendarProps {
    events: ICalendarEvent[];
    // eventComments: { [eventId: string]: IComment[] };
    onDeleteEvent: (id: string) => void;
    onEditEvent: (editedEvent: ICalendarEvent) => void;
    currentMonth: dayjs.Dayjs;
    setCurrentMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    calendarView: 'month' | 'week' | 'day';
}

export const Calendar: React.FC<CalendarProps> = (
    { events,
        // eventComments,
        onDeleteEvent,
        onEditEvent,
        currentMonth,
        setCurrentMonth,
        calendarView,
    }) => {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const [userDetails, setUserDetails] = useState<Record<string, User>>({});
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [eventComments, setEventComments] = useState<{ [eventId: string]: IComment[] }>({});
    
    const getUniqueCommenters = (eventId: string): string[] => {
        const comments = eventComments[eventId] || [];
        return [...new Set(comments.map(comment => comment.userName))];
    };

    const eventTypeColors: Record<string, string> = {
        'News': 'bg-gradient-to-bl from-red-200 to-transparent border-r-8 border-r-red-800',
        'Business': 'bg-gradient-to-bl from-green-200 to-transparent border-r-8 border-r-green-800',
        'Sports': 'bg-gradient-to-bl from-blue-200 to-transparent border-r-8 border-r-blue-800',
        'Entertainment': 'bg-gradient-to-bl from-yellow-200 to-transparent border-r-8 border-r-yellow-600',
    }

    const fetchUserDetails = useCallback(async (userIds: string[]) => {
        if (!userIds.length || userIds.length === 0) return;

        const validUserIds = userIds.filter(id => id && id.trim() !== '');

        if (validUserIds.length === 0) return;

        try {
            console.log('Fetching user details for IDs: ', validUserIds);

            const response = await api.get('/users/details', {
                params: { userIds: validUserIds.join(',') }
            });

            console.log('User details response:', response.data);

            setUserDetails(prev => ({
                ...prev,
                ...response.data
            }));
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error response: ', error.response?.data)
            }
        } finally {
            setIsLoadingUsers(false);
        }
    }, []);

    useEffect(() => {
        const memberIds = events
            .flatMap(event => event.members || [])
            .filter((id): id is string => Boolean(id) && typeof id === 'string');

        console.log('Member IDs to fetch:', memberIds);

        if (memberIds.length > 0) {
            fetchUserDetails(memberIds);
        }
    }, [events, fetchUserDetails])

    const handleEditEvent = (event: ICalendarEvent) => {
        const newTitle = prompt("Enter new title", event.title);
        if (newTitle !== null) {
            const editedEvent = { ...event, title: newTitle };
            onEditEvent(editedEvent);
        }
    }

    const renderMonthView = () => {
        const daysInMonth = currentMonth.daysInMonth();
        const firstDayOfMonth = currentMonth.startOf("month").day();
        const days = [];

        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="text-center"></div>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const date = currentMonth.date(i);
            const isToday = date.isSame(dayjs(), "day");
            const eventsForDay = getEventsForDate(date);

            days.push(
                <div
                    key={date.format("YYYY-MM-DD")}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, date)}
                    className={`text-center my-auto text-sm font-extrabold
                                font-dancing-script py-2 relative cursor-pointer
                                ${isToday
                            ? "bg-gradient-to-r from-blue-800 to-fuchsia-600 rounded-md text-white"
                            : "text-slate-900 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 hover:rounded-md hover-animation"
                        }`}
                    onClick={() => setSelectedDate(date)}
                >
                    {i}
                    {eventsForDay.length > 0 && (
                        <div className="absolute top-1 right-1 bg-red-600 text-black 
                                        rounded-full w-3 h-3 md:w-4 md:h-4 text-[5px] md:text-xs flex items-center justify-center">
                            {eventsForDay.length}
                        </div>
                    )}
                </div>
            );
        }

        const Days = (props: { children: React.ReactNode }) => {
            return (
                <div className="text-center font-garamond font-bold text-lg text-blue-900 dark:text-blue-200">
                    {props.children}
                </div>
            );
        };

        const Sunday = (props: { children: React.ReactNode }) => {
            return (
                <div className="text-center font-garamond font-bold text-lg text-red-800 dark:text-red-300">
                    {props.children}
                </div>
            );
        };

        return (
            <>
                <section className="bg-gradient-to-br from-blue-800 to-fuchsia-700 
                                    p-3 h-1/4 col-span-7 rounded-md flex flex-row items-center 
                                    justify-center">
                    <button
                        onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                    >
                        <BsChevronLeft className="mx-auto text-2xl text-white" />
                    </button>
                    <div className="col-span-4 m-auto text-white text-3xl font-garamond">
                        {currentMonth.format(calendarView === 'month' ? "MMMM YYYY" : "MMMM D, YYYY")}
                    </div>
                    <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>
                        <BsChevronRight className="m-auto text-2xl text-white col-span-1" />
                    </button>
                </section>
                <div className="grid grid-cols-7 gap-6 py-2">
                    <Sunday>Sun</Sunday>
                    <Days>Mon</Days>
                    <Days>Tue</Days>
                    <Days>Wed</Days>
                    <Days>Thu</Days>
                    <Days>Fri</Days>
                    <Days>Sat</Days>
                    {days}
                </div>
            </>
        )

    }

    const renderWeekView = () => {
        const startOfWeek = currentMonth.startOf('week');
        const weekNumber = startOfWeek.isoWeek();
        const weekDisplay = `Week ${weekNumber}`;
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const date = startOfWeek.add(i, 'day');
            const eventsForDay = getEventsForDate(date);

            weekDays.push(
                <div
                    key={date.format("YYYY-MM-DD")}
                    className="border-white border-y p-2 rounded-md shadow-md"
                >
                    <div className="font-bold font-kavivanar text-[10px] md:text-sm dark:text-white">{date.format("dd D")}</div>
                    <hr className="w-3/4 border-gray-500 dark:border-gray-400 my-6 mx-auto" />
                    <ul>
                        <li>
                            {eventsForDay.map((event) => (
                                <div
                                    key={event._id}
                                    className="text-[5px] md:text-sm cursor-pointer font-medium bg-blue-500 p-1 rounded"
                                    onClick={() => setSelectedDate(date)}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </li>
                    </ul>
                </div>
            );
        }

        return (
            <>
                <section className="bg-gradient-to-br from-blue-800 to-fuchsia-700 px-5
                                    h-1/4 p-2 col-span-7 rounded-md flex flex-col justify-start">
                    <div className="text-left text-white text-xs font-light italic p-1">
                        {weekDisplay}
                    </div>
                    <hr className="border-white w-1/6 my-3" />
                    <div className="flex flex-row items-center justify-between w-full">
                        <button
                            onClick={() => setCurrentMonth(currentMonth.subtract(1, "week"))}
                        >
                            <BsChevronLeft className="mx-auto text-xl text-white" />
                        </button>

                        <div className="text-left text-white text-3xl font-garamond">
                            {currentMonth.format(calendarView === 'month' ? "MMMM YYYY" : "MMMM D, YYYY")}
                        </div>
                        <button onClick={() => setCurrentMonth(currentMonth.add(1, "week"))}>
                            <BsChevronRight className="m-auto text-xl text-white col-span-1" />
                        </button>
                    </div>
                </section>
                <div className="col-span-7 grid grid-cols-7 gap-1 h-3/4 py-3">
                    {weekDays}
                </div>
            </>
        );

    }

    const renderDayView = () => {
        const eventsForDay = getEventsForDate(currentMonth);

        return (
            <div className="col-span-7 flex-flex-row">
                <div className="p-4 flex flex-row items-center rounded space-x-8 bg-gradient-to-br from-blue-800 to-fuchsia-700">
                    <button
                        onClick={() => setCurrentMonth(currentMonth.subtract(1, "day"))}
                        className=""
                    >
                        <BsChevronLeft className="mx-auto text-2xl text-white" />
                    </button>
                    <div className="grow">
                        <div className="m-auto text-white text-3xl font-bold font-garamond">
                            {currentMonth.format("MMMM")}
                        </div>
                        <hr className="border-white my-5 w-2/3" />
                        <h2 className="text-6xl text-white font-kavivanar mb-4">{currentMonth.format("D")}</h2>
                    </div>
                    <button onClick={() => setCurrentMonth(currentMonth.add(1, "day"))}>
                        <BsChevronRight className="m-auto text-2xl text-white col-span-1" />
                    </button>
                </div>
                <section className="rounded-md p-3 flex flex-col w-3/4 mx-12">
                    {eventsForDay.map((event) => (
                        <div
                            key={event._id}
                            className="mb-2 p-2 h-1/4 w-3/4 border rounded 
                                    bg-blue-900 bg-opacity-50 overflow-y-scroll no-scrollbar 
                                    cursor-pointer hover:bg-blue-800"
                            onClick={() => setSelectedDate(currentMonth)}
                        >
                            <div className="font-bold">{event.title}</div>
                            <div className="text-xs">{event.description}</div>
                        </div>
                    ))}
                </section>
            </div>
        );
    }

    const handleKeyDown = (e: React.KeyboardEvent, date: dayjs.Dayjs) => {
        switch (e.key) {
            case 'ArrowLeft':
                setSelectedDate(date.subtract(1, 'day'))
                break;
            case 'ArrowRight':
                setSelectedDate(date.add(1, 'day'));
                break;
            case 'ArrowUp':
                setSelectedDate(date.subtract(1, 'week'))
                break;
            case 'ArrowDown':
                setSelectedDate(date.add(1, 'week'))
                break;
            case 'Enter':
                setSelectedDate(date);
                break;
        }
    }

    const getEventsForDate = (date: dayjs.Dayjs) => {
        return events.filter((event) => dayjs(event.date).isSame(date, "day"));
    };

    return (
        <div className="flex-1 bg-gradient-to-tl from-white to-slate-300 
                                            dark:bg-gradient-to-tl dark:from-blue-950  dark:to-slate-900
                                            border-1 border-white drop-shadow-lg min-h-[70vh]
                                            mx-auto rounded-md p-2 relative w-full lg:w-2/3">
            {calendarView === 'month' && renderMonthView()}
            {calendarView === 'week' && renderWeekView()}
            {calendarView === 'day' && renderDayView()}
            {selectedDate && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/80 rounded-md
                                flex items-center justify-center">
                    <div className="bg-white p-5 rounded-md w-3/4 max-w-md max-h-[40vh] md:max-h-[70vh] h-auto overflow-y-scroll no-scrollbar">
                        <div className="flex justify-between items-center mb-2 p-2">
                            <h3 className="text-sm md:text-lg font-bold font-garamond">{selectedDate.format("MMMM D, YYYY")}</h3>
                            <button onClick={() => setSelectedDate(null)}>
                                <BsX className="text-lg md:text-xl'" />
                            </button>
                        </div>
                        <ul className="list-none pl-0">
                            {getEventsForDate(selectedDate).map((event) => (
                                <li key={event._id} className={`${eventTypeColors[event.type] ||
                                    'bg-gradient-to-br from-slate-300 to-transparent'} 
                                     mb-4 p-2 border rounded cursor-pointer`}>
                                    <div className="flex justify-end items-center space-x-8">
                                        <h4 className="font-bold text-md md:text-xl grow">{event.title}</h4>
                                        <button onClick={() => handleEditEvent(event)} className="text-blue-800 text-sm md:text-md">
                                            <BsPencilFill />
                                        </button>
                                        <button onClick={() => onDeleteEvent(event._id)} className="text-red-800 text-sm md:text-md">
                                            <BsTrash />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600 italic">{event.type}</p>
                                    <hr className="my-5 w-3/4 border-black" />
                                    <p className="mt-1 text-sm">{event.description}</p>
                                    {event.members && event.members.length > 0 && (
                                        <div className="w-full mt-1 flex flex-row items-center justify-start space-x-5">
                                            <div className="bg-blue-300 rounded-md p-1">
                                                <Users className="w-2 h-2 md:w-3 md:h-3 text-blue-800" />
                                            </div>
                                            <span className="text-xs">
                                                <span className="font-semibold text-xs text-blue-600">Members :  </span>{' '} 
                                            {isLoadingUsers ? (
                                                <span className="text-gray-500 text-xs">Loading Members...</span>
                                            ) : (
                                                event.members.map(memberId =>
                                                    userDetails[memberId]?.user_name || 'Unknown User'
                                                ).join(', ')
                                            )}
                                            </span>
                                        </div>
                                    )}
                                    {event.location && event.location.name && (
                                        <div className="w-full mt-1 flex flex-row items-center justify-start space-x-5">
                                            <div className="bg-blue-300 rounded-md p-1">
                                                <MapPin className="w-2 h-2 md:w-3 md:h-3 text-blue-800" />
                                            </div>
                                            <span className="text-xs">
                                                <span className="font-semibold text-xs text-blue-600">Location : </span>{event.location.name}</span> 
                                        </div>
                                    )}
                                    {event.location && event.location.address && (
                                        <div className="w-full mt-1 flex flex-row items-center justify-start space-x-5">
                                            <div className="bg-blue-300 rounded-md p-1">
                                                <MapPinHouse className="w-2 h-2 md:w-3 md:h-3 text-blue-800" />
                                            </div>
                                            <span className="text-xs">
                                                <span className="font-semibold text-xs text-blue-600">Address : </span>{event.location.address}</span> 
                                        </div>
                                    )}
                                    <div className="mt-5">
                                        {event.tags.map((tag, index) => (
                                            <span key={index} className="inline-block bg-blue-100 text-blue-800
                                                                            text-xs px-2 py-1 rounded mr-1 mb-1">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <hr className="w-3/4 border-gray-400 my-5" />
                                    {eventComments[event._id] && eventComments[event._id].length > 0 && (
                                        <div className="flex items-center py-5">
                                            <MessageCirclePlus className="mr-2 h-5 w-5 text-blue-950" />
                                            <span className="mr-2 text-xs italic font-bold">
                                                {eventComments[event._id].length} comments posted by
                                            </span>
                                            <div className="flex -space-x-2">
                                                {
                                                    getUniqueCommenters(event._id)
                                                        .slice(0, 3)
                                                        .map((commenter, index) => (
                                                            <div
                                                                key={index}
                                                                className="w-6 h-6 rounded-full bg-blue-500 text-white 
                                                                           flex flex-row items-center justify-center text-xs 
                                                                           border-white shadow-md"
                                                            >
                                                                {commenter.charAt(0)}
                                                            </div>
                                                        ))
                                                }
                                                {getUniqueCommenters(event._id).length > 3 && (
                                                    <div
                                                        className="w-6 h-6 rounded-full bg-gray-500 text-white 
                                                               flex items-center justify-center text-xs 
                                                               border-2 border-white"
                                                    >
                                                        +{getUniqueCommenters(event._id).length - 3}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {getEventsForDate(selectedDate).length === 0 && (
                            <p>No events for this day.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;