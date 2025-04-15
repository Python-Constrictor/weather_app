import axios from "axios"

export function getweather(lat, lon, timezone){
    //https://api.open-meteo.com/v1/forecast?daily=weather_code,temperature_2m_max,apparent_temperature_max,precipitation_sum,temperature_2m_min,apparent_temperature_min&hourly=temperature_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m&current_weather=true&timeformat=unixtime&latitude=52.52&longitude=13.41
    console.log(lat);
    console.log("asdf");
    console.log(lon);
    return axios.get(
        "https://api.open-meteo.com/v1/forecast?daily=weather_code,temperature_2m_max,precipitation_sum,apparent_temperature_max,precipitation_sum,temperature_2m_min,apparent_temperature_min&hourly=temperature_2m,apparent_temperature,weather_code,precipitation,wind_speed_10m,precipitation_probability&current_weather=true&timeformat=unixtime", {
            params:{
                latitude: lat,
                longitude: lon,
                timezone,
            }
        }
    )
    .then(({ data }) =>{
        return{
            data: data,
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data)
        }
    })
        
}

function parseCurrentWeather({current_weather, daily}){
    const { 
        temperature: currentTemp, 
        windspeed: windSpeed, 
        weathercode: iconCode
    } = current_weather
    const{
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFeelsLike],
        apparent_temperature_min: [minFeelsLike],
        precipitation_sum: [precip],
    } = daily
    return {
        currentTemp: currentTemp,
        highTemp: maxTemp,
        lowTemp: minTemp,
        highFeelsLike: maxFeelsLike,
        lowFeelsLike: minFeelsLike,
        windSpeed: windSpeed,
        precip: precip,
        iconCode,
    }
}
  

function parseDailyWeather({daily}){
    return daily.time.map((time,index) =>{
        return{
            timestamp: time*1000,
            iconCode: daily.weather_code[index],
            maxTemp: daily.temperature_2m_max[index],
            maxTemp: daily.temperature_2m_max[index],
            precipitation: daily.precipitation_sum[index]
        }
    })
}

function parseHourlyWeather({hourly, current_weather}){
    return hourly.time.map((time,index) => {
        return{
            timestamp: time*1000,
            iconCode: hourly.weather_code[index],
            temp: hourly.temperature_2m[index],
            feelsLike: hourly.apparent_temperature[index],
            windSpeed: hourly.wind_speed_10m[index],
            precip: hourly.precipitation[index],
            precip_chance: hourly.precipitation_probability[index]
        }
    }).filter(({timestamp}) => timestamp >= current_weather.time * 1000)

}