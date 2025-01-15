import sunny from '../assets/images/sunny.png'
import rainy from '../assets/images/rainy.png'
import cloudy from '../assets/images/cloudy.png'
import snowy from '../assets/images/snowy.png'
import loadingGif from '../assets/images/loading.gif'
import { useState, useEffect } from 'react'


const WeatherApp = () => {
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [loading, setLoading] = useState(false)
    const appId = import.meta.env.VITE_WEATHER_API_KEY

    useEffect(() => {
        const fetchDefaultWeather = async() => {
            setLoading(true)
            const defaultLocation = 'Depok'
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${defaultLocation}&units=Metric&appid=${appId}`
            const res = await fetch(url)
            const defaultData = await res.json()
            setData(defaultData)
            setLoading(false)
        }

        fetchDefaultWeather()
    }, [])

    const handleInputChange = (e) => {
        setLocation(e.target.value)
    }

    const search = async() => {
        if(location.trim() !== '') {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${appId}`
            const res = await fetch(url)
            const searchData = await res.json()
            if(searchData.cod !== 200) {
                setData({notFound: true})
            } else {             
                setData(searchData)
                setLocation('')
            }
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter') {
            search()
        }
    }

    const weatherImages = {
        Clear: sunny,
        Rain: rainy,
        Clouds: cloudy,
        Snow: snowy,
        Haze: cloudy,
        Mist: cloudy,
    }

    const weatherImage = data.weather ? weatherImages[data.weather[0].main] : null

    const backgroundImages = {
        Clear: 'linear-gradient(to right, #f3b07c, #fcd283)',
        Rain: 'linear-gradient(to right, #5bc8fb, #80eaff)',
        Clouds: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Snow: 'linear-gradient(to right, #aff2ff, #ffffff)',
        Haze: 'linear-gradient(to right, #57d6d4, #71eeec)',
        Mist: 'linear-gradient(to right, #57d6d4, #71eeec)',
    }

    const backgroundImage = data.weather ? backgroundImages[data.weather[0].main] : 'linear-gradient(to right, #f3b07c, #fcd283)'

    const currentDate = new Date()

    const daysofWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const dayofWeek = daysofWeek[currentDate.getDay()]
    const month = months[currentDate.getMonth()]
    const dayofMonth = currentDate.getDate()

    const formattedDate = `${dayofWeek}, ${dayofMonth} ${month}`

  return (
    <div className="container" style={{ backgroundImage }}>
        <div className="weather-app" style={{ backgroundImage: backgroundImage && backgroundImage.replace ? backgroundImage.replace('to right', 'to top') : null }}>
            <div className="search">
                <div className="search-top">
                    <i className="fa-solid fa-location-dot"></i>
                    <div className="location">{data.name}</div>
                </div>
                <div className="search-bar">
                    <input type="text" 
                    placeholder="Enter Location" 
                    value={location} 
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown} />
                    <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
                </div>
            </div>
            {loading ? (<img className="loader" src={loadingGif} alt='loading' />)
            : data.notFound ? (<div className="not-found">Not Found 🙄</div>) : (
                <>
                <div className="weather">
                <img src={weatherImage} alt="sunny" />
                <div className="weather-type">{data.weather ? data.weather[0].main : null}</div>
                <div className="temp">{data.main ? `${Math.floor(data.main.temp)}°` : null}</div>
            </div>
            <div className="weather-date">
                <p>{formattedDate}</p>
            </div>
            <div className="weather-data">
                <div className="humidity">
                    <div className="data-name">Humidity</div>
                    <i className="fa-solid fa-droplet"></i>
                    <div className="data">{data.main ? data.main.humidity : null}%</div>
                </div>
                <div className="wind">
                    <div className="data-name">Wind</div>
                    <i className="fa-solid fa-wind"></i>
                    <div className="data">{data.wind ? data.wind.speed : null} km/h</div>
                </div>
            </div></>
            )}            
        </div>    
    </div>
  )
}

export default WeatherApp