import React, { useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale";
import { BsCalendar2Plus, BsChevronLeft, BsChevronRight } from "react-icons/bs";

dayjs.locale("en");

interface Event {
    date: string;
    title: string;
}

interface CalendarProps {
    events: Event[];
}

// interface StreakCalendarProps {
//   events: { date: string; title: string }[];
// }

export const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const daysInMonth = currentMonth.daysInMonth();
    const firstDayOfMonth = currentMonth.startOf("month").day();
    const days = [];
    //   let streakCount = 0;

    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="text-center"></div>);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const date = currentMonth.date(i);
        const isToday = date.isSame(dayjs(), "day");
        // const eventForDay =
        //   events && Array.isArray(events)
        //     ? events.find((event) => dayjs(event.date).isSame(date, "day"))
        //     : undefined;

        // if (eventForDay) {
        //   streakCount++;
        // } else {
        //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
        //   streakCount = 0;
        // }

        days.push(
            <div
                key={date.format("YYYY-MM-DD")}
                className={`text-center my-auto text-lg font-medium p-1 
                                                 ${isToday
                        ? "bg-white rounded-md text-blue-600"
                        : "text-slate-900 hover:text-white"
                    }`}
            >
                {i}
                {/* {eventForDay && <div>{eventForDay.title}</div>} */}
            </div>
        );
    }

    const Days = (props: { children: React.ReactNode }) => {
        return (
            <div
                className="text-center font-medium text-xl
                         text-blue-900"
            >
                {props.children}
            </div>
        );
    };

    const Sunday = (props: { children: React.ReactNode }) => {
        return (
            <div
                className="text-center font-medium text-xl
                         text-red-600"
            >
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
        </div>
    );
};

export default Calendar;