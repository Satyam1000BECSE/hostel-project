import { useNavigate } from "react-router-dom";

function RoomCard({ room }) {
  const navigate = useNavigate();

  const handleBooking = () => {
    navigate(`/booking/${room.id}`);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden">

      {/* 🖼 Room Image */}
      {room.imageUrl && (
        <img
          src={`/images/${room.imageUrl}`}
          alt="room"
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Room {room.roomNumber}
          </h2>

          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold
            ${
              room.available
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {room.available ? "Available" : "Booked"}
          </span>
        </div>

        {/* Room Type & Floor */}
        <p className="text-gray-500 text-sm">
          {room.roomType} • Floor {room.floor}
        </p>

        {/* Capacity */}
        <p className="text-gray-500 text-sm mt-1">
          Capacity: {room.capacity} Person
        </p>

        {/* Description */}
        {room.description && (
          <p className="text-gray-600 mt-3 text-sm line-clamp-3">
            {room.description}
          </p>
        )}

        {/* Price */}
        <div className="mt-4">
          <p className="text-gray-500 text-sm">Monthly Rent</p>
          <p className="text-2xl font-bold text-indigo-600">
            ₹{room.price}
          </p>
        </div>

        {/* Booking Button */}
        {room.available && (
          <button
            onClick={handleBooking}
            className="mt-5 w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 rounded-xl hover:opacity-90 transition duration-300"
          >
            Book Now
          </button>
        )}
      </div>
    </div>
  );
}

export default RoomCard;






