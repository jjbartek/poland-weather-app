import React, { useEffect, useRef } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/swiper.scss"
import { Icon } from "../components"
import { getDateFromTimestamp } from "../helpers"
import { weatherIcons } from "../imports"
import { OWMDailyForecast } from "../imports/interfaces"
import { forecastStyles } from "../styles/components"
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
    <section ref={forecastRef} className={forecastStyles.forecast}>
      <div className={forecastStyles.forecastWrapper}>
        <h1 className={forecastStyles.forecastTitle}>Prognoza</h1>
        <div className={forecastStyles.forecastContainer}>
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
                  <div className={forecastStyles.forecastItem}>
                    <p className={forecastStyles.forecastItemHeading}>
                      {getDateFromTimestamp(day.dt, "day").toUpperCase()}
                      <span> | {getDateFromTimestamp(day.dt, "date")}</span>
                    </p>
                    <div className={forecastStyles.forecastItemWeatherGroup}>
                      <Icon name={weatherIcons[day.weather[0].icon]} />
                      <p className={forecastStyles.forecastItemTemperature}>
                        {Math.round(day.temp.max)} <sup>°C</sup>
                      </p>
                      <p className={forecastStyles.forecastItemDescription}>{day.weather[0].description}</p>
                    </div>
                    <div className={forecastStyles.forecastItemStats}>
                      <div className={forecastStyles.forecastItemStatsRow}>
                        <Icon name="pressure" />
                        {day.pressure} hPa
                      </div>
                      <div className={forecastStyles.forecastItemStatsRow}>
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
