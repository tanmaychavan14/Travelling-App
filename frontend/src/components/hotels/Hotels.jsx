import React, { useEffect, useState } from "react";
import { openDB } from "idb";
import '../hotels/hotel.css';

export default function Hotels({ query }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initDB = async () => {
    return await openDB("TravelData", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("hotels")) {
          db.createObjectStore("hotels", { keyPath: "query" });
        }
      },
    });
  };

  const saveToIndexedDB = async (query, data) => {
    const db = await initDB();
    const tx = db.transaction("hotels", "readwrite");
    tx.objectStore("hotels").put({ query, data });
    await tx.done;
  };

  const getFromIndexedDB = async (query) => {
    const db = await initDB();
    const tx = db.transaction("hotels", "readonly");
    return await tx.objectStore("hotels").get(query);
  };

  useEffect(() => {
    const fetchHotels = async () => {
      if (!query) {
        setError("Query parameter is required");
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const cachedData = await getFromIndexedDB(query);
        if (cachedData) {
          console.log("Data loaded from IndexedDB");
          setLocations(cachedData.data);
          setLoading(false);
          return;
        }

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

  // Function to render the star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? "filled" : ""}`}>★</span>
      );
    }
    return stars;
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : locations.length > 0 ? (
        <div className="hotel-grid">
          {locations.map((location, index) => (
            <div key={index} className="hotel-card">
              <img src={location.photo?.images?.large?.url} alt={location.name} className="hotel-image" />
              <div className="hotel-info">
                <h3>{location.name}</h3>
                <p>{location.location_string}</p>
                <div className="rating">{renderStars(location.rating)}</div>
                <p><strong>Rating: </strong>{location.rating} ({location.num_reviews} reviews)</p>
                <p className="price"><strong>Price: </strong>{location.price_level} {location.price}</p>
                {/* <p><strong>Distance: </strong>{location.distance ? `${location.distance.toFixed(2)} km` : 'N/A'}</p> */}
                {location.ranking && <p className="hotel-ranking"><strong>Ranking: </strong>{location.ranking}</p>}
                {location.special_offers && <p className="special-offers">Special Offers Available</p>}
                <a href={`https://www.tripadvisor.com/Hotel_Review-${location.location_id}`} target="_blank" rel="noopener noreferrer">
                  View Details & Book
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}
