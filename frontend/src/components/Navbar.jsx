import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center shadow-lg">

      <h1 className="text-xl font-bold">🏠 Hostel Manager</h1>

      <div className="flex gap-6">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/rooms" className="hover:underline">Rooms</Link>
        <Link to="/admin" className="hover:underline">Admin</Link>
        <Link to="/payments" className="hover:underline">Payment History</Link>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded-lg">
          Logout
        </button>
      </div>

    </div>
  );
}

export default Navbar;


// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <div className="bg-blue-600 text-white p-4 flex justify-between">
//       <h1>Hostel</h1>
//       <div>
//         <Link to="/dashboard" className="mr-4">Dashboard</Link>
//         <Link to="/">Logout</Link>
//       </div>
//     </div>
//   );
// }

// export default Navbar;
