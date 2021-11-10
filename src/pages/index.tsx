import { Content } from "../Components"
import { Helmet } from "react-helmet"
import { Global as Layout } from "../Layouts"
import { PromptProvider } from "../Contexts/PromptContext"
import React from "react"

const Index: React.FC = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Poland Weather App</title>
        <html lang="pl" />
        <meta name="description" content="Poland Weather App" />
      </Helmet>
      <PromptProvider>
        <Layout>
          <Content />
        </Layout>
      </PromptProvider>
    </>
  )
}

export default Index
