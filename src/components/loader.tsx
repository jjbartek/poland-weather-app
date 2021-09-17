import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { preloader } from "../images"
import { loaderStyles } from "../styles/components"

interface Props {
  isLoading?: boolean
  isfullScreen?: boolean
}

const Loader: React.FC<Props> = ({
  isLoading = true,
  isfullScreen = false,
}) => {
  const [hidden, setHidden] = useState<boolean>(isLoading)

  useEffect(() => {
    if (!isLoading) {
      setTimeout(() => {
        setHidden(true)
      }, 300)
    } else {
      setHidden(false)
    }
  }, [isLoading])

  return hidden ? null : (
    <div
      className={classNames(
        loaderStyles.loader,
        isfullScreen ? loaderStyles.loaderFullScreen : null,
        isLoading ? null : loaderStyles.loaderHidden
      )}
    >
      <img src={preloader} className={loaderStyles.loaderAnimation} />
    </div>
  )
}

export default Loader
