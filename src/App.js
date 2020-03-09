import React, {Component} from 'react';
import './App.css';
import axios from 'axios';

const secureAxios = axios.create();

secureAxios.interceptors.request.use((config)=>{
    const token = "4clAzzrV-XBIeuLbBt6RPF-Kd6iVuRJ-BvQIl0icXpTc2SLUyE-xz0C8WZHynz2QMvnPX4RMi1dq_u-3rPni4u4mb9eQl0tcsrVC2eZm86e3e_097ZWokQ1es0xEXnYx"
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

class App extends Component {
  constructor(props){
    super(props)
      this.state = {
        number: 5,
        shops: [],
        reviews: [],
        loading:"off"
      }
  }

  componentDidMount(){
      this.getData()
    }

  getData = () => {
    this.setState({loading:"on", shops: [], reviews: []})
      secureAxios.get(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?limit=${this.state.number}&location=Alpharetta&term=icecream&sort_by=rating`).then(res => {
        let shops = res.data.businesses
        this.setState({shops: shops})
        for (let i = 0; i < shops.length; i++) {
          ((i) => {
            setTimeout(() => {
              console.log('timer')
              return secureAxios.get(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${res.data.businesses[i].id}/reviews`).then(response => {
                let arr = [...this.state.reviews]
                arr.push({id: response.data.reviews[0].id, restaurant: shops[i].name, review: response.data.reviews[0].text, wroteBy: response.data.reviews[0].user.name})
                  this.setState({reviews: arr}, () => {
                    if(this.state.reviews.length > 1){
                      this.setState({loading:"off"})
                    }
                  })
              }).catch(err => console.log(err)) 
            }, 200 * i)
          })(i)
        }  
      })
    }

    handleChange = (e) => {
        const {name, value} = e.target
        this.setState({
          [name]: value
        })
    }

  render(){
    const iceCreamShops = () => this.state.shops.map(item => {
      return(
        <div key = {item.id}  style = {{width: '500px' , margi: 'auto'}}>
          <h3 style = {{marginBottom: '5px' , marginTop: '25pt'}}>{item.name}</h3>
          <img alt = '' src = {item.image_url}   style = {{height:'200px' , with:'200px'}}/>
          <p style = {{fontSize: '12px', fontWeight: '600'}}>{item.location.address1 + ', ' + item.location.city}</p>
          <div>
            {this.state.reviews.map(item2 => {
              if(item.name === item2.restaurant){
                return(
                  <div key = {item2.id}>
                    <p style = {{color: 'blue'}}>"{item2.review}"</p>
                    <p style={{fontWeight: '600'}}>- {item2.wroteBy}</p>
                  </div>
                )
              }else{
                return null
              }
            })
            }
          </div>
        </div>
      )
    })
      return (
        <div className="App">
          <h2>THE TOP 
            <input
              onBlur = {this.getData}
              onChange = {this.handleChange}
              name = 'number'
              value = {this.state.number}
             /> 
            ICE CREAM SHOPS IN ALPHARETTA (BY YELP RATING): </h2>
          {this.state.loading === "off" ? 
            iceCreamShops()
            :
            <div style = {{color: 'green'}}>Loading...</div>
          }
        </div>
      )
    };
}

export default App
