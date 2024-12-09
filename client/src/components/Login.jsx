import React, { useEffect, useState } from "react";
import axios from "axios";
import {  Link, useNavigate } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  


  useEffect(()=>{
    const  checkauth=async()=>{ //----------if user is already login it will not allow to come on login page
    if(token?.length>0){
    try{
      
     const result= await axios.post(`${import.meta.env.VITE_BACKEND_URL}/checktoken`,{},{
      
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
     )
     //console.log(result)
     if(result.status===200){
     navigate('/bookticket')
     }
    
    }catch(err){
      console.log(err)
      
      navigate("/")
      
    }
  }
}
    checkauth()
  },[])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );
      if (result.status === 200) {
        
        sessionStorage.setItem("token", result?.data?.token);
        
        alert("loggin successful! You can now login.");

        navigate("/bookticket");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Error during login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-600">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="on"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full text-black px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          >
            Login
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?
          <Link to="/register" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
