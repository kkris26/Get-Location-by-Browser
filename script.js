function getCurrentLocation() {
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
  }

  function error(err) {
    console.log(err);
  }

  return navigator.geolocation.getCurrentPosition(success, error);
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
