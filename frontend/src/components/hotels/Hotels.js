// Hotels.js
import React, { useEffect, useState } from 'react';

export default function Hotels({ query }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);  // Add loading state
console.log(query)
  // Fetch locations when the component mounts
  useEffect(() => {
    // console.log("Query parameter:", query);

    const fetchhotels = async () => {
      try {
        console.log(document.cookie)
        const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];


      

    
        if (!token) {
          console.error('Token not found');
          console.log("token not found")
          setLoading(false);  // Stop loading if no token is found
          return;
        }
         
        const response = await fetch(`http://localhost:5000/fetch-hotels?query=${query}`, {
          headers: {
              Authorization: `Bearer ${token}`,  // Ensure token is being sent in headers
          },
          credentials: 'include',  // This ensures cookies are sent with the request
      });
      
    
        if (response.status === 401) {
          console.error('Unauthorized: Please log in again.');
          setLoading(false); // Stop loading on unauthorized error
          setLocations([]);  // Clear locations
          return;
        }
    
        const data = await response.json(); // Parse the JSON response
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          setLocations(data.data);
        } else {
          setLocations([]); // No data found
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        setLoading(false); // Stop loading in case of error
        setLocations([]); // Set to empty in case of error
      }
      setLoading(false); // Stop loading once data is fetched
    };

    // Call the fetchLocations function
    fetchhotels();

  }, [query]);  // Re-run the effect when the query changes

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
}
