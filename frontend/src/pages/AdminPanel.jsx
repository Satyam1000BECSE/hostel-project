import { useEffect, useState } from "react";
import api from "../api";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  AreaChart, Area,
  XAxis, YAxis, Tooltip,
  CartesianGrid, Legend,
  ResponsiveContainer
} from "recharts";

function AdminPanel() {

  const [summary, setSummary] = useState({});
  const [analytics, setAnalytics] = useState({});
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);



  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const dashboard = await api.get("/admin/dashboard");
      console.log(dashboard);
      setSummary(dashboard.data);

      const analyticsData = await api.get("/admin/analytics", {
        params: { start, end }
      });
      console.log(analyticsData);
      setAnalytics(analyticsData.data);

      // const paymentData = await api.get("/admin/payments");
      const paymentData = await api.get(`/admin/payments?page=${page}&size=10`);
      console.log(paymentData);
      setPayments(paymentData.data.content);
      setTotalPages(paymentData.data.totalPages);


      // console.log(paymentData);
      // setPayments(paymentData.data.content);

    } catch (error) {
      console.error("Admin fetch error:", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ["#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#06b6d4"];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl">
        Loading Dashboard...
      </div>
    );
  }

  const downloadCSV = () => {
    const csv = payments.map(p =>
      `${p.id},${p.user?.email},${p.amount},${p.status},${p.createdAt}`
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-report.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        🚀 Enterprise Admin Dashboard
      </h1>

      {/* ================= DATE FILTER ================= */}
      <div className="flex gap-4 mb-8">
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className="border p-2 rounded-lg"
        />
        <button
          onClick={fetchAllData}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Apply Filter
        </button>

        <button
          onClick={downloadCSV}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          📥 Download CSV
        </button>
      </div>



      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid md:grid-cols-5 gap-6 mb-10">

        {[
          { label: "Total Users", value: summary.totalUsers },
          { label: "Total Bookings", value: summary.totalBookings },
          { label: "Active Rooms", value: summary.activeRooms },
          { label: "Total Revenue", value: `₹${summary.totalRevenue}` },
          { label: "Today Revenue", value: `₹${analytics.todayRevenue}` }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition"
          >
            <h3 className="text-gray-500">{item.label}</h3>
            <p className="text-3xl font-bold mt-2 text-indigo-600">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* ================= REVENUE GROWTH ================= */}
      <div className="bg-white p-6 rounded-2xl shadow mb-10">
        <h3 className="font-bold mb-4 text-lg">📊 Revenue Growth</h3>
        <p className="text-3xl font-bold text-green-600">
          ₹{analytics.revenueGrowth}
        </p>
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-8">

        {/* Revenue By Date */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">📈 Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.revenueByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="1" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Pie */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">📊 Booking Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.bookingStatus}
                dataKey="1"
                nameKey="0"
                outerRadius={100}
              >
                {analytics.bookingStatus?.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">👥 User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="1" stroke="#22c55e" fill="#22c55e" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Users */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">🏆 Top Users</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.topUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="1" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">💰 Revenue by Room Type</h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.revenueByRoomType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="1" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Area Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">📊 Booking Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analytics.bookingTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="0" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="1" stroke="#22c55e" fill="#22c55e" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">🥧 Room Type Distribution</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.bookingByRoomType}
                dataKey="1"
                nameKey="0"
                outerRadius={100}
              >
                {analytics.bookingByRoomType?.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>


      </div>

      {/* ================= TOP ROOMS ================= */}
      <div className="bg-white p-6 rounded-2xl shadow mt-10">
        <h3 className="font-bold mb-4">🏆 Top Booked Rooms</h3>

        <ul>
          {analytics.topRooms?.map((room, index) => (
            <li key={index} className="flex justify-between border-b py-2">
              <span>Room {room[0]}</span>
              <span>{room[1]} bookings</span>
            </li>
          ))}
        </ul>
      </div>


      {/* ================= PAYMENT TABLE ================= */}
      <div className="bg-white p-6 rounded-2xl shadow mt-10">
        <h3 className="font-bold mb-4 text-lg">💳 Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{p.id}</td>
                  <td className="p-2">{p.user?.email}</td>
                  <td className="p-2">₹{p.amount}</td>
                  <td className={`p-2 font-bold ${p.status === "SUCCESS"
                    ? "text-green-600"
                    : p.status === "REFUNDED"
                      ? "text-yellow-600"
                      : "text-red-600"
                    }`}>
                    {p.status}
                  </td>
                  <td className="p-2">{p.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AdminPanel;


