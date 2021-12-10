module.exports = {
  siteMetadata: {
    siteUrl: "https://peopleland.space",
    title: "PEOPLELAND",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-typescript",
      options: {isTSX: true, allExtensions: true}
    }
  ],
};
