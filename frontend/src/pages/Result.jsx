import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Hotels from '../components/hotels/Hotels';
import Attractions from '../components/attractions/Attractions';
import Restaurants from '../components/restaurants/Restaurants';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook to navigate programmatically
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  // State to manage which tab/content is selected
  const [activeTab, setActiveTab] = useState('hotels');

  if (!query) {
    return (
      <div>
        <h1>No query provided</h1>
        <p>Please provide a valid query parameter in the URL.</p>
      </div>
    );
  }

  const goback = () => {
    navigate('/'); // Navigate to home page
  };

  return (
    <div>
      <button onClick={goback}>Go Back</button>
      <h1>Results for: {query}</h1>

      {/* Buttons to switch between tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button 
          className={`px-4 py-2 ${activeTab === 'hotels' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('hotels')}
        >
          Hotels
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'restaurants' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'attractions' ? 'bg-orange-600 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('attractions')}
        >
          Attractions
        </button>
      </div>

      {/* Content displayed based on the active tab */}
      <div>
        {activeTab === 'hotels' && (
          <div>
            <h3>Hotels</h3>
            <Hotels query={query} />
          </div>
        )}

        {activeTab === 'restaurants' && (
          <div>
            <h3>Restaurants</h3>
            <Restaurants query={query} />
          </div>
        )}

        {activeTab === 'attractions' && (
          <div>
            <h3>Attractions</h3>
            <Attractions query={query} />
          </div>
        )}
      </div>
    </div>
  );
}
