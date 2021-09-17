import React from "react"
import { Helmet } from "react-helmet"
import Content from "../components/content"
import { global as Layout } from "../layouts"

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
