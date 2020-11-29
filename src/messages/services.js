const axios = require('axios').default

// Detect if the app is running in a browser.
export const isBrowser = () => typeof window !== 'undefined'

// Downloads the content from Temporal
export const downloadMessage = async (hash) => {
  try {
    const url = 'https://gateway.temporal.cloud/ipfs'
    const options = {
      method: 'GET',
      url: `${url}/${hash}`,
      headers: {
        Accept: 'application/json'
      }
    }
    const result = await axios(options)
    return result.data.message
  } catch (err) {
    console.warn(err)
    throw err
  }
}

export const getMail = async (addr) => {
  try {
    const url = `${process.env.COMMUNITY_API}/mail`
    const options = {
      method: 'GET',
      url: `${url}/${addr}`,
      headers: {
        Accept: 'application/json'
      }
    }
    const result = await axios(options)
    return result.data.mail
  } catch (err) {
    console.warn(err)
    throw err
  }
}
