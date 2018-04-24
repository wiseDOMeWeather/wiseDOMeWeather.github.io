var autocomplete;

document.addEventListener("DOMContentLoaded", () => {
 let options = {
  types: ['(cities)'],
 };
   let input = document.getElementById('autocomplete');
   autocomplete = new google.maps.places.Autocomplete(input, options);

   let submit = document.getElementById("search-button");
   window.$w(submit).on("click", searchSubmit);
   requestWeather(51.5074, 0.1278);
   setDayAndTime();
});

function searchSubmit(e) {
  e.preventDefault();
  let addressObj = autocomplete.getPlace();
  let cityName = addressObj.formatted_address;
  let lat = addressObj.geometry.location.lat();
  let lon = addressObj.geometry.location.lng();
  window.$w('.city-name').html(cityName);
  setDayAndTime();
  requestWeather(lat, lon);
}

function requestWeather(lat, lon) {
  let inputObject = {
    method: "GET",
    url: "https://api.openweathermap.org/data/2.5/weather",
    success: completedSuccessfully,
    error: requestErrors,
    data: { lat: lat, lon: lon, APPID: "d870581228ff719b22b6b72c5003ed57", units: "imperial" }
  }

  window.$w.ajax(inputObject);
}

function setDayAndTime() {
  let time;
  let date = new Date();
  let day = dayToString(date.getDay());
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes.toString().length < 2) { minutes = "0" + minutes };
  if (hours === 0) {
    time = 12 + ":" + minutes + "AM";
  } else if (hours > 12) {
    time = (hours % 12) + ":" + minutes + "PM";
  } else {
    time = hours + ":" + minutes + "AM";
  }
  window.$w('.day').html(day);
  window.$w('#time').html(time);
}

function dayToString(dayInt) {
  switch(dayInt) {
    case 1:
      return "Monday";
    case 2:
      return "Tuesday";
    case 3:
      return "Wednesday";
    case 4:
      return "Thursday";
    case 5:
      return "Friday";
    case 6:
      return "Saturday";
    case 0:
      return "Sunday";
    default:
      return "unknown";
  }
}

function completedSuccessfully(weatherString) {
  let percipitation = 0;
  let weatherObj = JSON.parse(weatherString);
  let cityName = weatherObj;
  let country = weatherObj.sys.country;
  let temperature = Math.floor(weatherObj.main.temp);
  let weather = weatherObj.weather[0].main;
  let day = weatherObj.weather[0].icon.split("").pop() === "d";
  let wind = Math.floor(weatherObj.wind.speed).toString();
  let humidity = weatherObj.main.humidity.toString();
  window.$w('.temp').html(temperature.toString());
  window.$w('.wind').html("Wind:" + " " + wind + " " + "mph");
  window.$w('.humidity').html("Humidity:" + " " + humidity + "%");
  window.$w('.search').value("");
  descriptionConditional(weather.toLowerCase(), day);
}

function descriptionConditional(description, day) {
  let image = document.getElementById("weather-icon");
  let weatherDesc;
  if (description ===  "clear sky" || description === "clear") {
       image.src = day ?  "./assets/images/if_sun.png" : "./assets/images/if_moon.png";
       weatherDesc = "Skies are clear";
   } else if (description === "few clouds") {
       image.src = day ? "./assets/images/if_sun_simple_cloudy.png" : "./assets/images/if_moon_cloudy.png";
       weatherDesc = "Partly cloudy";
   } else if (description === "scattered clouds" || description === "broken clouds" || description === "clouds") {
       weatherDesc = "Scattered clouds";
     image.src = day ? "./assets/images/if_sun_simple_cloudy.png" : "./assets/images/if_moon_cloudy.png";
   } else if (description === "rain" || description === "light rain" || description === "shower rain") {
       image.src = day ? "./assets/images/if_sun_simple_rain.png" : "./assets/images/if_moon_rain.png";
       weatherDesc = "It's raining :(";
   } else if (description === "thunderstorm") {
       image.src = "./assets/images/thunder_storm.png";
       weatherDesc = "Thunderstorms!"
   } else if (description === "snow") {
       image.src = day ? "./assets/images/if_sun_simple_cloudy_snow.png" : "./assets/images/if_moon_cloudy_snow.png";
   } else if (description === "mist" || description === "fog" || description === "haze") {
       image.src = day ? "./assets/images/if_sun_simple_cloudy.png" : "./assets/images/if_moon_cloudy.png";
       weatherDesc = "Foggy, misty and hazy";
   } else {
     image.src = "./assets/images/if_sun.png"
   }

   window.$w('.description').html(weatherDesc);

}

function requestErrors(errors) {
  alert("Request failed, please try again.");
}
