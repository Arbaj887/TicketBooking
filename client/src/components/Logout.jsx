import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const logout = async () => {
    try {
      const result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (result.status === 200) {
        sessionStorage.clear();
        navigate("/");
      }
    } catch (err) {}
  };
  return (
    <div
      className=" bg-red-500 hover:bg-red-600 text-white m-4 px-4 py-2 rounded-md shadow-lg cursor-pointer"
      onClick={logout}
    >
      <button>Logout</button>
    </div>
  );
}

export default Logout;
