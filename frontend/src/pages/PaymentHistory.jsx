import { useEffect, useState } from "react";
import api from "../api";

function PaymentHistory() {

  const [payments, setPayments] = useState([]);

  useEffect(() => {
    api.get("/payments/history")
       .then(res => setPayments(res.data));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>

      <table className="w-full bg-white shadow rounded-xl">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3">Booking ID</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id} className="text-center border-b">
              <td className="p-3">{payment.booking?.id}</td>
              <td className="p-3">₹{payment.amount}</td>
              <td className="p-3">{payment.status}</td>
              <td className="p-3">
                {new Date(payment.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default PaymentHistory;
