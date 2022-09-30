let autocomplete;
const regForm = document.querySelector(".reg-form");
const fullAddress = document.querySelector(".full-address");
const locDetails = document.querySelectorAll(".loc-detail");

window.onload = initAutocomplete();

autocomplete.addListener("place_changed", placeChosen);

function initAutocomplete() {
  const locInput = document.querySelector(".loc-input");
  autocomplete = new google.maps.places.Autocomplete(locInput);
}

// When autocomplete suggestion is chosen, get the google place information and 
// populate form fields with this info.
function placeChosen() {
  const place = autocomplete.getPlace();

  const foundPlace = "address_components" in place;
  if (foundPlace) {
    const thisPlace = getPlaceDetails(place);
    populateForm(thisPlace);
  };
};

// Populate form fields with some visibile and some hidden place info.
function populateForm(thisPlace) {
  locDetails.forEach(locDetail => locDetail.value = "");

  for (let detail in thisPlace) {
    if (detail === "fullAddress") {
      fullAddress.innerHTML = "";

      for (let i = 0; i < thisPlace[detail].length; i++) {
        const addressLineInput = document.createElement("input");
        addressLineInput.classList.add("fully-hidden");
        addressLineInput.value = thisPlace[detail][i].long_name;
        addressLineInput.setAttribute("name", `fullAddress${i}`);
        fullAddress.appendChild(addressLineInput);
      };
    }

    else {
      const formInput = document.querySelector(`[name="${detail}"]`);
      formInput.value = thisPlace[detail];
    };
  };
}

// Create my own place object from the Google place object.
function getPlaceDetails(place) {
  const thisPlace = {
    formattedAddress: place.formatted_address,
    fullAddress: place.address_components,
    googlePlaceId: place.place_id,
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng()
  };
  
  let [countryAlreadySet, placeNameAlreadySet] = [false, false];

  for (let addressLine of thisPlace.fullAddress) {
    const lineInclCountry = addressLine.types.includes("country");
    const lineInclPlaceName = addressLine.types.includes("political");

    if (lineInclCountry && !countryAlreadySet) {
      thisPlace.countryShort = addressLine.short_name;
      thisPlace.countryLong = addressLine.long_name;
      countryAlreadySet = true;
    };

    if (lineInclPlaceName && !placeNameAlreadySet) {
      thisPlace.placeName = addressLine.long_name;
      placeNameAlreadySet = true;
    };
  };

  return thisPlace;
}