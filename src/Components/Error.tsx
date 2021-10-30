import { ErrorStyles } from "../Styles/Components"
import React from "react"

const Error: React.FC = () => {
  return (
    <div className="wrapper wrapper--center min-full-height">
      <div className={ErrorStyles.error}>
        <h1 className="page-headline">Wystąpił błąd :(</h1>
        <h2 className="page-description">Nie udało nam się pobrać danych pogodowych</h2>
      </div>
    </div>
  )
}

export default Error
