import { Content } from "../Components"
import { Helmet } from "react-helmet"
import { Global as Layout } from "../Layouts"
import React from "react"

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
