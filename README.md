# Live Chat Application

Real-time chat application built with Django Channels and React.

## Features
- User authentication with JWT
- Real-time messaging via WebSockets
- Multiple chat rooms
- Typing indicators
- Online user status
- Browser notifications
- Message history

## Tech Stack
**Backend:**
- Django 5.0
- Django REST Framework
- Django Channels
- Redis (for WebSocket channel layer)
- SQLite

**Frontend:**
- React (Vite)
- React Router
- Axios

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- Redis server

### Backend Setup

1. Create and activate virtual environment:
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run migrations:
```bash
cd livechat
python manage.py makemigrations
python manage.py migrate
```

4. Create superuser (optional):
```bash
python manage.py createsuperuser
```

5. Start Redis server (in separate terminal):
```bash
redis-server
```

6. Run Django server:
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

## Usage

1. Open `http://localhost:5173` in your browser
2. Register a new account or login
3. Create a new chat room or join existing one
4. Start chatting in real-time!

## API Endpoints

- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `GET /api/auth/rooms/` - Get all rooms
- `POST /api/auth/rooms/` - Create new room
- `GET /api/auth/rooms/{id}/` - Get room details
- `GET /api/auth/rooms/{id}/messages/` - Get room messages

## WebSocket

- `ws://localhost:8000/ws/chat/{room_name}/?token={jwt_token}` - Connect to chat room

## Project Structure

```
.
├── livechat/           # Django backend
│   ├── chat/          # Chat app
│   │   ├── models.py  # Room and Message models
│   │   ├── views.py   # REST API views
│   │   ├── consumers.py # WebSocket consumers
│   │   └── routing.py # WebSocket routing
│   └── livechat/      # Project settings
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/     # Login, Register, RoomList, ChatRoom
│   │   ├── context/   # AuthContext
│   │   └── services/  # API service
└── requirements.txt
```

## License

MIT
