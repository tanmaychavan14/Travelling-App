// Result.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Hotels from '../components/hotels/Hotels';// Import the Hotels component

export default function Result() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const [loading, setLoading] = useState(true);  // Add loading state

  // Check if query is extracted correctly
  useEffect(() => {
    console.log("Query parameter:", query);
    setLoading(false); // Stop loading once query is extracted
  }, [query]);

  return (
    <div>
      <h1>Results for: {query}</h1>
      {loading ? (
        <p>Loading...</p>  // Show loading message while extracting query
      ) : (
        <Hotels query={query} />  // Use Hotels component and pass query as a prop
      )}
    </div>
  );
}
