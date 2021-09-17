import { Locality, Place, Voivodeship } from "./interfaces"

export const isVoivodeship = (item: Place): item is Voivodeship => {
  return item !== null && (item as Voivodeship).capital !== undefined
}

export const isLocality = (item: Place): item is Locality => {
  return item !== null && (item as Locality).Commune !== undefined
}
