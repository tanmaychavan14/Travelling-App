import React from 'react'
import { useEffect,useState } from 'react'

const Restaurants = () => {
    const [locations, setLocations]=useState([]);
    const [loading, setLoading]=useState(true);
    useEffect(()=>{
        const fetchrestaurants = async ()=>{
            try{
                const token = document.cookie.split('; ').find(row=> row.startsWith('token='))?.split('=')[1];
            }
            catch(err){
                
            }
        }
    })
  return (
    <div>
      
    </div>
  )
}

export default Restaurants;
