import classNames from "classnames"
import React from "react"
import { iconStyles } from "../styles/components"

interface Props {
  name: keyof typeof iconStyles
  className?: string
  style?: React.CSSProperties
}

const Icon: React.FC<Props> = ({ name, className, style }) => {
  return <i className={classNames([iconStyles.icon, iconStyles[name]], className)} style={style} />
}

export default Icon
