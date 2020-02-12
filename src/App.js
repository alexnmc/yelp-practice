import React, {useState , useEffect} from 'react';
import './App.css';
import axios from 'axios';

const secureAxios = axios.create();

secureAxios.interceptors.request.use((config)=>{
    const token = 'BFTigJ5VgmIzDcvJA0BkLcvt79_HaefrPmW-Vk-fnQibYPOD78DSJsvgdLPQERhztd67rzUg3cclRj2weBTt5eA99ILTLswat78AT-qJ_eC_rxnO5QhxaDxkQWNDXnYx';
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})


function App() {

  const [data , setData] = useState([])
  const [rev , setRev] = useState({})

  useEffect(() => {
    secureAxios.get('https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?limit=5&location=Alpharetta&term=icecream&sort_by=rating').then(res => {
      setData(res.data.businesses)
   
      res.data.businesses.map(item => {
        return secureAxios.get(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${item.id}/reviews`).then(res => {
          setRev({[item.name]: res.data.reviews[0].text , wroteBy: res.data[0].user.name})
        })
      })
    })
  } , [])
  
  
  
  return (
    <div className="App">
      <h2>THE TOP 5 ICE CREAM SHOPS IN ALPHARETTA BY RATING: </h2>
      {data.map(item => {
        return(
          <div key = {item.id}>
            <h3>{item.name}</h3>
            <p>{item.location.address1 + ', ' + item.location.city}</p>
            {rev.map(item => {
              return(
                <div>
                  <p>{item.text}</p>
                  <p>{item.wroteBy}</p>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  );
}

export default App;
