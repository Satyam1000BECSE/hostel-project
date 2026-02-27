import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);

      alert("Registration successful!");
      navigate("/login");   // Go to login page

    } catch (error) {
      alert(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl mb-4 font-bold">Register</h2>

        <input
          placeholder="Name"
          className="border p-2 w-full mb-2"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Email"
          className="border p-2 w-full mb-2"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-2"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="button"
          onClick={handleRegister}
          className="bg-green-500 text-white w-full py-2 rounded"
        >
          Register
        </button>

        <p style={{ marginTop: "10px", textAlign: "center" }}>
  Already have an account?{" "}
  <Link to="/">Login here</Link>
</p>
      </div>
    </div>
  );
}

export default Register;


