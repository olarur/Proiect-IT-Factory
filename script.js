let weather = {
    "apiKey": "36a2567472b78ff22356454bfd8acc4f",
    fetchWeather: async function(city) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            this.displayWeather(data);
        } catch (error) {
            console.error(city + " not found.");
            alert(city + " not found.");
        }
    },  

    displayWeather: function (data) {
        console.log(data);
        const { name, sys } = data;
        const { country } = sys;
        const { icon, description } = data.weather[0];
        const { temp, temp_min, temp_max, feels_like, humidity } = data.main;
        const { speed } = data.wind;
        const { all } = data.clouds;
        const sunriseTimestamp = data.sys.sunrise;
        const sunsetTimestamp = data.sys.sunset;
        const sunriseDate = new Date(sunriseTimestamp * 1000);
        const sunsetDate = new Date(sunsetTimestamp * 1000);
        const sunriseHours = sunriseDate.getHours();
        const sunriseMinutes = sunriseDate.getMinutes();
        const sunriseSeconds = sunriseDate.getSeconds();
        const sunsetHours = sunsetDate.getHours();
        const sunsetMinutes = sunsetDate.getMinutes();
        const sunsetSeconds = sunsetDate.getSeconds();
        const sunriseSecondsDisplay = sunriseSeconds < 10 ? '0' + sunriseSeconds : sunriseSeconds;
        const sunsetSecondsDisplay = sunsetSeconds < 10 ? '0' + sunsetSeconds : sunsetSeconds;
        const sunriseMinutesDisplay = sunriseMinutes < 10 ? '0' + sunriseMinutes : sunriseMinutes;
        const sunsetMinutesDisplay = sunsetMinutes < 10 ? '0' + sunsetMinutes : sunsetMinutes;
        const sunriseHoursDisplay = sunriseHours < 10 ? '0' + sunriseHours : sunriseHours;
        const sunsetHoursDisplay = sunsetHours < 10 ? '0' + sunsetHours : sunsetHours;


        document.querySelector(".city").innerText = "Weather in " + name + ", " + this.convertCountryCode(country);
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/"+ icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp.toFixed(0) + "°C";
        document.querySelector(".temp_min").innerText = "Min: " + temp_min.toFixed(0) + "°C";
        document.querySelector(".temp_max").innerText = "Max: " + temp_max.toFixed(0) + "°C";
        document.querySelector(".feels").innerText = "Feels like: " + feels_like.toFixed(0) + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";
        document.querySelector(".clouds").innerText = "Clouds coverage: " + all + "%";
        document.querySelector(".sunrise").innerText = "Sunrise: " + sunriseHoursDisplay + ":" + sunriseMinutesDisplay + ":" + sunriseSecondsDisplay + " AM";
        document.querySelector(".sunset").innerText = "Sunset: " + sunsetHoursDisplay + ":" + sunsetMinutesDisplay + ":" + sunsetSecondsDisplay + " PM";

        document.querySelector(".weather").classList.remove("loading");
       
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
    convertCountryCode(country) {
        let regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        return regionNames.of(country);
    }
};

document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
},
);

document.querySelector(".search-bar").addEventListener("keyup", function (event){
    if (event.key == "Enter") {
        weather.search();
    }
},
);

weather.fetchWeather("Sibiu");

document.addEventListener("DOMContentLoaded", function() {
    let checkLocation = confirm("Check weather in your current location?");
    if (checkLocation) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }
});

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${weather.apiKey}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        weather.displayWeather(data);
    })
    .catch(error => {
        console.error("Error fetching weather data:", error);
        alert("Error fetching weather data.");
    });
}

function error() {
    alert("Unable to retrieve your location for weather information.");
}
