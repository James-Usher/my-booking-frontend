import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  // 格式化日期為 YYYY-MM-DD
  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchBookings = () => {
    fetch(`${API_BASE_URL}/api/bookings`)
      .then(res => res.json())
      .then(data => {
        // 強制將所有回傳的日期切為 YYYY-MM-DD 格式
        const formatted = data.map(d => d.split('T')[0]);
        setBookedDates(formatted);
      })
      .catch(err => console.error("抓取失敗:", err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      if (bookedDates.includes(dateStr)) {
        return 'booked-date'; // 對應 CSS 裡的類別
      }
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
      fetchBookings(); // 重新抓取資料
    })
    .catch(err => alert(err.message));
  };

  return (
    <div className="App" style={{ textAlign: 'center', padding: '20px' }}>
      <h1>雲端預約系統</h1>
      <div style={{ display: 'inline-block' }}>
        <Calendar 
          onChange={setDate} 
          value={date} 
          tileClassName={getTileClassName}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <p>目前選擇：{formatDate(date)}</p>
        <button 
          onClick={handleBooking} 
          disabled={bookedDates.includes(formatDate(date))}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {bookedDates.includes(formatDate(date)) ? "已被預約" : "立即預約"}
        </button>
      </div>
    </div>
  );
}

export default App;
