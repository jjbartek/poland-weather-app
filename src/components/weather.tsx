import classNames from "classnames"
import _ from "lodash"
import React from "react"
import { Line } from "react-chartjs-2"
import { Icon } from "../components"
import { getDateFromTimestamp } from "../helpers"
import { OWMOneCallResponse, weatherIcons } from "../imports"
import { buttonStyles, weatherStyles } from "../styles/components"

interface Props {
  title?: string
  weatherData: OWMOneCallResponse
  handleIsForecastShownChange: () => void
}

interface DataInt {
  labels: [string?]
  datasets: [
    {
      data: [number?]
      fill: boolean
      backgroundColor: string
      borderColor: string
    }
  ]
}
const Weather: React.FC<Props> = ({ title, weatherData, handleIsForecastShownChange }) => {
  const chartData: DataInt = {
    datasets: [
      {
        backgroundColor: "#12942e",
        borderColor: "#12942e",
        data: [],
        fill: false,
      },
    ],
    labels: [],
  }

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (item: { formattedValue: string }) => `${item.formattedValue}°C`,
        },
      },
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
      yAxes: [
        {
          gridLines: {
            display: false,
          },
        },
      ],
    },
  }
  _.orderBy(weatherData.hourly, "dt", "asc").map((v) => {
    const initialDate = new Date()
    const finalDate = new Date()

    initialDate.setHours(initialDate.getHours() - 1)
    finalDate.setHours(initialDate.getHours() + 7)

    if (v.dt > initialDate.getTime() / 1000 && v.dt < finalDate.getTime() / 1000) {
      chartData.labels.push(getDateFromTimestamp(v.dt, "time"))
      chartData.datasets[0].data.push(v.temp)
    }
  })

  return (
    <>
      {weatherData ? (
        <>
          <header className={weatherStyles.weatherHeader}>
            <h1>
              <b>POGODA</b> | {getDateFromTimestamp(weatherData.current.dt, "date")}
            </h1>
            <p>{title}</p>
          </header>
          <div className={weatherStyles.weatherRow}>
            <Icon name={weatherIcons[weatherData.current.weather[0].icon]} />
            <div className={weatherStyles.weatherTemperature}>
              {Math.round(weatherData.current.temp)}
              <sup>°C</sup>
            </div>
            <div className={weatherStyles.weatherDescription}>{weatherData.current.weather[0].description}</div>
          </div>
          <div className={weatherStyles.weatherStats}>
            <div className={weatherStyles.weatherStatsRow}>
              <span className={weatherStyles.weatherStatsLabelWithIcon}>
                <Icon name="weather" />
                Odczuwalna:&nbsp;
              </span>
              <span className={weatherStyles.weatherStatsData}>{Math.round(weatherData.current.feels_like)}°C</span>
            </div>
            <div className={weatherStyles.weatherStatsRow}>
              <span className={weatherStyles.weatherStatsLabelWithIcon}>
                <Icon name="pressure" />
                Ciśnienie:&nbsp;
              </span>
              <span className={weatherStyles.weatherStatsData}>{weatherData.current.pressure} hPa</span>
            </div>
            <div className={weatherStyles.weatherStatsRow}>
              <span className={weatherStyles.weatherStatsLabelWithIcon}>
                <Icon name="regularCloud" />
                Zachmurzenie:&nbsp;
              </span>
              <span className={weatherStyles.weatherStatsData}>{weatherData.current.wind_speed}%</span>
            </div>
            <div className={weatherStyles.weatherStatsRow}>
              <span className={weatherStyles.weatherStatsLabelWithIcon}>
                <Icon name="wind" />
                Wiatr:&nbsp;
              </span>
              <span className={weatherStyles.weatherStatsData}>{weatherData.current.wind_speed} m/s</span>
            </div>
          </div>
          <div className={weatherStyles.weatherDataContainer}>
            <div className={weatherStyles.weatherChart}>
              <Line type="line" data={chartData} options={options} />
            </div>
            <button
              className={classNames(buttonStyles.button, buttonStyles.buttonGreen, buttonStyles.buttonSideRight, buttonStyles.buttonMobileFullSize)}
              onClick={handleIsForecastShownChange}
            >
              <Icon name="nextWeather" />
              <span className="mobile-shown">Sprawdź następne dni</span>
            </button>
          </div>
        </>
      ) : (
        <>nie udało się pobrać pogody</>
      )}
    </>
  )
}

export default Weather
