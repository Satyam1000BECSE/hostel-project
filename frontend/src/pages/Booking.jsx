import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { useState } from "react";

function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    try {
      setLoading(true);

      const res = await api.post(`/bookings?roomId=${id}`);

      navigate(`/payment/${res.data.id}`);

    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-200 to-purple-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-96">
        <h2 className="text-2xl font-bold mb-4">Confirm Booking</h2>

        <button
          onClick={handleBooking}
          className="w-full bg-indigo-600 text-white py-2 rounded-xl"
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}

export default Booking;

