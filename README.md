# 💬 Live Chat Application

<div align="center">

![Django](https://img.shields.io/badge/Django-5.0-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-FF6B6B?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A modern, real-time chat application built with Django Channels and React. Features include instant messaging, typing indicators, user presence, and browser notifications.

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Architecture](#-architecture)

</div>

---

## ✨ Features

### Core Functionality
- 🔐 **JWT Authentication** - Secure user registration and login
- 💬 **Real-time Messaging** - Instant message delivery via WebSockets
- 🏠 **Multiple Chat Rooms** - Create and join different conversation spaces
- 📝 **Typing Indicators** - See when other users are typing
- 👥 **Online Status** - Real-time user presence tracking
- 🔔 **Browser Notifications** - Desktop notifications for new messages
- 📜 **Message History** - Persistent message storage and retrieval
- 🎨 **Modern UI** - Clean, responsive interface with smooth animations

### Technical Highlights
- Asynchronous WebSocket handling with Django Channels
- Token-based authentication for WebSocket connections
- Optimized message deduplication
- CORS-enabled REST API
- In-memory channel layer for development
- Production-ready architecture

---

## 🎯 Demo

### Screenshots

**Login Page**
```
Clean authentication interface with form validation
```

**Chat Room**
```
Real-time messaging with typing indicators and timestamps
```

**Room List**
```
Browse and create chat rooms with user counts
```

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.8+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)
- **pip** - Python package manager
- **npm** - Node package manager

### Backend Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd live-chat
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

4. **Navigate to Django project**
```bash
cd livechat
```

5. **Run database migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

6. **Create superuser (optional)**
```bash
python manage.py createsuperuser
```

7. **Start Django development server**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Open new terminal and navigate to frontend**
```bash
cd frontend
```

2. **Install Node dependencies**
```bash
npm install
```

3. **Start React development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 📖 Usage

### Getting Started

1. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`

2. **Create an account**
   - Click "Register" and fill in your details
   - Username, email, and password required

3. **Create or join a room**
   - After login, you'll see the room list
   - Click "Create Room" to start a new conversation
   - Or click "Join" on an existing room

4. **Start chatting**
   - Type your message in the input field
   - Press Enter or click "Send"
   - Messages appear instantly for all users in the room

### Testing Real-time Features

To test real-time functionality:

1. Open the app in two different browser windows (or use incognito mode)
2. Register two different users
3. Join the same chat room with both users
4. Send messages from one user - they appear instantly for the other
5. Start typing to see typing indicators in action

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string"
}

Response: 201 Created
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  },
  "access": "jwt_token",
  "refresh": "refresh_token"
}
```

#### Login User
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "string",
  "password": "string"
}

Response: 200 OK
{
  "user": { ... },
  "access": "jwt_token",
  "refresh": "refresh_token"
}
```

### Room Endpoints

#### List All Rooms
```http
GET /api/auth/rooms/
Authorization: Bearer {access_token}

Response: 200 OK
[
  {
    "id": 1,
    "name": "general",
    "created_by": { ... },
    "created_at": "2026-05-05T10:00:00Z",
    "message_count": 42
  }
]
```

#### Create Room
```http
POST /api/auth/rooms/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "room-name"
}

Response: 201 Created
```

#### Get Room Details
```http
GET /api/auth/rooms/{id}/
Authorization: Bearer {access_token}

Response: 200 OK
{
  "id": 1,
  "name": "general",
  "messages": [ ... ],
  "created_by": { ... }
}
```

#### Get Room Messages
```http
GET /api/auth/rooms/{id}/messages/
Authorization: Bearer {access_token}

