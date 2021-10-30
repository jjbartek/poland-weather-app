import classNames from "classnames"
import React, { useEffect, useState } from "react"
import { Preloader } from "../Images"
import { LoaderStyles } from "../Styles/Components"

interface Props {
  isLoading?: boolean
  isfullScreen?: boolean
}

const Loader: React.FC<Props> = ({ isLoading = true, isfullScreen = false }) => {
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
      className={classNames(LoaderStyles.loader, isfullScreen ? LoaderStyles.loaderFullScreen : null, isLoading ? null : LoaderStyles.loaderHidden)}
    >
      <img src={Preloader} className={LoaderStyles.loaderAnimation} />
    </div>
  )
}

export default Loader
