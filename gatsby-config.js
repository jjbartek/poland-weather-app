module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-scss-typescript`,
      options: {
        sassLoaderOptions: {
          data: `@import "./src/styles/imports/_globals.scss";`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`poppins\:200,300,400,500,600`],
        display: "swap",
      },
    },
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /svg-components/,
        },
      },
    },
    `gatsby-plugin-typescript`,
    `gatsby-plugin-tslint`,
    `gatsby-plugin-react-helmet`,
  ],
}
