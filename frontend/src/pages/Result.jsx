// Result.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Hotels from '../components/hotels/Hotels';
import Attractions from '../components/attractions/Attractions';
import Restaurants from '../components/restaurants/Restaurants';

export default function Result() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  if (!query) {
    return (
      <div>
        <h1>No query provided</h1>
        <p>Please provide a valid query parameter in the URL.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Results for: {query}</h1>
      <div>
        <Hotels query={query} />
      
        <Restaurants query={query}/>
        <Attractions query={query} />
      </div>
    </div>
  );
}
