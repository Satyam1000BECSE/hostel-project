import { useEffect, useState } from "react";
import api from "../api.js";

function Dashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/rooms")
      .then(res => {
        setRooms(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          🏠 Hostel Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          View and manage available rooms
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-lg text-gray-600">
          Loading rooms...
        </div>
      )}

      {/* Empty State */}
      {!loading && rooms.length === 0 && (
        <div className="text-center text-gray-500 text-lg">
          No rooms available
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Total Rooms</h3>
          <p className="text-2xl font-bold">{rooms.length}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Available</h3>
          <p className="text-2xl font-bold">
            {rooms.filter(r => r.available).length}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-gray-500">Booked</h3>
          <p className="text-2xl font-bold">
            {rooms.filter(r => !r.available).length}
          </p>
        </div>
      </div>


      {/* Rooms Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map(room => (
          <div
            key={room.id}
            className="bg-white rounded-2xl shadow-md p-6 hover:shadow-xl transition duration-300"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Room {room.roomNumber}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium 
                ${room.available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                {room.available ? "Available" : "Booked"}
              </span>
            </div>

            {/* 🖼 Room Image */}
            {room.imageUrl && (
              <img
                src={`/images/${room.imageUrl}`}
                alt="room"
                className="w-full h-48 object-cover rounded"
              />
            )}
            <p className="text-gray-600 mb-4">
              Monthly Rent:
            </p>

            <p className="text-2xl font-bold text-blue-600">
              ₹{room.price}
            </p>

            <button
              className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl transition duration-300"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Dashboard;
