import React, { useEffect, useState } from "react";
import { openDB } from "idb";

export default function Hotels({ query }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Initialize IndexedDB
  const initDB = async () => {
    return await openDB("TravelData", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("hotels")) {
          db.createObjectStore("hotels", { keyPath: "query" });
        }
      },
    });
  };

  // Save data to IndexedDB
  const saveToIndexedDB = async (query, data) => {
    const db = await initDB();
    const tx = db.transaction("hotels", "readwrite");
    tx.objectStore("hotels").put({ query, data });
    await tx.done;
  };

  // Get data from IndexedDB
  const getFromIndexedDB = async (query) => {
    const db = await initDB();
    const tx = db.transaction("hotels", "readonly");
    return await tx.objectStore("hotels").get(query);
  };

  // Fetch hotels when the component mounts
  useEffect(() => {
    const fetchHotels = async () => {
      if (!query) {
        setError("Query parameter is required");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        // Check IndexedDB first
        const cachedData = await getFromIndexedDB(query);
        if (cachedData) {
          console.log("Data loaded from IndexedDB");
          setLocations(cachedData.data);
          setLoading(false);
          return;
        }

        // If not found in IndexedDB, fetch from the server
        const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];
        if (!token) {
          setError("Unauthorized: Token not found");
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/fetch-hotels?query=${query}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (response.status === 401) {
          setError("Unauthorized: Please log in again");
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data && Array.isArray(data.data)) {
          setLocations(data.data);

          // Save the data to IndexedDB
          saveToIndexedDB(query, data.data);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("Error fetching hotels:", error);
        setError("Error fetching data");
      }

      setLoading(false);
    };

    fetchHotels();
  }, [query]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : locations.length > 0 ? (
        <ul>
          {locations.map((location, index) => (
            <li key={index}>{location.name}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