Response: 200 OK
[
  {
    "id": 1,
    "user": { ... },
    "content": "Hello!",
    "timestamp": "2026-05-05T10:30:00Z"
  }
]
```

### WebSocket Connection

#### Connect to Chat Room
```
ws://localhost:8000/ws/chat/{room_name}/?token={jwt_access_token}
```

#### Message Format

**Send Message**
```json
{
  "message": "Hello, world!"
}
```

**Send Typing Indicator**
```json
{
  "type": "typing",
  "is_typing": true
}
```

**Receive Message**
```json
{
  "type": "message",
  "message": "Hello, world!",
  "username": "john_doe",
  "user_id": 1
}
```

**Receive Typing Indicator**
```json
{
  "type": "typing",
  "username": "jane_doe",
  "is_typing": true
}
```

**User Join/Leave**
```json
{
  "type": "user_join",
  "username": "new_user"
}
```

---

## 🏗️ Architecture

### Tech Stack

**Backend**
- **Django 5.0** - Web framework
- **Django REST Framework** - REST API
- **Django Channels** - WebSocket support
- **Django CORS Headers** - Cross-origin requests
- **Simple JWT** - JWT authentication
- **Daphne** - ASGI server
- **SQLite** - Database (development)

**Frontend**
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **WebSocket API** - Real-time communication

### Project Structure

```
live-chat/
├── livechat/                 # Django backend
│   ├── chat/                # Chat application
│   │   ├── models.py       # Room & Message models
│   │   ├── views.py        # REST API views
│   │   ├── serializers.py  # DRF serializers
│   │   ├── consumers.py    # WebSocket consumers
│   │   ├── routing.py      # WebSocket URL routing
│   │   ├── middleware.py   # JWT WebSocket auth
│   │   ├── admin.py        # Django admin config
│   │   └── urls.py         # HTTP URL routing
│   ├── livechat/           # Project settings
│   │   ├── settings.py     # Django configuration
│   │   ├── asgi.py         # ASGI configuration
│   │   ├── urls.py         # Main URL routing
│   │   └── wsgi.py         # WSGI configuration
│   └── manage.py           # Django management script
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── RoomList.jsx
│   │   │   └── ChatRoom.jsx
│   │   ├── context/        # React context
│   │   │   └── AuthContext.jsx
│   │   ├── services/       # API services
│   │   │   └── api.js
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
├── requirements.txt         # Python dependencies
├── .gitignore              # Git ignore rules
├── .env.example            # Environment variables template
└── README.md               # This file
```

### Data Models

**User** (Django built-in)
- id: Integer (Primary Key)
- username: String (Unique)
- email: String
- password: String (Hashed)

**Room**
- id: Integer (Primary Key)
- name: String (Unique)
- created_by: ForeignKey(User)
- created_at: DateTime

**Message**
- id: Integer (Primary Key)
- room: ForeignKey(Room)
- user: ForeignKey(User)
- content: Text
- timestamp: DateTime

### WebSocket Flow

```
Client                          Server
  |                               |
  |--- WS Connect (with JWT) ---->|
  |                               |--- Validate Token
  |                               |--- Join Room Group
  |<---- Connection Accepted -----|
  |                               |
  |--- Send Message -------------->|
  |                               |--- Save to DB
  |                               |--- Broadcast to Group
  |<---- Receive Message ---------|
  |                               |
  |--- Typing Indicator --------->|
  |                               |--- Broadcast to Group
  |<---- Typing Status -----------|
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173

# JWT
JWT_ACCESS_TOKEN_LIFETIME=60
JWT_REFRESH_TOKEN_LIFETIME=1440
```

### Production Considerations

For production deployment:

1. **Use Redis for Channel Layer**
   ```python
   CHANNEL_LAYERS = {
       'default': {
           'BACKEND': 'channels_redis.core.RedisChannelLayer',
           'CONFIG': {
               "hosts": [('redis-server', 6379)],
           },
       },
   }
   ```

2. **Use PostgreSQL Database**
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'chatdb',
           'USER': 'chatuser',
           'PASSWORD': 'password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

3. **Set DEBUG=False**
4. **Configure ALLOWED_HOSTS**
5. **Use environment variables for secrets**
6. **Set up HTTPS/WSS**
7. **Configure static file serving**

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are stored correctly
- [ ] Room creation works
- [ ] Room list displays correctly
- [ ] WebSocket connects successfully
- [ ] Messages send and receive in real-time
- [ ] Typing indicators appear
- [ ] Online user count updates
- [ ] Browser notifications work
- [ ] Multiple users can chat simultaneously
- [ ] Messages persist after page refresh
- [ ] Logout clears authentication

### Running Tests

```bash
# Backend tests
cd livechat
python manage.py test

# Frontend tests (if configured)
cd frontend
npm test
```

---

## 🐛 Troubleshooting

### Common Issues

**CORS Error**
```
Solution: Ensure frontend URL is in CORS_ALLOWED_ORIGINS in settings.py
```

**WebSocket Connection Failed**
```
Solution: Check that Django server is running and channel layer is configured
```

**JWT Token Invalid**
```
Solution: Token may be expired. Log out and log back in.
```

**Messages Not Appearing**
```
Solution: Check browser console for WebSocket errors. Ensure both users are in the same room.
```

**Port Already in Use**
```bash
# Kill process on port 8000 (Windows)
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Kill process on port 8000 (macOS/Linux)
lsof -ti:8000 | xargs kill -9
```

---

## 🚀 Deployment

### Heroku Deployment

1. Install Heroku CLI
2. Create Heroku app
3. Add PostgreSQL addon
4. Add Redis addon
5. Configure environment variables
6. Deploy with Git

### Docker Deployment

```dockerfile
# Example Dockerfile
FROM python:3.11
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "livechat.asgi:application"]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourprofile)

---

## 🙏 Acknowledgments

- Django Channels documentation
- React documentation
- WebSocket API documentation
- Community contributors

---

<div align="center">

**[⬆ Back to Top](#-live-chat-application)**

Made with ❤️ using Django and React

</div>

