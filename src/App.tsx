import React, { useState } from 'react';
import Calendar from './components/calendar/calendar';
import ActionPane from './components/action_pane/action_pane';

function App() {
  const [events, setEvents] = useState<Event[]>([]);

  const handleAddEvent = (newEvent: Event) => {
    setEvents([...events, newEvent])
  }
  return (
    <main className='w-screen h-screen p-4 grid grid-cols-4 gap-4 bg-gradient-to-br from-blue-300 to-white'>
      <ActionPane onAddEvent={handleAddEvent}/>
      <Calendar/>
    </main>
  );
}

export default App;
