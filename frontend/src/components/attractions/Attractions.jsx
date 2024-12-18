import React, { useEffect, useState } from 'react';

const Attractions = ({ query }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
        if (!token) {
          console.error('Token not found A');
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
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        console.log("hellow"+error)
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
