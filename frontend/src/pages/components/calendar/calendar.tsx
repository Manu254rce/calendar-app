import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale";
import { BsChevronLeft, BsChevronRight, BsX, BsTrash, BsPencilFill } from "react-icons/bs";
import { ICalendarEvent } from "../../../types/event_types";

dayjs.locale("en");

interface CalendarProps {
    events: ICalendarEvent[];
    onDeleteEvent: (id: string) => void;
    onEditEvent: (editedEvent: ICalendarEvent) => void;
    currentMonth: dayjs.Dayjs;
    setCurrentMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    calendarView: 'month' | 'week' | 'day';

}

export const Calendar: React.FC<CalendarProps> = (
    { events,
        onDeleteEvent,
        onEditEvent,
        currentMonth,
        setCurrentMonth,
        calendarView }) => {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);




    const eventTypeColors: Record<string, string> = {
        'News': 'bg-gradient-to-bl from-red-200 to-transparent border-r-8 border-r-red-800',
        'Business': 'bg-gradient-to-bl from-green-200 to-transparent border-r-8 border-r-green-800',
        'Sports': 'bg-gradient-to-bl from-blue-200 to-transparent border-r-8 border-r-blue-800',
        'Entertainment': 'bg-gradient-to-bl from-yellow-200 to-transparent border-r-8 border-r-yellow-600',
    }

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
                    className={`text-center my-auto text-2xl font-bold
                                font-dancing-script p-1 relative cursor-pointer
                                ${isToday
                            ? "bg-gradient-to-r from-blue-800 to-fuchsia-600 rounded-md text-white"
                            : "text-blue-900 hover:bg-white hover:rounded-md hover-animation"
                        }`}
                    onClick={() => setSelectedDate(date)}
                >
                    {i}
                    {eventsForDay.length > 0 && (
                        <div className="absolute top-1 right-1 bg-red-500 text-white 
                                        rounded-full w-6 h-6 text-xs flex items-center justify-center">
                            {eventsForDay.length}
                        </div>
                    )}
                </div>
            );
        }

        const Days = (props: { children: React.ReactNode }) => {
            return (
                <div className="text-center font-garamond font-bold text-2xl text-blue-900">
                    {props.children}
                </div>
            );
        };

        const Sunday = (props: { children: React.ReactNode }) => {
            return (
                <div className="text-center font-garamond font-bold text-2xl text-red-600">
                    {props.children}
                </div>
            );
        };

        return (
            <>
                <section className="bg-blue-900 p-3 h-1/2 col-span-7 rounded-md flex flex-row items-center justify-center">
                    <button
                        onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                    >
                        <BsChevronLeft className="mx-auto text-5xl text-white" />
                    </button>
                    <div className="col-span-4 m-auto text-white text-3xl font-garamond">
                        {currentMonth.format(calendarView === 'month' ? "MMMM YYYY" : "MMMM D, YYYY")}
                    </div>
                    <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>
                        <BsChevronRight className="m-auto text-5xl text-white col-span-1" />
                    </button>
                </section>
                <div className="col-span-7 h-full grid grid-cols-7 gap-6">
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
        const weekDays = [];

        for (let i = 0; i < 7; i++) {
            const date = startOfWeek.add(i, 'day');
            const eventsForDay = getEventsForDate(date);

            weekDays.push(
                <div key={date.format("YYYY-MM-DD")} className="border p-2">
                    <div className="font-bold">{date.format("ddd D")}</div>
                    {eventsForDay.map((event) => (
                        <div key={event._id} className="text-sm">{event.title}</div>
                    ))}
                </div>
            );
        }

        return (
            <>
                <section className="bg-blue-900 h-1/2 p-1 col-span-7 rounded-md flex flex-row items-center justify-center">
                    <button
                        onClick={() => setCurrentMonth(currentMonth.subtract(1, "week"))}
                    >
                        <BsChevronLeft className="mx-auto text-5xl text-white" />
                    </button>
                    <div className="col-span-4 m-auto text-white text-4xl font-garamond">
                        {currentMonth.format(calendarView === 'month' ? "MMMM YYYY" : "MMMM D, YYYY")}
                    </div>
                    <button onClick={() => setCurrentMonth(currentMonth.add(1, "week"))}>
                        <BsChevronRight className="m-auto text-5xl text-white col-span-1" />
                    </button>
                </section>
                <div className="col-span-7 grid grid-cols-7 gap-1 h-full">
                    {weekDays}
                </div>
            </>
        );

    }

    const renderDayView = () => {
        const eventsForDay = getEventsForDate(currentMonth);

        return (
            <div className="col-span-7 flex-flex-row">
                <div className="p-4 flex flex-row items-center rounded space-x-8 bg-gradient-to-br from-white-900 to-transparent">
                    <button
                        onClick={() => setCurrentMonth(currentMonth.subtract(1, "day"))}
                        className=""
                    >
                        <BsChevronLeft className="mx-auto text-4xl text-blue-800" />
                    </button>
                    <div className="grow">
                        <div className="m-auto text-blue-900 text-5xl font-garamond">
                            {currentMonth.format("MMMM")}
                        </div>
                        <hr className="border-blue-900 my-5 w-2/3" />
                        <h2 className="text-6xl font-kavivanar mb-4">{currentMonth.format("D")}</h2>
                    </div>
                    <button onClick={() => setCurrentMonth(currentMonth.add(1, "day"))}>
                        <BsChevronRight className="m-auto text-4xl text-blue-800 col-span-1" />
                    </button>
                </div>
                <section className="rounded-md p-3 flex flex-col w-3/4 mx-12">
                    {eventsForDay.map((event) => (
                        <div key={event._id} className="mb-2 p-2 h-1/4 w-3/4 border rounded 
                                                    bg-blue-900 bg-opacity-50 overflow-y-scroll no-scrollbar">
                            <div className="font-bold">{event.title}</div>
                            <div className="text-sm">{event.description}</div>
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
        <div className="bg-gradient-to-tl from-white via to-slate-200/30 col-span-8 border-1 border-white drop-shadow-lg
                        grid grid-cols-7 gap-5 w-full h-full mx-auto rounded-md p-3 relative">
            {calendarView === 'month' && renderMonthView()}
            {calendarView === 'week' && renderWeekView()}
            {calendarView === 'day' && renderDayView()}
            {selectedDate && (
                <div className="absolute top-0 left-0 w-full h-full bg-black/80 rounded-md
                                flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-1/2 h-1/2 overflow-y-scroll no-scrollbar">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold">{selectedDate.format("MMMM D, YYYY")}</h3>
                            <button onClick={() => setSelectedDate(null)}>
                                <BsX className="text-2xl" />
                            </button>
                        </div>
                        <ul className="list-none pl-0">
                            {getEventsForDate(selectedDate).map((event) => (
                                <li key={event._id} className={`${eventTypeColors[event.type] ||
                                    'bg-gradient-to-br from-slate-300 to-transparent'} 
                                                                mb-4 p-2 border rounded`}>
                                    <div className="flex justify-end items-center space-x-8">
                                        <h4 className="font-bold grow">{event.title}</h4>
                                        <button onClick={() => handleEditEvent(event)} className="text-blue-800">
                                            <BsPencilFill />
                                        </button>
                                        <button onClick={() => onDeleteEvent(event._id)} className="text-red-500">
                                            <BsTrash />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">{event.type}</p>
                                    <p className="mt-1">{event.description}</p>
                                    {event.members && event.members.length > 0 && (
                                        <p className="mt-1">Members: {event.members.join(', ')}</p>
                                    )}
                                    {event.location && event.location.name && (
                                        <p className="mt-1">Location: {event.location.name}</p>
                                    )}
                                    {event.location && event.location.address && (
                                        <p className="mt-1">Address: {event.location.address}</p>
                                    )}
                                    <div className="mt-2">
                                        {event.tags.map((tag, index) => (
                                            <span key={index} className="inline-block bg-blue-100 text-blue-800
                                                                            text-xs px-2 py-1 rounded mr-1 mb-1">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
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