import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Calendar from "../../pages/components/calendar/calendar";
import dayjs from "dayjs";
import { ICalendarEvent } from "../../types/event_types";

const mockEvents: ICalendarEvent[] = []

describe('Calendar Component', () => {
    const mockOnDeleteEvent = jest.fn();
    const mockOnEditEvent = jest.fn();
    const mockSetCurrentMonth = jest.fn();
    const currentMonth = dayjs();

    it('renders correctly', () => {
        render(
            <Calendar
                events={mockEvents}
                onDeleteEvent={mockOnDeleteEvent}
                onEditEvent={mockOnEditEvent}
                currentMonth={currentMonth}
                setCurrentMonth={mockSetCurrentMonth}
                calendarView="month"
                />
        )
    })

    it('renders the calendar', () => {
        expect(screen.getByText(currentMonth.format('MMMM YYYY'))).toBeInTheDocument();
    });

    it('navigates to the next month when button is clicked', () => {
        const nextMonthButton = screen.getByRole('button', { name: /next/i });
        userEvent.click(nextMonthButton);
        expect(mockSetCurrentMonth).toHaveBeenCalled();
    })
})