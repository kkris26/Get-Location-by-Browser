function getCurrentLocation() {
  // const options = {
  //   enableHighAccuracy: true,
  //   timeout: 5000,
  //   maximumAge: 0,
  // };

  function success(pos) {
    const crd = pos.coords;

    console.log("Your current position is:");
    const lat = crd.latitude;
    const lon = crd.longitude;
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    getLocationName(lat, lon);
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
    const data = await response.json()
    console.log(response);
    console.log(data);
  } catch (error) {
    console.log("Failed to fetch");
  }
}
