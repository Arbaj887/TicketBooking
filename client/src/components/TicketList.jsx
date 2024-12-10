import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


function TicketList({ showHam, setShowHam, buyTicket }) {
  const [userTicket, setUserTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const result = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/ticketlist`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (result.status === 200) {
          setUserTicket(result.data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [token, buyTicket]);

  if (loading) {
    return <h1 className="text-center text-xl">Loading...</h1>;
  }

  if (error) {
    return <h1 className="text-center text-red-500">Error: {error}</h1>;
  }

  const convertToPDF = (e,i) => {
    e.preventDefault()
    
    const targetElement = document.getElementById(i);
    
      targetElement.removeChild(targetElement.lastElementChild); //removing last element button download so it not display on ticket
      
    if (targetElement) {
      
      html2canvas(targetElement, {
        logging: true,
        useCORS: true
      }).then((canvas) => {
        const imgData = canvas.toDataURL('img/png');
        
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        pdf.addImage(imgData, 'PNG', 0, 0);
        
        pdf.save('Ticket.pdf');
      });
    }
    
  };

  return (
    <div className="absolute w-full min-h-screen bg-gray-600 bg-opacity-50">
    <div 
      className=" bg-white flex flex-col  h-screen overflow-auto md:w-[30%] w-[90%] rounded-xl shadow-xl">
      <div className=" border-b border-gray-500  ">
        <RxCross1
          className="float-end m-4 text-xl cursor-pointer hover:text-rose-500"
          onClick={() => setShowHam(!showHam)}
        />
      </div>
      <div className="w-full text-center my-2 px-4">
        <h1 className="text-2xl text-slate-600">Ticket Purchase</h1>
      </div>
      <div className="max-w-4xl mx-auto p-4">
        {userTicket.map((ticket,i) => (
          <div id={i}
            key={i}
            className="bg-white shadow-l5 rounded-lg p-6 mb-4 border-l-4 border-blue-500 transform transition-transform hover:scale-105"
          >
            <h1 className="text-lg font-bold text-gray-600">
              Ticket ID:{" "}
              <span className="font-normal text-gray-500">{ticket._id}</span>
            </h1>
            <h1 className="text-lg font-bold text-gray-600">
              Date:{" "}
              <span className="font-normal text-gray-500">
                {new Date(ticket.createdAt).toDateString()}
              </span>
            </h1>
            <h1 className="text-lg font-bold text-gray-600">
              Time:{" "}
              <span className="font-normal text-gray-500">
                {new Date(ticket.createdAt).toLocaleTimeString()}
              </span>
            </h1>
            <h1 className="text-lg font-bold text-gray-600">
              Use Before:{" "}
              <span className="font-normal text-gray-500">
                {new Date(ticket.expAt).toLocaleTimeString()} 
                
              </span>
            </h1>
            <h1 className="text-lg font-bold text-gray-600">
              From:{" "}
              <span className="font-normal text-gray-500">{ticket.source}</span>
            </h1>
            <h1 className="text-lg font-bold text-gray-600">
              To:{" "}
              <span className="font-normal text-gray-500">
                {ticket.destination}
              </span>
            </h1>
            <h1 className="text-lg font-bold text-gray-600">
              Price:{" "}
              <span className="font-normal text-gray-500">₹{ticket.price}</span>
              <span className="font-normal">
                <img src={ticket.QR} alt="QR Code" className="size-32 mt-1 " />
              </span>
            </h1>
            {/* <a href={ticket.QR} download="Ticket QR" 
            className="text-green-500"
            >Download</a> */}
          <button className="bg-green-600 text-white py-2 px-4 my-4 rounded-lg shadow-lg"
          onClick={(e)=>convertToPDF(e,i)}
          >Download Ticket</button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}

export default TicketList;
