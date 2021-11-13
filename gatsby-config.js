module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        implementation: require("sass"),
        additionalData: `@import "globals";
        @import "~include-media";`,
        sassOptions: {
          includePaths: [`${__dirname}/src/Styles`],
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
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-dts-css-modules`,
  ],
}
