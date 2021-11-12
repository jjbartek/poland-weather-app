import { ButtonStyles, WeatherStyles } from "../Styles/Components"
import { ChartData, ChartOptions } from "chart.js"
import { OWMOneCallResponse, WeatherIcons } from "../Imports"

import { GetDateFromTimestamp } from "../Helpers"
import { Icon } from "."
import { Line } from "react-chartjs-2"
import React from "react"
import _ from "lodash"
import classNames from "classnames"

interface Props {
  title?: string
  weatherData: OWMOneCallResponse
  handleIsForecastShownChange: () => void
}

const Weather: React.FC<Props> = ({ title, weatherData, handleIsForecastShownChange }) => {
  const chartData: ChartData<"line"> = {
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

  const options: ChartOptions<"line"> = {
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
    // scales: {
    //   xAxes: [
    //     {
    //       gridLines: {
    //         display: false,
    //       },
    //     },
    //   ],
    //   yAxes: [
    //     {
    //       gridLines: {
    //         display: false,
    //       },
    //     },
    //   ],
    // },
  }
  _.orderBy(weatherData.hourly, "dt", "asc").map((v) => {
    const initialDate = new Date()
    const finalDate = new Date()

    initialDate.setHours(initialDate.getHours() - 1)
    finalDate.setHours(initialDate.getHours() + 7)

    if (v.dt > initialDate.getTime() / 1000 && v.dt < finalDate.getTime() / 1000 && chartData.labels) {
      chartData.labels.push(GetDateFromTimestamp(v.dt, "time"))
      chartData.datasets[0].data.push(v.temp)
    }
  })

  return (
    <>
      {weatherData ? (
        <>
          <header className={WeatherStyles.weather__header}>
            <h1>
              <b>POGODA</b> | {GetDateFromTimestamp(weatherData.current.dt, "date")}
            </h1>
            <p>{title}</p>
          </header>
          <div className={WeatherStyles.weather__row}>
            <Icon name={WeatherIcons[weatherData.current.weather[0].icon]} />
            <div className={WeatherStyles.weather__temperature}>
              {Math.round(weatherData.current.temp)}
              <sup>°C</sup>
            </div>
            <div className={WeatherStyles.weather__description}>{weatherData.current.weather[0].description}</div>
          </div>
          <div className={WeatherStyles.weather__stats}>
            <div className={WeatherStyles.weather__statsRow}>
              <span className={WeatherStyles.weather__statsLabelWithIcon}>
                <Icon name="weather" />
                Odczuwalna:&nbsp;
              </span>
              <span className={WeatherStyles.weather__statsData}>{Math.round(weatherData.current.feels_like)}°C</span>
            </div>
            <div className={WeatherStyles.weather__statsRow}>
              <span className={WeatherStyles.weather__statsLabelWithIcon}>
                <Icon name="pressure" />
                Ciśnienie:&nbsp;
              </span>
              <span className={WeatherStyles.weather__statsData}>{weatherData.current.pressure} hPa</span>
            </div>
            <div className={WeatherStyles.weather__statsRow}>
              <span className={WeatherStyles.weather__statsLabelWithIcon}>
                <Icon name="regularCloud" />
                Zachmurzenie:&nbsp;
              </span>
              <span className={WeatherStyles.weather__statsData}>{weatherData.current.wind_speed}%</span>
            </div>
            <div className={WeatherStyles.weather__statsRow}>
              <span className={WeatherStyles.weather__statsLabelWithIcon}>
                <Icon name="wind" />
                Wiatr:&nbsp;
              </span>
              <span className={WeatherStyles.weather__statsData}>{weatherData.current.wind_speed} m/s</span>
            </div>
          </div>
          <div className={WeatherStyles.weather__dataContainer}>
            <div className={WeatherStyles.weather__chart}>
              <Line data={chartData} options={options} />
            </div>
            <button
              className={classNames(ButtonStyles.button, ButtonStyles.buttonGreen, ButtonStyles.buttonSideRight, ButtonStyles.buttonMobileFullSize)}
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
