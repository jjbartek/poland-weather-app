import React, { useEffect, useState } from "react"

import { LoaderStyles } from "../Styles/Components"
import { Preloader } from "../Images"
import classNames from "classnames"

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
      <img src={Preloader} alt="" className={LoaderStyles.loader__animation} />
    </div>
  )
}

export default Loader
