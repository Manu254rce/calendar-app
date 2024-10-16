import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale";
import { BsCalendar2Plus, BsChevronLeft, BsChevronRight, BsX } from "react-icons/bs";

dayjs.locale("en");

interface CalendarEvent {
    date: string;
    title: string;
}

interface CalendarProps {
    events: CalendarEvent[];
}

export const Calendar: React.FC<CalendarProps> = ({ events }) => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = currentMonth.startOf("month").day();
    const days = [];

    const getEventsForDate = (date: dayjs.Dayjs) => {
        return events.filter((event) => dayjs(event.date).isSame(date, "day"));
    }

    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="text-center"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = currentMonth.date(i);
        const isToday = date.isSame(dayjs(), "day");
        const eventForDay = getEventsForDate(date);

        days.push(
            <div
                key={date.format("YYYY-MM-DD")}
                className={`text-center my-auto text-lg font-medium p-1 
                            ${isToday
                        ? "bg-white rounded-md text-blue-600"
                        : "text-slate-900 hover:text-white"
                    }`}
                onClick={() => setSelectedDate(date)}
            >
                {i}
                {eventForDay && (
                    <div className="text-xs mt-1 bg-blue-200 rounded p-1">
                        {eventForDay.length}
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
        <div className="bg-gradient-to-bl from-white to-slate-200 col-span-3 drop-shadow-lg
                        grid grid-cols-7 gap-5 w-full h-full mx-auto rounded-md p-3">
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
                <div className="absolute top-0 left-0 w-full h-full bg-slate-900 
                                bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md w-64">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold">
                                {selectedDate.format("MMMM D, YYYY")}
                            </h3>
                            <button onClick={() => setSelectedDate(null)}>
                                <BsX className="text-2xl" />
                            </button>
                        </div>
                        <ul className="list-disc pl-5">
                            {getEventsForDate(selectedDate).map((event, index) => (
                                <li key={index}>{event.title}</li>
                            ))}
                        </ul>
                        {getEventsForDate(selectedDate).length === 0 && (
                            <p>No events for this day</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;