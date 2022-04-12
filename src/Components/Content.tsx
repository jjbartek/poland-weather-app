import { Forecast, Header, Icon, Loader, Poland, PromptList, Weather } from "."
import { GeoLocation, OWMOneCallResponse, Place } from "../Imports/Interfaces"
import { PromptContext, PromptUseContext } from "../Contexts/PromptContext"
import React, { useEffect, useRef, useState } from "react"
import { getMapPosition, isLocationInPoland } from "../Commons/Location"
import { isGeoLocation, isLocality, isVoivodeship } from "../Imports/TypeGuards"

import { ContentStyles } from "../Styles/Components"
import { Voivodeships } from "../Mocks"
import classNames from "classnames"

const Content: React.FC = () => {
  const [contentData, setContentData] = useState<Place>(null)
  const [weatherData, setWeatherData] = useState<null | OWMOneCallResponse>(null)
  const [isForecastShown, setIsForecastShown] = useState<boolean>(false)
  const [loadingStatus, setLoadingStatus] = useState<boolean>(false)
  const [mapTitle, setMapTitle] = useState("wybierz swój region")
  const mapRef = useRef<SVGSVGElement | null>(null)
  const { addPrompt } = PromptUseContext(PromptContext)

  useEffect(() => {
    setIsForecastShown(false)
    setWeatherData(null)
    setMapTitle("wybierz swój region")

    const updateWeather = (lon: number, lat: number): void => {
      setLoadingStatus(true)
      fetch(`https://api.openweathermap.org/data/2.5/onecall?lon=${lon}&lat=${lat}&appid=${process.env.GATSBY_OWM_KEY}&lang=pl&units=metric`)
        .then((response) => response.json())
        .then((response: OWMOneCallResponse) => {
          if (response.cod !== 200 && response.cod !== undefined) {
            throw Error("API Error")
          } else {
            setWeatherData(response)
          }
        })
        .catch(() => {
          addPrompt(0, "Wystąpił błąd", "Nie udało pobrać się danych z Open Weather Map")
          setContentData(null)
        })
        .finally(() => {
          setLoadingStatus(false)
        })
    }

    if (mapRef.current) {
      mapRef.current.querySelectorAll(".fill-blue2").forEach((item) => {
        item.classList.remove("fill-blue2")
      })

      if (isLocality(contentData)) {
        updateWeather(contentData.Longitude, contentData.Latitude)
        setMapTitle(contentData.Name)
      } else if (isVoivodeship(contentData)) {
        updateWeather(contentData.lon, contentData.lat)
        setMapTitle(contentData.name)

        mapRef.current.querySelector(`#${contentData.slug}`)?.classList.add("fill-blue2")
      } else if (isGeoLocation(contentData)) {
        updateWeather(contentData.longitude, contentData.latitude)
        setMapTitle(`Twoja lokalizacja`)
      }
    }
  }, [addPrompt, contentData])

  useEffect(() => {
    const handleVoivodeshipClick = (event: MouseEvent): void => {
      const voivodeship = event.target as SVGSVGElement
      const chosenVoivodeship = Voivodeships.filter(({ slug }) => slug === voivodeship.id)[0]
      if (chosenVoivodeship !== undefined) {
        setContentData(chosenVoivodeship)
      }
    }

    const map = mapRef.current

    if (map) {
      const allPaths = map.querySelectorAll("path")
      allPaths.forEach((voivodeship: SVGPathElement) => voivodeship.addEventListener("click", handleVoivodeshipClick))
    }

    return () => {
      if (map) {
        const allPaths = map.querySelectorAll("path")
        allPaths.forEach((voivodeship: SVGPathElement) => voivodeship.removeEventListener("click", handleVoivodeshipClick))
      }
    }
  }, [mapRef])

  const handleContentDataSet = (place: Place) => {
    setContentData(place)
  }

  const handleIsForecastShownChange = () => {
    setIsForecastShown(!isForecastShown)
  }

  const getWeatherTitle = (): string | undefined => {
    if (isVoivodeship(contentData)) {
      return `${contentData.name}, Polska`
    } else if (isLocality(contentData)) {
      return `${contentData.Name}, p. ${contentData.District}`
    } else {
      return `Twoja lokalizacja`
    }
  }

  const getWeatherFromLocation = (): void => {
    if (typeof window !== "undefined" && typeof window.navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }: GeolocationPosition) => {
          if (isLocationInPoland(latitude, longitude)) {
            setContentData({
              latitude,
              longitude,
            } as GeoLocation)
          } else {
            addPrompt(0, "Wystapił błąd", "Aplikacja obsługuje wyłącznie pogodę na obszarze Polski.")
          }
        },
        () => {
          addPrompt(0, "Wystapił błąd", "Nie udało się pobrać lokalizacji.")
        }
      )
    }
  }

  return (
    <>
      <Header
        setContentData={handleContentDataSet}
        getWeatherFromLocation={getWeatherFromLocation}
        closeWeather={() => setContentData(null)}
        contentData={contentData}
      />
      <div className={ContentStyles.content}>
        <PromptList />
        <div className={classNames("wrapper", ContentStyles.content__container)}>
          <div className={classNames(ContentStyles.content__controller, contentData !== null && ContentStyles.content__controllerHandled)}>
            <div className={ContentStyles.content__wrap}>
              <Poland ref={mapRef} className={ContentStyles.content__map} />
              {isLocality(contentData) && (
                <>
                  <Icon
                    name="point"
                    className={ContentStyles.content__point}
                    style={{
                      bottom: `${getMapPosition(contentData.Longitude, contentData.Latitude).y}%`,
                      left: `${getMapPosition(contentData.Longitude, contentData.Latitude).x}%`,
                    }}
                  />
                </>
              )}
              {isGeoLocation(contentData) && (
                <>
                  <Icon
                    name="point"
                    className={ContentStyles.content__point}
                    style={{
                      bottom: `${getMapPosition(contentData.longitude, contentData.latitude).y}%`,
                      left: `${getMapPosition(contentData.longitude, contentData.latitude).x}%`,
                    }}
                  />
                </>
              )}
            </div>
            <h1 className={ContentStyles.content__title}>{mapTitle}</h1>
          </div>
          {contentData !== null && (
            <div className={classNames(ContentStyles.content__sideBar, loadingStatus && ContentStyles.content__sideBarCentered)}>
              {!loadingStatus && weatherData !== null ? (
                <Weather title={getWeatherTitle()} weatherData={weatherData} handleIsForecastShownChange={handleIsForecastShownChange} />
              ) : (
                <Loader />
              )}
            </div>
          )}
        </div>
      </div>
      {contentData !== null && isForecastShown && !loadingStatus && weatherData !== null && <Forecast data={weatherData.daily} />}
    </>
  )
}

export default Content
