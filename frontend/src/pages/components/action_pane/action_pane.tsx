import dayjs from 'dayjs';
import React from 'react';
import { BsEyeFill, BsPlus } from 'react-icons/bs';
import { BsCalendar2Fill } from 'react-icons/bs';

interface ActionPaneProps {
    onToggleSideBar: () => void;
    setCurrentMonth: React.Dispatch<React.SetStateAction<dayjs.Dayjs>>;
    setCalendarView: React.Dispatch<React.SetStateAction<'month' | 'week' | 'day'>>;

}

const ActionPane: React.FC<ActionPaneProps> = ({ onToggleSideBar, setCurrentMonth, setCalendarView }) => {
    const cycleCalendarView = () => {
        setCalendarView((currentView) => {
            switch (currentView) {
                case 'month':
                    return 'week';
                case 'week':
                    return 'day';
                case 'day':
                    return 'month';
                default:
                    return 'month';
            }

        })
    }

    return (
        <div className='bg-gradient-to-b from-blue-800 to-fuchsia-700 shadow-md 
                        rounded-md p-3 col-span-1 text-white
                        flex flex-col items-center justify-start space-y-10'>
            <button
                className='bg-white p-2 rounded-full mb-4'
                onClick={onToggleSideBar}
            >
                <BsPlus className='text-3xl text-blue-900' />
            </button>
            <button
                className='p-2 mb-4'
            >
                <BsCalendar2Fill
                    onClick={() => setCurrentMonth(dayjs())}
                    className='text-2xl text-white' />
            </button>
            <button
                className='p-2 mb-4'
            >
                <BsEyeFill
                    onClick={cycleCalendarView}
                    className='text-2xl text-white' />
            </button>
        </div>
    );
};

export default ActionPane;