import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './App.css';

function App() {
  const [date, setDate] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);

  // 格式化日期為 YYYY-MM-DD
  const toSqlDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 1. 初始化抓取
  useEffect(() => {
    fetch('https://silver-shoes-rush.loca.lt')
      .then(res => res.json())
      .then(data => setBookedDates(data))
      .catch(err => console.error("抓取失敗:", err));
  }, []);

  // 2. 判斷日曆顏色
  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = toSqlDate(date);
      if (bookedDates.includes(dateStr)) {
        return 'booked-date';
      }
    }
    return null;
  };

  // 3. 提交預約
  const handleBooking = () => {
    const dateStr = toSqlDate(date);
    console.log("📤 正在發送預約:", dateStr);

    fetch('https://silver-shoes-rush.loca.lt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: dateStr })
    })
    .then(async res => {
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '預約失敗');
      return data;
    })
    .then(() => {
      setBookedDates([...bookedDates, dateStr]);
      alert("預約成功！資料已存入 MySQL");
    })
    .catch(err => {
      console.error("錯誤詳情:", err);
      alert("預約失敗: " + err.message);
    });
  };

  return (
    <div className="App">
      <h1>庭瑜預約系統</h1>
      <div className="booking-container">
        <Calendar 
          onChange={setDate} 
          value={date} 
          tileClassName={getTileClassName}
        />
        <div className="info">
          <p>您選的日期: <strong>{toSqlDate(date)}</strong></p>
          <button 
            onClick={handleBooking} 
            disabled={bookedDates.includes(toSqlDate(date))}
          >
            {bookedDates.includes(toSqlDate(date)) ? "已被預約" : "立即預約"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
