// const userLocation = {
//   userLat: -8.67995199842529,
//   userLon: 115.20281327239643,
// };
const lokasiTarget = {
  targetLat: -8.679946080510842,
  targetLon: 115.2029570922165,
};
let radiusMeter = 50;

function getCurrentLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 60000,
  };

  function success(pos) {
    const crd = pos.coords;
    console.log("Your current position is:");
    const lat = crd.latitude;
    const lon = crd.longitude;
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    getLocationName(lat, lon);
    getWeather(lat, lon);
    displayData(lat, lon);
    validateRadius(lat, lon);
  }

  function error(err) {
    console.log(err);
    document.getElementById("target").innerHTML = `
    <p>${err.message}</p>
    `;
  }

  return navigator.geolocation.getCurrentPosition(success, error, options);
}

window.onload = () => {
  getCurrentLocation();
  // displayData(userLocation.userLat, userLocation.userLon);
  // validateRadius(userLocation.userLat, userLocation.userLon);
};

async function getLocationName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=18&format=jsonv2`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(response);
    console.log(data);
  } catch (error) {
    console.log("Failed to fetch");
  }
}

async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,sunrise,sunset,temperature_2m_max,temperature_2m_min&current=weather_code,is_day,temperature_2m,wind_speed_10m,relative_humidity_2m&timezone=auto`;

  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
}

function validateRadius(lat, lon) {
  document.getElementById("input-radius").value = radiusMeter;
  const meterPerDegree = 111320;

  const radiusDerajat = radiusMeter / meterPerDegree;

  const latDiff = Math.abs(lat - lokasiTarget.targetLat);
  const lngDiff = Math.abs(lon - lokasiTarget.targetLon);
  console.log(radiusDerajat - latDiff);
  console.log(radiusDerajat - lngDiff);

  document.getElementById("selisih").innerHTML = `
  <p id="radius">Radius : ${radiusMeter} M</p>
  <p>Minimum Radius : ${radiusDerajat}</p>
  <p>Selisih Lat : ${latDiff}</p>
  <p>Selisih Lon : ${lngDiff}</p>
  <p>Selisih Lat - Radius : ${radiusDerajat - latDiff}</p>
  <p>Selisih Lon - Radius: ${radiusDerajat - lngDiff}</p>

  `;

  const validate = latDiff <= radiusDerajat && lngDiff <= radiusDerajat;

  document.getElementById("area").innerHTML = `<b> Area : 
  ${
    validate
      ? "Anda berada di Radius Kantor"
      : "Anda berada di luar Radius Kantor"
  }
    </b>
  `;
}

function getCurrentTime() {
  const get = new Date();
  const getHour = get.getHours();
  const getMinute = get.getMinutes();
  const getSecond = get.getSeconds();
  const getMiliSecond = get.getMilliseconds();
  const output = `${getHour} : ${getMinute} : ${getSecond} : ${getMiliSecond} `;
  return output;
}
const timeOnLoad = getCurrentTime();

function displayData(lat, lon) {
  document.getElementById("display").innerHTML = `
<p>Your Position</p>
<p>Latitude : ${lat}</p>
<p>Longitude: ${lon}</p>
<b>ST : ${timeOnLoad}</b>
<b>CT : ${getCurrentTime()}</b>
<hr></hr>
<div id="area"></div>
<div id="selisih"></div>
`;

  document.getElementById("target").innerHTML = `
  <p> Kantor Position</p>
<p>Kantor Latitude : ${lokasiTarget.targetLat}</p>
<p>Kantor Longitude: ${lokasiTarget.targetLon}</p>
  `;

  const formInput = document.getElementById("form-input-radius");
  formInput.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputRadius = document.getElementById("input-radius").value;
    radiusMeter = inputRadius;
    validateRadius(lat, lon);
  });
}
