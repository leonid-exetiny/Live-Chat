import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { roomAPI } from '../services/api';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      setError('Failed to load rooms');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoomName.trim()) return;

    try {
      await roomAPI.createRoom(newRoomName);
      setNewRoomName('');
      fetchRooms();
    } catch (error) {
      setError('Failed to create room');
    }
  };

  const handleJoinRoom = (roomName) => {
    navigate(`/chat/${roomName}`);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Chat Rooms</h2>
        <div>
          <span style={{ marginRight: '15px' }}>Welcome, {user?.username}</span>
          <button onClick={logout} style={{ padding: '5px 15px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleCreateRoom} style={{ marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="New room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          style={{ padding: '10px', width: '70%', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
          Create Room
        </button>
      </form>

      <div>
        <h3>Available Rooms</h3>
        {rooms.length === 0 ? (
          <p>No rooms available. Create one!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {rooms.map((room) => (
              <li
                key={room.id}
                style={{
                  padding: '15px',
                  marginBottom: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <strong>{room.name}</strong>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    Created by {room.created_by.username}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinRoom(room.name)}
                  style={{ padding: '8px 15px', cursor: 'pointer' }}
                >
                  Join
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RoomList;
