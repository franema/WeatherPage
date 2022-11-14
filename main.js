const locateUser = (() => {

    //DOM
    const $cityName = document.querySelector(".city")

    //Bind Events
    window.addEventListener("load", getLocation)

    //Functions

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            console.log("Geolocation is not supported by this browser.")
        }
    }

    async function showPosition(position) {
        try {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            getForecast.callForecast(lat, lon)
            const cityResponse = await fetch(`http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&appid=d3dc75c491d9aa2560a56644107046e6`)
            const city = await cityResponse.json()
            $cityName.textContent = city[0].name
        } catch (error) {
            console.log(error)
        }
    }

})()

const getForecast = (() => {

    //DOM
    const $weather = document.querySelector(".weather")
    const $weatherImage = document.querySelector(".weather_image")
    const $currentTemp = document.querySelector(".current_temp")
    const $maxTemp = document.querySelector(".max_temp")
    const $minTemp = document.querySelector(".min_temp")
    const $humidity = document.querySelector(".humidity")
    const $weekDays = document.querySelectorAll(".forecast")

    //Bind Events


    //Funtions
    async function callForecast(lat, lon) {
        try {
            const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=d3dc75c491d9aa2560a56644107046e6&units=metric`)
            const forecastResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=d3dc75c491d9aa2560a56644107046e6&units=metric`)
            const currentWeather = await weatherResponse.json()
            const forecast = await forecastResponse.json()
            showCurrentWeather(currentWeather)
            manageForecast(forecast)
        } catch (error) {
            console.log(error)
        }
    }

    function showCurrentWeather(currentWeather) {
        $weatherImage.src = `http://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`
        $currentTemp.textContent = `Temperature: ${currentWeather.main.temp}°C`
        $maxTemp.textContent = `Max: ${currentWeather.main.temp_max}°C`
        $minTemp.textContent = `Min: ${currentWeather.main.temp_min}°C`
        $humidity.textContent = `Humidity: ${currentWeather.main.humidity}%`
    }

    function manageForecast (forecast) {
        index = 7
        $weekDays.forEach((day) => {
            const date = getDayName(forecast.list[index].dt_txt)
            day.innerHTML = `
            <p>${date}</p>
            <img class="weather_image" src="http://openweathermap.org/img/wn/${forecast.list[index].weather[0].icon}@2x.png">
            <p>Temperature: ${forecast.list[index].main.temp}°C </p>` 
            index += 8
        })
        
    }

    function getDayName (dateStr, locale = "en-US") {
        date = new Date(dateStr)
        return date.toLocaleDateString(locale, {weekday:"long"})
    }

    return { callForecast }
})()


const searchForecast = (() => {

    //DOM
    const button = document.querySelector("button")
    const $cityName = document.querySelector(".city")


    //Bind Events
    button.addEventListener("click", getCoordinates)


    //Functions
    async function getCoordinates() {
        const city = document.querySelector("input").value
        try {
            const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=d3dc75c491d9aa2560a56644107046e6`)
            const coordinatesObj = await response.json()
            getForecast.callForecast(coordinatesObj[0].lat, coordinatesObj[0].lon)
            $cityName.textContent = city
        } catch (error) {
            console.log(error)
        }
    }

})()