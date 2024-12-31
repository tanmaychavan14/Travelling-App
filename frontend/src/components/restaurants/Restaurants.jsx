import React, { useEffect, useState, useCallback } from 'react';
import { openDB } from 'idb';
import "../restaurants/restaurant.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Restaurants = ({ query }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [minRating, setMinRating] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [zoomedImage, setZoomedImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false); // Track loading state of images

  // Open the IndexedDB database
  const openDatabase = useCallback(async () => {
    const db = await openDB('restaurantsDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('restaurants')) {
          db.createObjectStore('restaurants');
        }
      },
    });
    return db;
  }, []);

  // Store data in IndexedDB
  const storeDataInIDB = useCallback(async (data) => {
    const db = await openDatabase();
    const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
    await store.put(data, query); // Use query as key
    console.log('Data stored in IndexedDB');
  }, [openDatabase, query]);

  // Retrieve data from IndexedDB
  const getDataFromIDB = useCallback(async () => {
    const db = await openDatabase();
    const store = db.transaction('restaurants', 'readonly').objectStore('restaurants');
    const data = await store.get(query);
    return data;
  }, [openDatabase, query]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        // Check if data is available in IndexedDB first
        const cachedData = await getDataFromIDB();
        if (cachedData) {
          console.log('Using cached data');
          setLocations(cachedData);
          setLoading(false);
        } else {
          // If no data in IDB, fetch from the API
          const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
          if (!token) {
            setError("Unauthorized : Token Not found")
            setLoading(false);
            return;
          }

          const response = await fetch(`http://localhost:5000/fetch-restaurants?query=${query}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (response.status === 401) {
            console.error("Unauthorized: Please log in again");
            setLoading(false);
            setLocations([]);
            return;
          }

          const data = await response.json();
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            setLocations(data.data);
            // Store the fetched data in IndexedDB for future use
            storeDataInIDB(data.data);
          } else {
            setLocations([]);
          }
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLoading(false);
        setLocations([]);
      }
    };

    fetchRestaurants();
  }, [query, getDataFromIDB, storeDataInIDB]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? "filled" : ""}`}>★</span>
      );
    }
    return stars;
  };

  const handleRatingChange = (event) => {
    setMinRating(Number(event.target.value));
  };

  const filteredLocations = locations.filter((location) => location.rating >= minRating);

  const handleMarkerClick = (location) => {
    setSelectedLocation(location); // Set the selected location
  };

  const handleImageClick = (imageUrl) => {
    setZoomedImage(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setZoomedImage(null);
  };

  const handleImageLoad = () => {
    setImageLoading(false); // Image loaded, stop showing loading indicator
  };

  const handleImageError = (e) => {
    setImageLoading(false); // Image error, stop loading indicator
  };
  
  const hotelIcon = new Icon({
    iconUrl: '/images/restaurant.png',
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
    }, [map]);

    return null;
  }

  return (
    <div className="restaurant-main">
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
        <div className="restaurant-grid">
          {filteredLocations.map((location, index) => (
            <div key={index} className="restaurant-card">
              <img 
                src={location.photo?.images?.large?.url ||"/images/restaurant.png"} 
                alt={location.name || 'Restaurant image'} 
                className="restaurant-image" 
                onClick={() => handleImageClick(location.photo?.images?.original?.url)} 
                onLoad={handleImageLoad} // When the image loads
                onError={handleImageError} // When the image fails to load
              />
              {imageLoading && <div className="loading-overlay">Loading...</div>} {/* Show a loading overlay */}
              <div className="restaurant-info">
                <h3>{location.name}</h3>
                <p>{location.location_string}</p>
                <div className="rating">{renderStars(location.rating)}</div>
                <p><strong>Rating: </strong>{location.rating} ({location.num_reviews} reviews)</p>
                <p className="price"><strong>Price: </strong>{location.price_level} {location.price}</p>
                {location.ranking && <p className="restaurant-ranking"><strong>Ranking: </strong>{location.ranking}</p>}
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
                click: () => handleMarkerClick(location), // Update selected location on click
              }}
            >
              <Popup>
                <strong>{location.name}</strong><br />
                {location.location_string}<br />
                Rating: {location.rating} stars
              </Popup>
            </Marker>
          ))}
          <MapUpdater /> {/* Add this component to handle map updates */}
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
};

export default Restaurants;
