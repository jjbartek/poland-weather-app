import { Locality, Place, isLocality, isVoivodeship } from "../Imports"
import React, { useEffect, useRef, useState } from "react"

import { HeaderStyles } from "../Styles/Components"
import { Icon } from "."
import { Link } from "gatsby"
import _ from "lodash"
import classNames from "classnames"
import data from "polskie-miejscowosci"
import { isGeoLocation } from "../Imports/TypeGuards"

const Header: React.FC<{
  setContentData: (place: Place) => void
  closeWeather: () => void
  getWeatherFromLocation: () => void
  contentData: Place
}> = ({ setContentData, closeWeather, getWeatherFromLocation, contentData }) => {
  const resultRef = useRef<HTMLUListElement>(null)
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const [fieldValue, setFieldValue] = useState("")
  const [searchResult, setSearchResult] = useState<Locality[]>([])
  const [focusedItem, setFocusedItem] = useState(0)
  const [isFieldFocused, setIsFieldFocused] = useState(false)

  const handleFieldUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target !== null) {
      const searchedValue = e.target.value
      setFieldValue(searchedValue)
    }
  }

  const handleArrows = (e: React.KeyboardEvent) => {
    if (searchResult.length > 0) {
      if (e.key === "ArrowUp" && focusedItem > 0) {
        setFocusedItem(focusedItem - 1)
        adjustListToItem()
      } else if (e.key === "ArrowDown" && focusedItem !== searchResult.length - 1) {
        setFocusedItem(focusedItem + 1)
        adjustListToItem()
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isFieldFocused && searchResult.length > 0 && searchResult[focusedItem]) {
        setContentData(searchResult[focusedItem])
      }

      e.preventDefault()
      e.stopPropagation()
      return false
    }
  }

  const adjustListToItem = () => {
    if (resultRef.current) {
      const currentItem = resultRef.current.querySelectorAll("li")
      if (currentItem[focusedItem]) {
        currentItem[focusedItem].scrollIntoView({
          block: "center",
          inline: "end",
        })
      }
    }
  }

  useEffect(() => {
    if (fieldValue.length >= 2) {
      const result = data.filter((i) => new RegExp("^(?:^|\\s)" + _.escapeRegExp(fieldValue), "i").test(i.Name))

      setSearchResult(result)
      setFocusedItem(0)
    } else if (searchResult.length > 0) {
      setSearchResult([])
    }
  }, [fieldValue, searchResult.length])

  useEffect(() => {
    const currentResult = resultRef.current
    const currentField = fieldRef.current

    const handleMouseDown = (e: MouseEvent) => {
      const path = []
      let element = e.target as HTMLElement | null

      while (element) {
        path.push(element.parentElement)
        element = element.parentElement
      }

      if (document.activeElement === currentField && (e.target === currentResult || path.includes(currentResult))) {
        e.preventDefault()
        e.stopPropagation()

        return false
      }
    }

    const handleFocusIn = () => {
      setIsFieldFocused(true)
    }

    const handleFocusOut = () => {
      setIsFieldFocused(false)
    }

    if (currentField) {
      document.addEventListener("mousedown", handleMouseDown)
      currentField.addEventListener("focusin", handleFocusIn)
      currentField.addEventListener("focusout", handleFocusOut)
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      if (currentField) {
        currentField.removeEventListener("focusin", handleFocusIn)
        currentField.removeEventListener("focusout", handleFocusOut)
      }
    }
  }, [fieldRef, resultRef])

  useEffect(() => {
    setFieldValue("")
  }, [contentData])

  return (
    <header className={HeaderStyles.header}>
      <div className={`wrapper ${HeaderStyles.header__container}`}>
        {contentData !== null ? (
          <>
            <span onClick={() => closeWeather()} className={HeaderStyles.header__icon}>
              <Icon name="arrowLeft" />
            </span>
            <div className={HeaderStyles.header__title}>
              {isLocality(contentData) && (
                <div className={HeaderStyles.header__title}>
                  {contentData.Name}, {contentData.Province}, p. {contentData.District}
                </div>
              )}
              {isVoivodeship(contentData) && <div className={HeaderStyles.header__title}>{contentData.name}</div>}
              {isGeoLocation(contentData) && <div className={HeaderStyles.header__title}>Twoja lokalizacja</div>}
            </div>
          </>
        ) : (
          <>
            <Link to="/" className={HeaderStyles.header__icon}>
              <Icon name="weather" />
            </Link>
            <textarea
              className={HeaderStyles.header__field}
              placeholder="wyszukaj miasto.."
              value={fieldValue}
              onChange={handleFieldUpdate}
              onKeyDown={handleArrows}
              onKeyPress={handleKeyPress}
              ref={fieldRef}
            />

            {searchResult.length > 0 && isFieldFocused && (
              <ul ref={resultRef} className={HeaderStyles.header__results}>
                {searchResult.map((item, i) => (
                  <li
                    key={i}
                    className={classNames(HeaderStyles.header__resultsItem, i === focusedItem ? HeaderStyles.header__resultsItemActive : "")}
                    onClick={() => setContentData(item)}
                  >
                    {item.Name}, {item.Province}, p. {item.District}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {!isGeoLocation(contentData) && <Icon onClick={() => getWeatherFromLocation()} name="location" className={HeaderStyles.header__location} />}
      </div>
    </header>
  )
}

export default Header
