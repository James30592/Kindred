// Used by the autocomplete when registering a new user both on register page 
// manually and in admin route on backend.

// Create my own place object from the Google place object.
export function getPlaceDetails(place, autoInput = true) {
  const thisPlace = {
    formattedAddress: place.formatted_address,
    fullAddress: place.address_components,
    googlePlaceId: place.place_id
  };

  const latLngDetails = thisPlace.lat = place.geometry.location;

  [thisPlace.lat, thisPlace.lng] = autoInput ? 
    [latLngDetails.lat(), latLngDetails.lng()] : 
    [latLngDetails.lat, latLngDetails.lng]
  
  let [countryAlreadySet, placeNameAlreadySet] = [false, false];

  // Get the country and place name.
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