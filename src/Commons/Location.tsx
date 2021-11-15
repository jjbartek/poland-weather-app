import { Coords } from "../Imports"

export const isLocationInPoland = (latitude: number, longitude: number): boolean => {
  return latitude >= Coords.POLAND_LATITUDE_MIN &&
    latitude <= Coords.POLAND_LATITUDE_MAX &&
    longitude >= Coords.POLAND_LONGITUDE_MIN &&
    longitude <= Coords.POLAND_LONGITUDE_MAX
    ? true
    : false
}

export const getMapPosition = (longitude: number, latitude: number): { x: number; y: number } => {
  const xLength = Coords.POLAND_LONGITUDE_MAX - Coords.POLAND_LONGITUDE_MIN
  const yLength = Coords.POLAND_LATITUDE_MAX - Coords.POLAND_LATITUDE_MIN

  const posX = ((longitude - Coords.POLAND_LONGITUDE_MIN) / xLength) * 100
  const posY = ((latitude - Coords.POLAND_LATITUDE_MIN) / yLength) * 100

  return {
    x: parseFloat(posX.toFixed(3)),
    y: parseFloat(posY.toFixed(3)),
  }
}
