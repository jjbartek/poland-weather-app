import React from "react"
import { VoivodeshipNames } from "../Imports/Enums"

export interface Vovoidenship {
  api_id: number
  slug: keyof typeof VoivodeshipNames
  name: string
  capital: string
  weather?: object
}

interface WeatherContextState {
  vovoidenships: Vovoidenship[]
  currentVovidenship: null | Vovoidenship
  setCurrentVovoidenship: (vovoidenship: Vovoidenship) => void
}

export const WeatherContext = React.createContext({} as WeatherContextState)
export const WeatherProvider = WeatherContext.Provider
export const WeatherConsumer = WeatherContext.Consumer

export default WeatherContext
