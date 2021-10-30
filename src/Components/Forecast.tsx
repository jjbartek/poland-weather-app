import "swiper/swiper.scss"

import React, { useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"

import { ForecastStyles } from "../Styles/Components"
import { GetDateFromTimestamp } from "../Helpers"
import { Icon } from "."
import { OWMDailyForecast } from "../Imports/Interfaces"
import { WeatherIcons } from "../Imports"

interface Props {
  data: OWMDailyForecast[] | null
}

const Forecast: React.FC<Props> = ({ data }) => {
  const forecastRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (forecastRef.current !== null) {
      forecastRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  })

  return (
    <section ref={forecastRef} className={ForecastStyles.forecast}>
      <div className={ForecastStyles.forecastWrapper}>
        <h1 className={ForecastStyles.forecastTitle}>Prognoza</h1>
        <div className={ForecastStyles.forecastContainer}>
          <Swiper
            spaceBetween={17}
            slidesPerView="auto"
            autoplay={true}
            breakpoints={{
              1024: {
                spaceBetween: 38,
              },
            }}
          >
            {data !== null &&
              data.map((day) => (
                <SwiperSlide key={day.dt}>
                  <div className={ForecastStyles.forecastItem}>
                    <p className={ForecastStyles.forecastItemHeading}>
                      {GetDateFromTimestamp(day.dt, "day").toUpperCase()}
                      <span> | {GetDateFromTimestamp(day.dt, "date")}</span>
                    </p>
                    <div className={ForecastStyles.forecastItemWeatherGroup}>
                      <Icon name={WeatherIcons[day.weather[0].icon]} />
                      <p className={ForecastStyles.forecastItemTemperature}>
                        {Math.round(day.temp.max)} <sup>°C</sup>
                      </p>
                      <p className={ForecastStyles.forecastItemDescription}>{day.weather[0].description}</p>
                    </div>
                    <div className={ForecastStyles.forecastItemStats}>
                      <div className={ForecastStyles.forecastItemStatsRow}>
                        <Icon name="pressure" />
                        {day.pressure} hPa
                      </div>
                      <div className={ForecastStyles.forecastItemStatsRow}>
                        <Icon name="wind" />
                        {day.wind_speed} m/s
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default Forecast
