import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import route from "../../../trainRoute.json";
import Logout from "./Logout";
import TicketList from "./TicketList";

function BookTicket() {
  document.title = "Book Ticket";
  const navigate = useNavigate();
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [destinationStation, setDestinationStation] = useState([]);
  const [price, setPrice] = useState(null);
  const [routes, setRoutes] = useState(null);
  const [showHam, setShowHam] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const authUser  = async () => {
      if (!token) {
        return navigate("/");
      }
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/checktoken`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        sessionStorage.setItem("token", "");
        navigate("/");
      }
    };

    authUser ();
  }, [token, navigate]);
//------------------------------------------------------------------------------------------------------------
  const setDestinationOption = (e) => {
    e.preventDefault();
    const selectedSource = e.target.value; 
    const filteredRoute = route.find((stat) => stat.name === selectedSource); 
    setDestinationStation(filteredRoute ? filteredRoute.station : []); // Set the destination stations or an empty array
  };
//---------------------------------------------------------------------------------------------------------
  const defineRoute = () => {
    if (source === "") {
      alert("Please Select the source Location");
      return;
    }
    if (source === destination) {
      setPrice(null);
      return;
    }
    if (source !== "" && destination !== "") {
      const from = route.find((station) => station.name === source);
      const to = destination;

      if (from) {
        setRoutes(from.station.slice(0, from.station.indexOf(to) + 1));
        const index = from.station.indexOf(to) + 1;
        if (index !== -1) {
          const value = index * 5;
          setPrice(value);
        } else {
          setPrice(null); // Destination not found in the source's station list
        }
      }
    }
  };
//------------------------------------------------------------------------------------------------------
  const buyTicket = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/bookticket`,
        {
          source,
          destination,
          price,
          routes,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(`Ticket purchased from ${source} to ${destination} for ₹${price}`);
      setSource("");
      setDestination("");
      setPrice(null);
      setDestinationStation([]); } catch (error) {
      console.error("Error purchasing ticket:", error);
      alert("There was an error purchasing the ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };
//--------------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex justify-between">
        <div className="">
          {showHam ? (
            <TicketList
              showHam={showHam}
              setShowHam={setShowHam}
              buyTicket={buyTicket}
            />
          ) : (
            <RxHamburgerMenu
              onClick={() => setShowHam(!showHam)}
              className="text-2xl m-4 cursor-pointer"
            />
          )}
        </div>
        <div className="flex flex-row justify-center items-center">
          <Link to="/verfiyticket">
            <button className="bg-green-500 py-2 px-4 m-4 text-white rounded-md shadow-lg">
              Verify Ticket
            </button>
          </Link>
          <Logout />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-6 w-96">
          <h1 className="text-2xl font-bold mb-4 text-center">Book Ticket</h1>
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Source</h2>
            <select
              value={source}
              onChange={(e) => {
                setSource(e.target.value);
                setDestinationOption(e);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500"
            >
              <option value="">Select Source</option>
              {route.map((station, i) => (
                <option key={i} value={station.name}>
                  {station.name}
                </option>
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
              className="w-full p-2 border border-gray-300 rounded-md focus:border-blue-500"
            >
              <option value="">Select Destination</option>
              {destinationStation.length > 0 ? (
                destinationStation.map((station, i) => (
                  <option key={i} value={station}>
                    {station}
                  </option>
                ))
              ) : (
                ""
              )}
            </select>
          </div>
          {price !== null && (
            <div className="mb-4">
              <p className="text-lg font-semibold">Price: ₹{price}</p>
            </div>
          )}

          <div>
            <button
              onClick={defineRoute}
              className="my-2 w-full p-2 rounded-md text-white bg-green-500 hover:bg-green-600 cursor-pointer"
            >
              Get Price
            </button>
          </div>
          <div>
            <button
              onClick={buyTicket}
              disabled={loading || price === null}
              className={`my-2 w-full p-2 rounded-md text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : price !== null
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Processing..." : "Buy Ticket"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookTicket;