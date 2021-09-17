import classNames from "classnames"
import React, { useEffect, useRef, useState } from "react"
import { Loader, Poland, Weather } from "."
import { Forecast } from "../components"
import Header from "../components/header"
import { Locality, OWMOneCallResponse, Place } from "../imports/interfaces"
import { isLocality, isVoivodeship } from "../imports/typeGuards"
import { Voivodeships } from "../mocks"
import { contentStyles } from "../styles/components"
import Icon from "./icon"

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
    setMapTitle("wybierz swój region xx")

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

  const handleLocalitySet = (locality: Locality) => {
    setContentData(locality)
  }

  const handleIsForecastShownChange = () => {
    setIsForecastShown(!isForecastShown)
  }

  const getWeatherTitle = (): string | undefined => {
    if (isVoivodeship(contentData)) {
      return `${contentData.name}, Polska`
    } else if (isLocality(contentData)) {
      return `${contentData.Name}, p. ${contentData.District}`
    }
  }

  const weatherClosed = () => {
    setContentData(null)
  }

  const getMapPosition = (Longitude: number, Latitude: number): { x: number; y: number } => {
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
      <Header setLocality={handleLocalitySet} closeWeather={weatherClosed} contentData={contentData} />
      <div className={contentStyles.content}>
        <div className={classNames("wrapper", contentStyles.contentContainer)}>
          <div className={classNames(contentStyles.contentController, contentData !== null && contentStyles.contentControllerHandled)}>
            <div className={contentStyles.contentWrap}>
              <Poland ref={mapRef} className={contentStyles.contentMap} />
              {isLocality(contentData) && (
                <>
                  <Icon
                    name="point"
                    className={contentStyles.contentPoint}
                    style={{
                      bottom: `${getMapPosition(contentData.Longitude, contentData.Latitude).y}%`,
                      left: `${getMapPosition(contentData.Longitude, contentData.Latitude).x}%`,
                    }}
                  />
                </>
              )}
            </div>
            <h1 className={contentStyles.contentTitle}>{mapTitle}</h1>
          </div>
          {contentData !== null && (
            <div className={classNames(contentStyles.contentSideBar, loadingStatus && contentStyles.contentSideBarCentered)}>
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
