import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";

function Payment() {
  const { id } = useParams();   // bookingId from URL
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   const script = document.createElement("script");
  //   script.src = "https://checkout.razorpay.com/v1/checkout.js";
  //   script.async = true;
  //   document.body.appendChild(script);
  // }, []);

  const handlePayment = async () => {
  try {
    setLoading(true);

    await api.post(`/payments/${id}`);

    alert("Payment Successful");
    navigate("/dashboard");

  } catch (err) {
    alert(err.response?.data || "Payment failed");
  } finally {
    setLoading(false);
  }
};


  // const handlePayment = async () => {
  //   try {
  //     setLoading(true);

  //     // ✅ use id instead of bookingId
  //     const res = await api.post(`/payments/create-order/${id}`);
  //     const orderId = res.data;

  //     const options = {
  //       key: "YOUR_KEY",
  //       amount: 50000,
  //       currency: "INR",
  //       order_id: orderId,

  //       handler: function (response) {
  //         verifyPayment(response);
  //       }
  //     };

  //     const rzp = new window.Razorpay(options);
  //     rzp.open();

  //   } catch (err) {
  //     alert("Payment failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const verifyPayment = async (response) => {
  await api.post("/payments/verify", {
    ...response,
    bookingId: id   // ✅ MUST SEND
  });

  alert("Payment Successful");
  navigate("/dashboard");
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-200 to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>

        <button
          onClick={handlePayment}
          className="w-full bg-green-600 text-white py-2 rounded-xl"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
}

export default Payment;


