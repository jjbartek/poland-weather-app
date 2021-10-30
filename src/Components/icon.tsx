import classNames from "classnames"
import React from "react"
import { IconStyles } from "../Styles/Components"

interface Props {
  name: keyof typeof IconStyles
  className?: string
  style?: React.CSSProperties
  onClick?: React.MouseEventHandler<HTMLLIElement>
}

const Icon: React.FC<Props> = ({ name, className, style, onClick }) => {
  return <i className={classNames([IconStyles.icon, IconStyles[name]], className)} onClick={onClick} style={style} />
}

export default Icon
