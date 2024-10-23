import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale";
import { BsCalendar2Plus, BsChevronLeft, BsChevronRight, BsX, BsTrash, BsPencil } from "react-icons/bs";
import { ICalendarEvent } from "../../types/event_types";

dayjs.locale("en");

interface CalendarProps {
    events: ICalendarEvent[];
    onDeleteEvent: (id: string) => void;
    onEditEvent: (editedEvent: ICalendarEvent) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ events, onDeleteEvent, onEditEvent }) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = currentMonth.startOf("month").day();
    const days = [];

    const eventTypeColors: Record<string, string> = {
        'News': 'bg-gradient-to-bl from-red-200 to-transparent',
        'Business': 'bg-gradient-to-bl from-green-200 to-transparent',
        'Sports': 'bg-gradient-to-bl from-blue-200 to-transparent',
        'Entertainment': 'bg-gradient-to-bl from-yellow-200 to-transparent',
    }

    const handleEditEvent = (event: ICalendarEvent) => {
        const newTitle = prompt("Enter new title", event.title);
        if (newTitle !== null) {
            const editedEvent = { ...event, title: newTitle };
            onEditEvent(editedEvent);
        }
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
                className={`text-center my-auto text-lg font-medium p-1 relative cursor-pointer
                            ${isToday
                        ? "bg-white rounded-md text-blue-600"
                        : "text-slate-900 hover:bg-blue-100"
                    }`}
                onClick={() => setSelectedDate(date)}
            >
                {i}
                {eventsForDay.length > 0 && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white 
                                    rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {eventsForDay.length}
                    </div>
                )}
            </div>
        );
    }

    const Days = (props: { children: React.ReactNode }) => {
        return (
            <div className="text-center font-medium text-xl text-blue-900">
                {props.children}
            </div>
        );
    };

    const Sunday = (props: { children: React.ReactNode }) => {
        return (
            <div className="text-center font-medium text-xl text-red-600">
                {props.children}
            </div>
        );
    };

    return (
        <div className="bg-gradient-to-bl from-white to-slate-200 col-span-5 drop-shadow-lg
                        grid grid-cols-7 gap-5 w-full h-full mx-auto rounded-md p-3 relative">
            <section className="bg-blue-900 p-2 col-span-7 rounded-md flex flex-row items-center justify-center">
                <button
                    onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                >
                    <BsChevronLeft className="mx-auto text-5xl text-white" />
                </button>
                <div className="col-span-4 m-auto text-white text-4xl font-extrabold">
                    {currentMonth.format("MMMM YYYY")}
                </div>
                <button onClick={() => setCurrentMonth(dayjs())}>
                    <BsCalendar2Plus className="text-2xl text-white mx-auto" />
                </button>
                <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}>
                    <BsChevronRight className="m-auto text-5xl text-white col-span-1" />
                </button>
            </section>
            <Sunday>Sun</Sunday>
            <Days>Mon</Days>
            <Days>Tue</Days>
            <Days>Wed</Days>
            <Days>Thu</Days>
            <Days>Fri</Days>
            <Days>Sat</Days>
            {days}
            {selectedDate && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-64">
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
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold">{event.title}</h4>
                                        <button onClick={() => handleEditEvent(event)} className="text-blue-800">
                                            <BsPencil />
                                        </button>
                                        <button onClick={() => onDeleteEvent(event._id)} className="text-red-500">
                                            <BsTrash />
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">{event.type}</p>
                                    <p className="mt-1">{event.description}</p>
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