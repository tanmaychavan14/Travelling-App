import React, { useEffect, useState } from 'react';
import { openDB } from 'idb';

const Attractions = ({ query }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      setLoading(true);
      
      try {
        // Open IndexedDB
        const db = await openDB('AttractionsDB', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('attractions')) {
              db.createObjectStore('attractions', { keyPath: 'query' });
            }
          },
        });

        // Check if data exists in IndexedDB
        const cachedData = await db.get('attractions', query);

        if (cachedData) {
          console.log('Data loaded from IndexedDB');
          setLocations(cachedData.locations);
          setLoading(false);
          return;
        }

        // Fetch data from API
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
          console.error('Token not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/fetch-attractions?query=${query}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (response.status === 401) {
          const data = await response.json();
          if (data.message === "Unauthorized") {
            console.error('Unauthorized User: Please log in again');
            setLocations([]);
            setLoading(false);
            return;
          }
        }

        const data = await response.json();

        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setLocations(data.data);

          // Store data in IndexedDB
          await db.put('attractions', { query, locations: data.data });
          console.log('Data saved to IndexedDB');
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLocations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAttractions();
  }, [query]);

  return (
    <div>
      <ul>
        {loading ? (
          <p>Loading...</p>
        ) : locations.length > 0 ? (
          locations.map((location, index) => (
            <li key={index}>{location.name}</li>
          ))
        ) : (
          <p>No attractions found for "{query}"</p>
        )}
      </ul>
    </div>
  );
};

export default Attractions;
