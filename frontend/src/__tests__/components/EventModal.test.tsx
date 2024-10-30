import { render, screen, fireEvent } from '@testing-library/react';
import EventModal from '../../pages/components/newEvent_modal/newEvent_modal';

describe('EventModal Component', () => {
  const mockProps = {
    onClose: jest.fn(),
    onAddEvent: jest.fn(),
    eventTypes: ['type1', 'type2'],
    onAddEventType: jest.fn(),
    isCreating: false
  };

  it('renders correctly', () => {
    render(
      <EventModal
        {...mockProps}
      />
    );
  });

  it('renders the form fields', () => {
    expect(screen.getByLabelText(/event title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('submits the form with valid data', () => {
    fireEvent.change(screen.getByLabelText(/event title/i), {
      target: { value: 'Test Event' },
    });
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2024-01-01' },
    });
    fireEvent.click(screen.getByText(/add event/i));
    expect(mockProps).toHaveBeenCalled();
  });
});