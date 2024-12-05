import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import route from '../../../trainRoute.json';
import { FaArrowLeft } from "react-icons/fa";

function VerifyTicket() {
    const navigate = useNavigate();
    const [source, setSource] = useState('');
    const [destination, setDestination] = useState('');
    const [ticketId,setTicketId]=useState(null)
    const token = sessionStorage.getItem("token");

    const verfiyticket=async()=>{
        try{
          const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verfiyticket`,{
            source,
            destination,
            ticketId
            
        },
        {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })
         console.log(result);
         if(result.status===200){
            alert(result.data.message)
         }
     

        }catch(err){
             alert(err?.response?.data?.message)
         
        }
    }

  return (

    <div className='min-h-screen bg-gray-100'>
        {/* ----------------------------------------Back--button------------------------------ */}
          <div className='flex flex-row '>
            <div className='flex justify-center items-center px-4 py-2 m-4 bg-green-500 rounded-md shadow-lg text-white'>
               <FaArrowLeft />
                <Link to="/bookticket">
                <button>Back</button> </Link>
            </div>
            </div>
            {/* -----------------------------form---------------------------------------------- */}
        <div className='flex flex-col items-center justify-center'>
      <div className="bg-white shadow-md rounded-lg p-6 w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Verfiy Ticket</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Source</h2>
          <select
            value={source}
            onChange={async (e) => {
               setSource(e.target.value)
             
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Source</option>
            {route.map((station, i) => (
              <option key={i} value={station.name}>{station.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Destination</h2>
          <select
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
             
            }}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Destination</option>
            {route.map((station, i) => (
              <option key={i} value={station.name}>{station.name}</option>
            ))}
          </select>
        </div>
        {/* -----------------------Ticket--Id----------------------------------- */}
        <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Ticket ID</h2>
        <input type='text' placeholder='Enter Your Ticket ID:'
         className="w-full p-2 border border-gray-300 rounded-md"
         onChange={(e)=>setTicketId(e.target.value)}
        />
        </div>
        <div>
          <button
            
            onClick={verfiyticket}
            className='my-2 w-full p-2 rounded-md text-white bg-green-500 hover:bg-green-600 '
          >
            Verify
          </button>
        </div>
      </div>
      </div>
      </div>
    
  )
}

export default VerifyTicket