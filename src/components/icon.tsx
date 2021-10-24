import classNames from "classnames"
import React from "react"
import { iconStyles } from "../styles/components"

interface Props {
  name: keyof typeof iconStyles
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLLIElement>
}

const Icon: React.FC<Props> = ({ name, className, style, onClick }) => {
  return <i className={classNames([iconStyles.icon, iconStyles[name]], className)} onClick={onClick} style={style} />
}

export default Icon
