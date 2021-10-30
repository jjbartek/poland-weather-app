import React from "react"
import { Helmet } from "react-helmet"
import { Content } from "../Components"
import { Global as Layout } from "../Layouts"

const Index = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Poland Weather App</title>
        <html lang="pl" />
        <meta name="description" content="Poland Weather App" />
      </Helmet>
      <Layout>
        <Content />
      </Layout>
    </>
  )
}

export default Index
