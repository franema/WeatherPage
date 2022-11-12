async function getCoordinates () {
    const city = document.querySelector("input").value
    try {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=d3dc75c491d9aa2560a56644107046e6`)
        const coordinatesObj = await response.json()
        callForecast(coordinatesObj[0].lat, coordinatesObj[0].lon)
    } catch (error) {
        console.log(error)
    }
}

async function callForecast (lat, lon) {
    try {
        const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d3dc75c491d9aa2560a56644107046e6&units=metric`)
        const forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=d3dc75c491d9aa2560a56644107046e6&units=metric`)
        const currentWeather = await weatherResponse.json()
        const forecast = await forecastResponse.json()
        manageForecast(currentWeather, forecast) 
    } catch (error) {
        console.log(console.error())
    }
}

function manageForecast (currentWeather, forecast) {
    const $currentTemp = document.querySelector(".current_temp")
    const $maxTemp = document.querySelector(".max_temp")
    const $minTemp = document.querySelector(".min_temp")
    const $weather = document.querySelector(".weather")
    const $humidity = document.querySelector(".humidity")

    console.log(forecast)

    $weather.textContent = `Weather: ${currentWeather.weather[0].main}`
    $currentTemp.textContent = `Temperature: ${currentWeather.main.temp}°C`
    $maxTemp.textContent = `Max: ${currentWeather.main.temp_max}°C`
    $minTemp.textContent = `Min: ${currentWeather.main.temp_min}°C`
    $humidity.textContent = `Humidity: ${currentWeather.main.humidity}%`
}

const button = document.querySelector("button")
button.addEventListener("click", getCoordinates)
