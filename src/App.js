import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

// 這行是關鍵：它會自動抓取 Vercel 設定的網址，如果沒有，就用本機的 5000 埠
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  const formatDate = (d) => d.toLocaleDateString('en-CA');

  const fetchBookings = () => {
    fetch(`${API_BASE_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => setBookedDates(data))
      .catch(err => console.error("抓取失敗:", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getTileClassName = ({ date, view }) => {
    if (view === 'month' && bookedDates.includes(formatDate(date))) {
      return 'booked-date';
    }
    return null;
  };

  const handleBooking = () => {
    const dateStr = formatDate(date);
    fetch(`${API_BASE_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr })
    })
    .then(res => {
      if (!res.ok) throw new Error('預約失敗');
      return res.json();
    })
    .then(() => {
      alert("預約成功！");
      fetchBookings();
    })
    .catch(err => alert(err.message));
  };

  return (
    <div className="App">
      <h1>雲端預約系統</h1>
      <Calendar onChange={setDate} value={date} tileClassName={getTileClassName} />
      <button onClick={handleBooking} disabled={bookedDates.includes(formatDate(date))}>
        {bookedDates.includes(formatDate(date)) ? "已被預約" : "立即預約"}
      </button>
    </div>
  );
}

export default App;
