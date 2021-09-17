export interface OWMCurrentResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    }
  ]
  base: string
  main: {
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    temp_min: number
    temp_max: number
    sea_level: number
    grnd_level: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  clouds?: {
    all: number
  }
  rain?: {
    "1h": number
    "3h": number
  }
  snow?: {
    "1h": number
    "3h": number
  }
  dt: number
  sys: {
    type: number
    id: number
    message: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface Voivodeship {
  api_id: number
  slug: string // keyof typeof VoivodeshipNames
  name: string
  capital: string
  lat: number
  lon: number
}

export interface Locality {
  Commune: string
  District: string
  Id: string
  Latitude: number
  Longitude: number
  Name: string
  Province: string
  Type: "village" | "city"
}

export interface OWMOneCallResponse {
  cod?: number
  lat: number
  lon: number
  timezone: string
  timezone_offset: number
  current: {
    dt: number
    sunrise: number
    sunset: number
    temp: number
    feels_like: number
    pressure: number
    humidity: number
    dew_point: number
    uvi: number
    clouds: number
    visibility: number
    wind_speed: number
    wind_deg: number
    wind_gust: number
    weather: [
      {
        id: number
        main: string
        description: string
        icon: string
      }
    ]
  }
  hourly: [
    {
      dt: number
      temp: number
      feels_like: number
      pressure: number
      humidity: number
      dew_point: number
      uvi: number
      clouds: number
      visibility: number
      wind_speed: number
      wind_deg: number
      wind_gust: number
      weather: [
        {
          id: number
          main: string
          description: string
          icon: string
        }
      ]
      pop: number
    }
  ]
  daily: OWMDailyForecast[]
}

export interface OWMDailyForecast {
  dt: number
  sunrise: number
  sunset: number
  moonrise: number
  moonset: number
  moon_phase: number
  temp: {
    day: number
    min: number
    max: number
    night: number
    eve: number
    morn: number
  }
  feels_like: {
    day: number
    night: number
    eve: number
    morn: number
  }
  pressure: number
  humidity: number
  dew_point: number
  wind_speed: number
  wind_deg: number
  wind_gust: number
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    }
  ]
  clouds: number
  pop: number
  uvi: number
}

export type Place = Voivodeship | Locality | null
