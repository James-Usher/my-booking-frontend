import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  const formatDate = (d) => {
    const offset = d.getTimezoneOffset();
    const adjustedDate = new Date(d.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  const fetchBookings = () => {
    fetch(`${API_BASE_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => setBookedDates(data))
      .catch(err => console.error("Error:", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBooking = () => {
    fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: formatDate(date) })
    })
    .then(res => res.json())
    .then(() => {
      alert("預約成功！");
      fetchBookings();
    });
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>預約系統</h1>
      <div style={{ display: 'inline-block' }}>
        <Calendar onChange={setDate} value={date} />
      </div>
      <br />
      <button onClick={handleBooking} style={{ marginTop: '20px', padding: '10px 20px' }}>
        立即預約 {formatDate(date)}
      </button>
    </div>
  );
}

export default App;
