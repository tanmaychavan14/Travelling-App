import React, { useEffect, useState } from 'react';
import { openDB } from 'idb';

const Restaurants = ({ query }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Open the IndexedDB database
  const openDatabase = async () => {
    const db = await openDB('restaurantsDB', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('restaurants')) {
          db.createObjectStore('restaurants');
        }
      },
    });
    return db;
  };

  // Store data in IndexedDB
  const storeDataInIDB = async (data) => {
    const db = await openDatabase();
    const store = db.transaction('restaurants', 'readwrite').objectStore('restaurants');
    await store.put(data, query); // Use query as key
    console.log('Data stored in IndexedDB');
  };

  // Retrieve data from IndexedDB
  const getDataFromIDB = async () => {
    const db = await openDatabase();
    const store = db.transaction('restaurants', 'readonly').objectStore('restaurants');
    const data = await store.get(query);
    return data;
  };

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
            console.error("Token not found");
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
  }, [query]);

  return (
    <div>
      <ul>
        {loading ? (
          <p>Loading...</p>  // Show loading message while fetching data
        ) : locations.length > 0 ? (
          locations.map((location, index) => (
            <li key={index}>{location.name}</li>  // Display the location name
          ))
        ) : (
          <p>Results not found</p>  // Show message if no data found
        )}
      </ul>
    </div>
  );
};

export default Restaurants;
