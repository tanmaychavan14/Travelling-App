import React, { useEffect, useState } from 'react';

export default function Hotels({ query }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
  const [error, setError] = useState(null); // Add error state

  

  // Fetch hotels when the component mounts
  useEffect(() => {
    // Guard clause to prevent unnecessary request if query is invalid
    if (!query) {
      setError('Query parameter is required');
      setLoading(false);
      return;
    }
  
    const fetchHotels = async () => {
      if (loading) {
        console.log("Loading hotels...");
        try {
          const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
          console.log("Token:", token);
  
          if (!token) {
            console.error('Token not found H');
            setError('Unauthorized: Token not found');
            setLoading(false);
            return;
          }
  
          const response = await fetch(`http://localhost:5000/fetch-hotels?query=${query}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: 'include', // Ensure cookies are sent
          });
  
          if (response.status == 401) {
            console.error('Unauthorized: Please log in again.');
            setError('Unauthorized: Please log in again');
            setLocations([]); // Clear locations on 401 error
            return;
          }
  
          const data = await response.json();
          if (data && Array.isArray(data.data) && data.data.length > 0) {
            setLocations(data.data);
          } else {
            setLocations([]); // No hotels found
          }
        } catch (error) {
          console.error('Error fetching hotels:', error);
          setError('Error fetching data');
        }
        setLoading(false);
      }
    };
  
    fetchHotels();
  }, [query]);  // Trigger effect on query change
  

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
