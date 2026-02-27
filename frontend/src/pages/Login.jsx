import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // Save JWT token
      const token = res.data.token || res.data;
      localStorage.setItem("token", token);


      alert("Login successful");

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4 font-bold">Login</h2>

        <input
          className="border p-2 w-full mb-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button"
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full py-2 rounded"
        >

          Login
        </button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
  Don't have an account?{" "}
  <Link to="/register">Register here</Link>
</p>
      </div>
    </div>
  );
}

export default Login;
