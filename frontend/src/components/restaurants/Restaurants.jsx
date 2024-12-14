import React from 'react'
import { useEffect,useState } from 'react'

const Restaurants = ({query}) => {
    const [locations, setLocations]=useState([]);
    const [loading, setLoading]=useState(true);
    useEffect(()=>{
        const fetchrestaurants = async ()=>{
            try{
                const token = document.cookie.split('; ').find(row=> row.startsWith('token='))?.split('=')[1];

                if(!token){
                  console.error("Token not found R");
                  setLoading(false);
                  return;
                }

                const response = await fetch(`http://localhost:5000/fetch-restaurants?query=${query}`,{
                  headers : {
                    Authorization : `Bearer ${token}`,
                  },
                  credentials : 'include',

                })
                if (response.status === 401){
                  console.error("Unauthorized : Please log in again");
                  setLoading(false);
                  setLocations([]);
                  return;
                }
                const data = await response.json();
                if (data && Array.isArray(data.data)&& data.data.length>0){
                  setLocations(data.data);
                }
                else{
                  setLocations([]);
                }
            }
            catch(error){
              console.error('error fetching locations :', error);
              setLoading(false);
              setLocations([]);
                
            }
            setLoading(false);
        };
        fetchrestaurants();

    },[query]);
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
  )
}

export default Restaurants;
