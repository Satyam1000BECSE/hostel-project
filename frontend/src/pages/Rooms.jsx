import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import RoomCard from "../components/RoomCard";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";




function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {

  const socket = new SockJS("https://hostel-project-yplz.onrender.com/ws");

  const stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000,
  });

  stompClient.onConnect = () => {
    stompClient.subscribe("/topic/rooms", (message) => {
      const updatedRoom = JSON.parse(message.body);

      setRooms(prev =>
        prev.map(room =>
          room.id === updatedRoom.id ? updatedRoom : room
        )
      );
    });
  };

  stompClient.activate();

  return () => stompClient.deactivate();

}, []);


  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
      setFilteredRooms(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Filter logic
  useEffect(() => {
    const filtered = rooms.filter(room =>
      room.roomNumber.toString().includes(search)
    );
    setFilteredRooms(filtered);
  }, [search, rooms]);

  // 🚀 Enter Key → Open booking if exact match
  const handleEnter = (e) => {
    if (e.key === "Enter") {
      const exactRoom = rooms.find(
        room => room.roomNumber.toString() === search
      );

      if (exactRoom) {
        navigate(`/booking/${exactRoom.id}`);
      } else {
        alert("Room not found");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-purple-100 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🏠 Available Rooms
        </h1>
        <p className="text-gray-500 mt-2">
          Browse and book your hostel room
        </p>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search room number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleEnter}
        className="mb-6 w-full md:w-1/3 px-4 py-2 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Loading */}
      {loading && (
        <div className="text-center text-lg text-gray-600">
          Loading rooms...
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredRooms.length === 0 && (
        <div className="text-center text-gray-500 text-lg">
          No rooms found
        </div>
      )}

      {/* Rooms Grid */}
      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            onClick={() => navigate(`/booking/${room.id}`)}
            className="cursor-pointer"
          >
            <RoomCard room={room} />
          </div>
        ))}
      </div>

    </div>
  );
}

export default Rooms;
