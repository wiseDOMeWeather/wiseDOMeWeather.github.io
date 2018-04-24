/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DomNodeCollection = __webpack_require__(1);
const weather = __webpack_require__(2);

var callbacks = [];
var domLoaded = false;

window.$w = arg => {
  switch(typeof(arg)){
    case "string":
       return selectNodes(arg);
    case "function":
      return handleFunction(arg);
    case "object":
      if(arg instanceof HTMLElement){
        return new DomNodeCollection([arg]);
      }
  }
};

$w.extend = (...objects) => {
  return Object.assign({}, ...objects);
};

$w.ajax = inputObject => {
  const newRequest = new XMLHttpRequest();
  const defaults = {
    contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
    method: "GET",
    url: "",
    success: () => {},
    error: () => {},
    data: {},
  };
  inputObject = $w.extend(defaults, inputObject);
  inputObject.method = inputObject.method.toUpperCase();
  if (inputObject.method === "GET" && isntEmpty(inputObject.data)){
    inputObject.url += "?" + buildQueryString(inputObject.data);
  }

  newRequest.open(inputObject.method, inputObject.url, true);
  newRequest.onload = () => {
    if (newRequest.status === 200) {
      inputObject.success(newRequest.response);
    } else {
      inputObject.error(newRequest.response);
    }
  };

  newRequest.send();
};

buildQueryString = obj => {
  let result = "";
  let objKeys = Object.keys(obj);
  objKeys.forEach(key => {
    result += key + "=" + obj[key] + "&";
  });
    result = result.split("");
    result.pop();
    return result.join("");
  };

isntEmpty = obj => {
  return Object.keys(obj).length !== 0;
}

handleFunction = callback => {
  if (domLoaded === true){
    callback();
  } else {
    callbacks.push(callback);
  }
};

selectNodes = selector => {
  let nodes = document.querySelectorAll(selector);
  let arrayOfNodes = Array.from(nodes);

  return new DomNodeCollection(arrayOfNodes);
};

document.onreadystatechange = () => {
  if (document.readyState === "interactive") {
    domLoaded = true;
    callbacks.forEach(callback => callback());
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DomNodeCollection {

  constructor(elements) {
    this.elements = elements;
  };

  value(val) {
    if (val === undefined) {
      return this.elements[0].value;
    } else {
      this.elements.forEach(el => {
        el.value = val;
      });
    }
  };

  html(content) {
    if (typeof(content) === "string") {
      this.elements.forEach(el => {
        el.innerHTML = content;
      });
    } else if (this.elements.length > 0) {
      return this.elements[0].innerHTML;
    };

    return null;
  };

  empty() {
    this.html("");
  };

  append(arg) {
      if (typeof arg === 'object' &&
          !(arg instanceof DomNodeCollection)) {
        arg = $w(arg);
      };

      if (typeof arg === "string") {
        this.elements.forEach(el => el.innerHTML += arg);
      } else if (arg instanceof DomNodeCollection) {
        this.elements.forEach(el => {
          arg.forEach(childNode => {
            el.appendChild(childNode.cloneNode(true));
          });
        });
      };
    };

    addClass(klass) {
      this.elements.forEach(el => {
        const currentClasses = el.className;
        const newClasses = currentClasses + " " + klass;
        el.className = newClasses;
      });
    };

    removeClass(klass) {
      this.elements.forEach(el => {
        el.classList.remove(klass);
      });
    };

    attr(attrName, value = null) {
      if (value === null) {
        return this.elements[0].getAttribute(attrName);
      } else {
        this.elements.forEach(el => {
          el.setAttribute(attrName, value);
        });

        return this.elements;
      };
    };


    children() {
      let children = [];
      this.elements.forEach (el => {
        for (let i = 0; i < el.children.length; i++) {
        children.push(el.children[i]);
        };
      });

      return new DomNodeCollection(children);
    };

    parent() {
      let parents = [];
      this.elements.forEach(el => {
        for (let i = 0; i < el.parents.length; i++) {
          parents.push(el.parents[i]);
        };
      });

      return new DomNodeCollection(parents);
    };

    find(selector) {
      const nodes = [];
      this.elements.forEach(el => {
        nextEl = el.querySelectorAll(selector);
        nodes = nodes.concat(Array.from(nextEl));
      });

      return new DomNodeCollection(nodes);
    };

    remove() {
      this.elements.forEach(el => el.parentNode.removeChild(el));
    };

    on(eventName, callback) {
     this.elements.forEach(obj => {
       obj.addEventListener(eventName, callback);
       const eventKey = `wiseDOMEvents-${eventName}`;
       if (typeof obj[eventKey] === "undefined") {
         obj[eventKey] = [];
       }
       obj[eventKey].push(callback);
     });
   };

   off(eventName) {
     this.elements.forEach(obj => {
       const eventKey = `wiseDOMEvents-${eventName}`;
       if (obj[eventKey]) {
         obj[eventKey].forEach(callback => {
           obj.removeEventListener(eventName, callback);
         });
       };
       obj[eventKey] = [];
     });
   };

};

module.exports = DomNodeCollection;


/***/ }),
/* 2 */
/***/ (function(module, exports) {

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


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map
