import { GeoLocation } from "../Imports"
import { isGeoLocation } from "../Imports/TypeGuards"

export const isLocationInPoland = ({ coords: { latitude, longitude } }: GeolocationPosition) => {
  const xMin = 14.116
  const xMax = 24.15

  const yMin = 49
  const yMax = 54.83

  return latitude >= yMin && latitude <= yMax && longitude >= xMin && longitude <= xMax ? 1 : 0
}

// export const displayError() CREATE SHARED COMPONENT (NOT LOCATION ONLY)

export const handleGeoLocationError = () => {
  alert("Wystąpił błąd podczas próby lokalizacji.")
}

export const handleGeoLocationClick = () => {
  if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
    navigator.geolocation.getCurrentPosition(handleGeoLocationSuccess, handleGeoLocationError)
  }
}

// move get position
