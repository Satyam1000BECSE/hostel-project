import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Booking from "./pages/Booking";
import AdminPanel from "./pages/AdminPanel";
import Payment from "./pages/Payment";
import Layout from "./components/Layout";

import PrivateRoute from "./components/PrivateRoute";
import PaymentHistory from "./pages/PaymentHistory";

import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PRIVATE ROUTES ================= */}

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/rooms"
          element={
            <PrivateRoute>
              <Layout>
                <Rooms />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/booking/:id"
          element={
            <PrivateRoute>
              <Layout>
                <Booking />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/payment/:id"
          element={
            <PrivateRoute>
              <Layout>
                <Payment />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout>
                <AdminPanel />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route path="/payments" element={
          <PrivateRoute>
            <Layout>
              <PaymentHistory />
            </Layout>
          </PrivateRoute>} />

        {/* ================= 404 ROUTE ================= */}
        <Route
          path="*"
          element={
            <h1 className="text-center mt-10 text-2xl">
              404 - Page Not Found
            </h1>
          }
        />




      </Routes>
    </BrowserRouter>
  );
}

export default App;
