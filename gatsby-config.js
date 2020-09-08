/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`
})
console.log(`Enviroment .env.${process.env.NODE_ENV}`)
console.log(`Api url ${process.env.SERVER}`)

module.exports = {
  /* Your site config here */
  plugins: [
    'gatsby-ipfs-web-wallet',
    'gatsby-plugin-bch-tx-history'
  ]
}
