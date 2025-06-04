function getCurrentLocation() {
  const options = {
    enableHighAccuracy: false,
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
  }

  function error(err) {
    console.log(err);
  }

  return navigator.geolocation.getCurrentPosition(success, error, options);
}

getCurrentLocation();

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
const get = new Date();
const getHour = get.getHours();
const getMinute = get.getMinutes();
const getSecond = get.getSeconds();
function displayData(lat, lon) {
  const now = new Date();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();
  const nowSecond = now.getSeconds();
  document.getElementById("display").innerHTML = `
<p>Current Position</p>
<b>Start Time : ${getHour} : ${getMinute} :: ${getSecond} </b>
<b>Current Time : ${nowHour} : ${nowMinute} :: ${nowSecond}</b>
<p>Latitude : ${lat}</p>
<p>Longitude: ${lon}</p>
<b id="area">Area: ${lon}</b>
<div id="selisih"> ${lon}</div>
`;

  const lokasiTarget = {
    targetLat: -8.679946080510842,
    targetLon: 115.2029570922165,
  };

  document.getElementById("target").innerHTML = `
  <p> Kantor Position</p>
<p>Kantor Latitude : ${lokasiTarget.targetLat}</p>
<p>Kantor Longitude: ${lokasiTarget.targetLon}</p>
  `;

  const radiusMeter = 50;
  const meterPerDegree = 111320;

  const radiusDerajat = radiusMeter / meterPerDegree;

  const latDiff = Math.abs(lat - lokasiTarget.targetLat);
  const lngDiff = Math.abs(lon - lokasiTarget.targetLon);
  console.log(radiusDerajat - latDiff);
  console.log(radiusDerajat - lngDiff);

  document.getElementById("selisih").innerHTML = `
  <p>Radius : ${radiusMeter} M</p>
  <p>Minimum Radius : ${radiusDerajat}</p>
  <p>Selisih Lat : ${latDiff}</p>
  <p>Selisih Lon : ${lngDiff}</p>
  <p>Selisih Lat - Radius : ${radiusDerajat - latDiff}</p>
  <p>Selisih Lon - Radius: ${radiusDerajat - lngDiff}</p>

  `;

  const validate = latDiff <= radiusDerajat && lngDiff <= radiusDerajat;

  document.getElementById("area").innerText = `
  ${
    validate
      ? "Anda berada di Radius Kantor"
      : "Anda berada di luar Radius Kantor"
  }
  `;
}
