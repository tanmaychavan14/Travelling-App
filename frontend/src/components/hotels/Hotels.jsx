import React, { useEffect, useState, useCallback } from "react";
import { openDB } from "idb";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../hotels/hotel.css';

export default function Hotels({ query }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null); // Track selected location for map centering
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [zoomedImage, setZoomedImage] = useState(null); // Image for zooming
  const [, setImageLoading] = useState(false);

  const initDB = async () => {
    return await openDB("TravelData", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("hotels")) {
          db.createObjectStore("hotels", { keyPath: "query" });
        }
      },
    });
  };

  const saveToIndexedDB = useCallback(async (query, data) => {
    const db = await initDB();
    const tx = db.transaction("hotels", "readwrite");
    tx.objectStore("hotels").put({ query, data });
    await tx.done;
  }, []);

  const getFromIndexedDB = useCallback(async (query) => {
    const db = await initDB();
    const tx = db.transaction("hotels", "readonly");
    return await tx.objectStore("hotels").get(query);
  }, []);

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
  }, [query, saveToIndexedDB, getFromIndexedDB]);

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

  // Function to handle rating filter change from slider
  const handleRatingChange = (event) => {
    setMinRating(Number(event.target.value));
  };

  // Filter the hotels based on the selected minimum rating
  const filteredLocations = locations.filter((location) => location.rating >= minRating);

  // Function to handle marker click, update selected location and map center
  const handleMarkerClick = (location) => {
    setSelectedLocation(location); // Set the selected location
  };

  // Custom icon for the markers
  const hotelIcon = new Icon({
    iconUrl: '/images/download1.png',
    iconSize: [30, 30],
  });

  // MapUpdater component to shift map center dynamically
  function MapUpdater() {
    const map = useMap();

    useEffect(() => {
      if (selectedLocation) {
        const { latitude, longitude } = selectedLocation;
        if (latitude && longitude) {
          map.setView([parseFloat(latitude), parseFloat(longitude)], 13);
        }
      }
    }, [ map]);

    return null;
  }

  // Open the modal and set the image for zooming
  const handleImageClick = (imageUrl) => {
    setZoomedImage(imageUrl);
    setIsModalOpen(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZoomedImage(null);
  };

  const handleImageLoad = () => {
    setImageLoading(false); // Image loaded, stop showing loading indicator
  };

  const handleImageError = (e) => {
    e.target.src = "/images/restaurant.png"; // Fallback image on error
    setImageLoading(false); // Stop loading indicator
  };

  return (
    <div>
      <div className="rating-filter">
        <label htmlFor="rating">Minimum Rating: </label>
        <input 
          type="range" 
          id="rating" 
          min="1" 
          max="5" 
          value={minRating} 
          onChange={handleRatingChange}
          step="0.1"
        />
        <span>{minRating} Stars</span>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredLocations.length > 0 ? (
        <div className="hotel-grid">
          {filteredLocations.map((location, index) => (
            <div key={index} className="hotel-card">
              <img 
                src={location.photo?.images?.large?.url || "/images/restaurant.png"} 
                alt={location.name || 'Restaurant image'} 
                className="restaurant-image" 
                onClick={() => handleImageClick(location.photo?.images?.original?.url)} 
                onLoad={handleImageLoad} 
                onError={handleImageError} 
              />
              <div className="hotel-info">
                <h3>{location.name}</h3>
                <p>{location.location_string}</p>
                <div className="rating">{renderStars(location.rating)}</div>
                <p><strong>Rating: </strong>{location.rating} ({location.num_reviews} reviews)</p>
                <p className="price"><strong>Price: </strong>{location.price_level} {location.price}</p>
                {location.ranking && <p className="hotel-ranking"><strong>Ranking: </strong>{location.ranking}</p>}
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

      <div style={{ height: "400px", marginTop: "20px" }}>
        <MapContainer center={[12.921432, 100.85973]} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredLocations.map((location, index) => (
            <Marker
              key={index}
              position={[parseFloat(location.latitude), parseFloat(location.longitude)]}
              icon={hotelIcon}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup>
                <strong>{location.name}</strong><br />
                {location.location_string}<br />
                Rating: {location.rating} stars
              </Popup>
            </Marker>
          ))}
          <MapUpdater />
        </MapContainer>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <img
              src={zoomedImage}
              alt="Zoomed"
              className="zoomed-image"
              onClick={handleCloseModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}
