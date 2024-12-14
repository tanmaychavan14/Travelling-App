import React, { useEffect, useState } from 'react';

export default function Hotels({ query }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null); // Add error state

  console.log(query);

  // Fetch hotels when the component mounts
  useEffect(() => {
    // If query is missing, set error and stop loading
    if (!query) {
      setError('Query parameter is required');
      setLoading(false);
      return;
    }

    const fetchHotels = async () => {
      try {
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

        if (!token) {
          console.error('Token not found');
          setError('Unauthorized: Token not found');
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:5000/fetch-hotels?query=${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,  // Ensure token is being sent in headers
          },
          credentials: 'include',  // This ensures cookies are sent with the request
        });

        if (response.status === 401) {
          console.error('Unauthorized User: Please log in again.');
          setError('Unauthorized: Please log in again');
          setLoading(false);
          setLocations([]);  // Clear locations
          return;
        }

        const data = await response.json();
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setLocations(data.data);
        } else {
          setLocations([]);  // No data found
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setError('Error fetching data');
        setLoading(false);
        setLocations([]); // Set to empty in case of error
      }

      setLoading(false);  // Stop loading once data is fetched
    };

    fetchHotels();
  }, [query]);  // Re-run the effect when the query changes

  return (
    <div>
      {loading ? (
        <p>Loading...</p>  // Show loading message while fetching data
      ) : error ? (
        <p>{error}</p>  // Show error message if there's an error
      ) : locations.length > 0 ? (
        <ul>
          {locations.map((location, index) => (
            <li key={index}>{location.name}</li>  // Display the location name
          ))}
        </ul>
      ) : (
        <p>Results not found</p>  // Show message if no data found
      )}
    </div>
  );
}
