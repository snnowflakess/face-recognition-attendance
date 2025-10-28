# 🎥 Face Recognition Attendance System

An AI-powered attendance system built with **React**, **FastAPI**, **OpenCV**, and **Face Recognition**.  
It detects faces using your webcam and logs attendance automatically in a local database.

---

## 🚀 Features
- Live webcam capture using React
- Real-time face recognition via FastAPI backend
- SQLite database for attendance tracking
- Beautiful colorful UI with animations
- “Welcome Rachael 🎉” popup when recognized

---

## 🧠 Tech Stack
- **Frontend:** React, Axios, CSS Animations  
- **Backend:** FastAPI, Python, OpenCV, face_recognition  
- **Database:** SQLite  

---

## ⚙️ Setup Instructions

### 1️⃣ Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
