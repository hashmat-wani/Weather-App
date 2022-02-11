let info_text = document.querySelector(".info-text");
let wrapper = document.querySelector(".wrapper");
let inputField = document.querySelector("input");
function currentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("No");
  }
}
function onSuccess(position) {
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=metric&appid=${apiKey}`;
  fetch(api)
    .then((response) => response.json())
    .then((result) =>
      fetchData(result.name, result.coord.lat, result.coord.lon)
    );
}
function onError(error) {
  info_text.innerText = error.message;
  info_text.classList.add("error");
}

let apiKey = "77fb1235129972e882908d03c654623d";
inputField.addEventListener("keypress", (e) => {
  info_text.classList.remove("error");
  if (e.key == "Enter" && inputField.value.trim() != "") {
    let cityapi = `https://api.openweathermap.org/data/2.5/weather?q=${inputField.value}&units=metric&appid=${apiKey}`;
    fetch(cityapi)
      .then((response) => response.json())
      .then((result) => {
        if (result.cod == "404") {
          info_text.innerText = result.message;
          info_text.classList.add("error");
        } else fetchData(result.name, result.coord.lat, result.coord.lon);
      });
  }
});
function fetchData(city, lat, lon) {
  info_text.innerText = "Getting weather details...";
  info_text.classList.add("pending");

  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&units=metric&appid=${apiKey}`;
  fetch(api)
    .then((response) => response.json())
    .then((result) => displayWeather(result, city));
}
function displayWeather(info, city) {
  info_text.classList.remove("pending", "error");
  wrapper.classList.add("active");
  let currentWeatherContainer = document.querySelector(".current-weather");
  currentWeatherContainer.innerHTML = null;
  let id = info.current.weather[0].id;
  wIcon = document.createElement("img");
  if (id == 800) {
    wIcon.src = "icons/clear.svg";
  } else if (id >= 200 && id <= 232) {
    wIcon.src = "icons/storm.svg";
  } else if (id >= 600 && id <= 622) {
    wIcon.src = "icons/snow.svg";
  } else if (id >= 701 && id <= 781) {
    wIcon.src = "icons/haze.svg";
  } else if (id >= 801 && id <= 804) {
    wIcon.src = "icons/cloud.svg";
  } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
    wIcon.src = "icons/rain.svg";
  }
  temp = document.createElement("h1");
  temp.innerHTML = `${Math.round(info.current.temp)}<span>°</span> C`;
  description = document.createElement("p");
  description.textContent = info.current.weather[0].description;
  description.classList.add("description");
  loc = document.createElement("p");
  loc.classList.add("location");
  loc.innerHTML = `<i class="fa-solid fa-location-dot"></i>&nbsp${city}`;

  bottomdetails = document.createElement("div");
  bottomdetails.classList.add("bottomDetails");

  columnFeels = document.createElement("div");
  columnFeels.innerHTML = `<i class="fa-solid fa-temperature-full"></i>`;

  tempDiv = document.createElement("div");
  feeltemp = document.createElement("p");
  feeltemp.innerHTML = `${Math.round(info.current.feels_like)}° C`;
  tempmessage = document.createElement("p");
  tempmessage.textContent = "Feels Like";
  tempDiv.append(feeltemp, tempmessage);
  columnFeels.append(tempDiv);

  columnHumidity = document.createElement("div");
  columnHumidity.innerHTML = `<i class="fa-solid fa-droplet"></i>`;
  humidityDiv = document.createElement("div");
  humidity = document.createElement("p");
  humidity.innerHTML = `${Math.round(info.current.humidity)}%`;
  humiditymessage = document.createElement("p");
  humiditymessage.textContent = "Humidity";
  humidityDiv.append(humidity, humiditymessage);
  columnHumidity.append(humidityDiv);

  bottomdetails.append(columnFeels, columnHumidity);
  currentWeatherContainer.append(wIcon, temp, description, loc, bottomdetails);
}
let arrowBack = document.querySelector(".fa-arrow-left");
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
});
