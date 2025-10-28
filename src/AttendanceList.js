// src/AttendanceList.js
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
`;

const Item = styled.div`
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  padding: 10px;
  margin: 6px 0;
`;

export default function AttendanceList() {
  const [rows, setRows] = useState([]);

  const fetchAttendance = async () => {
    try {
      const res = await fetch("http://localhost:8000/attendance");
      const data = await res.json();
      setRows(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const id = setInterval(fetchAttendance, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <Card>
      <h3>🧾 Attendance Log</h3>
      {rows.length === 0 && <div>No entries yet</div>}
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {rows.map((r, i) => (
          <Item key={i}>
            <b>{r.name}</b>
            <br />
            <small>{new Date(r.timestamp).toLocaleString()}</small>
          </Item>
        ))}
      </div>
    </Card>
  );
}
