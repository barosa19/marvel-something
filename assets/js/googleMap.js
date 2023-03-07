var googleMapsAPI = 'AIzaSyAaJMDcgb5WJX0pY6sQMJdC4ZNVlyYzZkk'
var zipcode = 34120
var googleURL = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=furniture_store+${zipcode}&key=${googleMapsAPI}&libraries=places`
var bodyEl = document.querySelector('body')
fetch(googleURL)
.then(function (response) {
    return response.json()
})
.then(function (data) {
    console.log(data)
    var listings = data.results
    var firstBusiness = listings[5]
    console.log(firstBusiness)
    var firstName = firstBusiness.name
    bodyEl.innerHTML += `<h1> ${firstName} </h1>`
    console.log(firstBusiness)
    var firstAddress = firstBusiness.formatted_address
    bodyEl.innerHTML += `<h3> ${firstAddress} </h3>`
    var firstImage = firstBusiness.photos[0].photo_reference
    var testPhoto = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${firstImage}&key=${googleMapsAPI}`
    console.log(firstImage)
    bodyEl.innerHTML += `<img src=${testPhoto} />`  

})
function initAutocomplete() {
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -33.8688, lng: 151.2195 },
    zoom: 13,
    mapTypeId: "roadmap",
  });
  // Create the search box and link it to the UI element.
  const input = document.getElementById("pac-input");
  const searchBox = new google.maps.places.SearchBox(input);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // Bias the SearchBox results towards current map's viewport.
  map.addListener("bounds_changed", () => {
    searchBox.setBounds(map.getBounds());
  });

  let markers = [];

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener("places_changed", () => {
    const places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach((marker) => {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    const bounds = new google.maps.LatLngBounds();

    places.forEach((place) => {
      if (!place.geometry || !place.geometry.location) {
        console.log("Returned place contains no geometry");
        return;
      }

      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25),
      };

      // Create a marker for each place.
      markers.push(
        new google.maps.Marker({
          map,
          icon,
          title: place.name,
          position: place.geometry.location,
        })
      );
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}
window.initAutocomplete = initAutocomplete;
