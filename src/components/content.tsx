import { Forecast, Header, Icon, Loader, Poland, Weather } from "."
import { OWMOneCallResponse, Place } from "../Imports/Interfaces"
import React, { useEffect, useRef, useState } from "react"
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

  useEffect(() => {
    setIsForecastShown(false)
    setWeatherData(null)
    setMapTitle("wybierz swój region")

    mapRef.current!?.querySelectorAll(".fill-blue2").forEach((item) => {
      item.classList.remove("fill-blue2")
    })

    if (isLocality(contentData)) {
      updateWeather(contentData.Longitude, contentData.Latitude)
      setMapTitle(contentData.Name)
    } else if (isVoivodeship(contentData)) {
      updateWeather(contentData.lon, contentData.lat)
      setMapTitle(contentData.name)

      mapRef.current!?.querySelector(`#${contentData.slug}`)?.classList.add("fill-blue2")
    } else if (isGeoLocation(contentData)) {
      updateWeather(contentData.longitude, contentData.latitude)
      setMapTitle(`Twoja lokalizacja`)
    }
  }, [contentData])

  useEffect(() => {
    const handleVoivodeshipClick = (event: MouseEvent): void => {
      const voivodeship = event.target as SVGSVGElement
      const chosenVoivodeship = Voivodeships.filter(({ slug }) => slug === voivodeship.id)[0]
      if (chosenVoivodeship !== undefined) {
        setContentData(chosenVoivodeship)
      }
    }

    if (mapRef.current) {
      const allPaths = mapRef.current.querySelectorAll("path")
      allPaths.forEach((voivodeship: SVGPathElement) => voivodeship.addEventListener("click", handleVoivodeshipClick))
    }

    return () => {
      if (mapRef.current) {
        const allPaths = mapRef.current.querySelectorAll("path")
        allPaths.forEach((voivodeship: SVGPathElement) => voivodeship.removeEventListener("click", handleVoivodeshipClick))
      }
    }
  })

  const updateWeather = (lon: number, lat: number) => {
    setLoadingStatus(true)

    fetch(`https://api.openweathermap.org/data/2.5/onecall?lon=${lon}&lat=${lat}&appid=${process.env.GATSBY_OWM_KEY}&lang=pl&units=metric`)
      .then((response) => response.json())
      .then((response: OWMOneCallResponse) => {
        if (response.cod !== 200 && response.cod !== undefined) {
          throw new Error()
        }

        setWeatherData(response)
      })
      .catch((e) => {
        throw Error(e)
      })
      .finally(() => {
        setLoadingStatus(false)
      })
  }

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

  const weatherClosed = () => {
    setContentData(null)
  }

  const getMapPosition = (Longitude: number, Latitude: number): { x: number; y: number } => {
    // MOVE TO LOCATION.TSX COMMON
    // x,y are Poland's points of extremity

    const xMin = 14.116
    const xMax = 24.15

    const yMin = 49
    const yMax = 54.83

    const xLength = xMax - xMin
    const yLength = yMax - yMin

    const posX = ((Longitude - xMin) / xLength) * 100
    const posY = ((Latitude - yMin) / yLength) * 100

    return {
      x: parseFloat(posX.toFixed(3)),
      y: parseFloat(posY.toFixed(3)),
    }
  }

  return (
    <>
      <Header setContentData={handleContentDataSet} closeWeather={weatherClosed} contentData={contentData} />
      <div className={ContentStyles.content}>
        <div className={classNames("wrapper", ContentStyles.contentContainer)}>
          <div className={classNames(ContentStyles.contentController, contentData !== null && ContentStyles.contentControllerHandled)}>
            <div className={ContentStyles.contentWrap}>
              <Poland ref={mapRef} className={ContentStyles.contentMap} />
              {isLocality(contentData) && (
                <>
                  <Icon
                    name="point"
                    className={ContentStyles.contentPoint}
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
                    className={ContentStyles.contentPoint}
                    style={{
                      bottom: `${getMapPosition(contentData.longitude, contentData.latitude).y}%`,
                      left: `${getMapPosition(contentData.longitude, contentData.latitude).x}%`,
                    }}
                  />
                </>
              )}
            </div>
            <h1 className={ContentStyles.contentTitle}>{mapTitle}</h1>
          </div>
          {contentData !== null && (
            <div className={classNames(ContentStyles.contentSideBar, loadingStatus && ContentStyles.contentSideBarCentered)}>
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
