import { Link } from "gatsby"
import React, { useEffect, useState, useRef } from "react"
import { headerStyles } from "../styles/components"
import { Icon } from "../components"
import data from "polskie-miejscowosci"
import classNames from "classnames"
import { Locality, isLocality, isVoivodeship, Place } from "../imports"
import _ from "lodash"

const Header: React.FC<{
  setLocality: (locality: Locality) => void
  closeWeather: () => void
  contentData: Place
}> = ({ setLocality, closeWeather, contentData }) => {
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
        setLocality(searchResult[focusedItem])
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
    } else if (searchResult.length > 0) setSearchResult([])
  }, [fieldValue])

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const path = []
      let element = e.target as HTMLElement | null

      while (element) {
        path.push(element.parentElement)
        element = element.parentElement
      }

      if (document.activeElement === fieldRef.current && (e.target === resultRef.current || path.includes(resultRef.current))) {
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

    if (fieldRef.current) {
      document.addEventListener("mousedown", handleMouseDown)
      fieldRef.current.addEventListener("focusin", handleFocusIn)
      fieldRef.current.addEventListener("focusout", handleFocusOut)
    }

    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
      if (fieldRef.current) {
        fieldRef.current.removeEventListener("focusin", handleFocusIn)
        fieldRef.current.removeEventListener("focusout", handleFocusOut)
      }
    }
  }, [fieldRef, fieldRef.current])

  useEffect(() => {
    setFieldValue("")
  }, [contentData])

  return (
    <header className={headerStyles.header}>
      <div className={`wrapper ${headerStyles.headerContainer}`}>
        {contentData !== null ? (
          <>
            <span onClick={() => closeWeather()} className={headerStyles.headerIcon}>
              <Icon name="arrowLeft"></Icon>
            </span>
            <div className={headerStyles.headerTitle}>
              {isLocality(contentData) && (
                <div className={headerStyles.headerTitle}>
                  {contentData.Name}, {contentData.Province}, p. {contentData.District}
                </div>
              )}
              {isVoivodeship(contentData) && <div className={headerStyles.headerTitle}>{contentData.name}</div>}
            </div>
          </>
        ) : (
          <>
            <Link to="/" className={headerStyles.headerIcon}>
              <Icon name="weather"></Icon>
            </Link>
            <textarea
              className={headerStyles.headerField}
              placeholder="wyszukaj miasto.."
              value={fieldValue}
              onChange={handleFieldUpdate}
              onKeyDown={handleArrows}
              onKeyPress={handleKeyPress}
              ref={fieldRef}
            ></textarea>

            {searchResult.length > 0 && isFieldFocused && (
              <ul ref={resultRef} className={headerStyles.headerResults}>
                {searchResult.map((item, i) => (
                  <li
                    key={i}
                    className={classNames(headerStyles.headerResultsItem, i === focusedItem ? headerStyles.headerResultsItemActive : "")}
                    onClick={() => setLocality(item)}
                  >
                    {item.Name}, {item.Province}, p. {item.District}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <Icon name="location" className={headerStyles.headerLocation} />
      </div>
    </header>
  )
}

export default Header
