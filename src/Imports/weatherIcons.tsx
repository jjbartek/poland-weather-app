import { IconStyles } from "../Styles/Components"

interface IconNames {
  [name: string]: keyof typeof IconStyles
}

const WeatherIcons: IconNames = {
  "01d": "sun",
  "01n": "moon",
  "02d": "cloudSun",
  "02n": "cloudMoon",
  "03d": "cloudTwo",
  "03n": "cloudTwo",
  "04d": "cloudTwo",
  "04n": "cloudTwo",
  "09d": "rainLight",
  "09n": "rainLightMoon",
  "10d": "rainHeavySun",
  "10n": "rainHeavyMoon",
  "11d": "thunder",
  "11n": "thunderMoon",
  "13d": "snowTwoSun",
  "13n": "snowTwoMoon",
  "50d": "fog",
  "50n": "fogMoon",
}

export default WeatherIcons
