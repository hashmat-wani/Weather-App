let info_text = document.querySelector(".info-text");
let wrapper = document.querySelector(".wrapper");
let inputField = document.querySelector("input");
let track = document.querySelector(".track");
let trackDay = document.querySelector(".trkday");
let trackHour = document.querySelector(".trkhour");
let carousel = document.querySelector(".hourly-carousel");

function currentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser not support geolocation api");
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
  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${apiKey}`;
  fetch(api)
    .then((response) => response.json())
    .then((result) => displayWeather(result, city))
    .catch((err) => {
      info_text.innerText = err;
      info_text.classList.replace("pending", "error");
    });
}
// x = new Date()
// var UTCseconds = (x.getTime() + x.getTimezoneOffset()*60*1000);
// console.log(UTCseconds)

function displayWeather(info, city) {
  info_text.classList.remove("pending", "error");
  let currentWeatherContainer = document.querySelector(".current-weather");
  currentWeatherContainer.innerHTML = null;
  document.querySelector(".bottomDetails").innerHTML = null;
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
  let currenttime = document.createElement("p");
  currenttime.textContent = new Date(info.current.dt * 1000).toLocaleTimeString(
    "en-US",
    { timeZone: info.timezone, hour: "2-digit", minute: "2-digit" }
  );
  currenttime.classList.add("currenttime");
  currentWeatherContainer.append(wIcon, temp, description, loc, currenttime);

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
  document.querySelector(".bottomDetails").append(columnFeels, columnHumidity);
  trackHour.innerHTML = null;
  let timecount = 0;
  info.hourly.forEach((e) => {
    let timestamp = e.dt;
    let curTime = new Date(timestamp * 1000).toLocaleString("en-US", {
      timeZone: info.timezone,
      hour: "2-digit",
    });
    console.log(curTime);
    card = document.createElement("div");
    card.classList.add("card");
    cTime = document.createElement("p");
    if (!timecount) cTime.textContent = "Now";
    else cTime.textContent = curTime;
    icon = document.createElement("img");
    icon.src = `http://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png`;
    hourtemp = document.createElement("p");
    hourtemp.textContent = `${Math.round(e.temp)}° C`;
    card.append(cTime, icon, hourtemp);
    trackHour.append(card);
    timecount++;
  });

  let daycount = 0;
  trackDay.innerHTML = null;
  info.daily.forEach((e) => {
    let daystamp = e.dt;
    let dates = new Date(daystamp * 1000);
    let days = dates.getDay();
    if (!daycount) curDay = days;
    else curDay = "";
    cardDay = document.createElement("div");
    cardDay.classList.add("dayCards");
    cDate = document.createElement("p");
    switch (days) {
      case curDay:
        cDate.textContent = `Today`;
        break;
      case 0:
        cDate.textContent = `Sun`;
        break;
      case 1:
        cDate.textContent = `Mon`;
        break;
      case 2:
        cDate.textContent = `Tue`;
        break;
      case 3:
        cDate.textContent = `Wed`;
        break;
      case 4:
        cDate.textContent = `Thu`;
        break;
      case 5:
        cDate.textContent = `Fri`;
        break;
      case 6:
        cDate.textContent = `Sat`;
        break;
    }
    dayicon = document.createElement("img");
    dayicon.src = `http://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png`;

    minTemp = document.createElement("p");
    minTemp.textContent = `${Math.round(e.temp.min)}° C`;
    minTemp.style.width = "55px";

    bar = document.createElement("div");
    maxTemp = document.createElement("p");
    maxTemp.textContent = `${Math.round(e.temp.max)}° C`;
    maxTemp.style.width = "55px";

    cardDay.append(cDate, dayicon, minTemp, bar, maxTemp);
    trackDay.append(cardDay);
    daycount++;
  });

  document.getElementById(
    "gmap_canvas"
  ).src = `https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  wrapper.classList.add("active");
}
let arrowBack = document.querySelector(".fa-arrow-left");
arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
  inputField.value = "";
});

let moving = false;
let transform = 0;
let mouseLastPos = 0;
let lastPageX = 0;
let transformValue = 0;
const gestureStart = (e) => {
  moving = true;
  mouseLastPos = e.pageX;
  const transformMatrix = window
    .getComputedStyle(track)
    .getPropertyValue("transform");
  if (transformMatrix !== "none") {
    transform = parseInt(transformMatrix.split(",")[4].trim());
  } else transform = 0;
};

const gestureMove = (e) => {
  if (moving) {
    const diff = e.pageX - mouseLastPos;
    if (e.pageX - lastPageX > 0) {
      if (transformValue > 0) {
        return;
      }
    }

    transformValue = transform + diff;
    track.style.transform = `translateX(${transformValue}px)`;
  }
  lastPageX = e.pageX;
};

const gestureEnd = (e) => {
  moving = false;
};

if (window.PointerEvent) {
  track.addEventListener("pointerdown", gestureStart);
  track.addEventListener("pointermove", gestureMove);
  track.addEventListener("pointerup", gestureEnd);
} else {
  track.addEventListener("touchdown", gestureStart);
  track.addEventListener("touchmove", gestureMove);
  track.addEventListener("touchup", gestureEnd);

  track.addEventListener("mousedown", gestureStart);
  track.addEventListener("mousemove", gestureMove);
  track.addEventListener("mouseup", gestureEnd);
}
