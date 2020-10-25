const axios = require('axios').default

// Detect if the app is running in a browser.
export const isBrowser = () => typeof window !== 'undefined'

export const getMessages = async () => {
  // Try to get  payload by id
  try {
    const options = {
      method: 'GET',
      url: `${process.env.COMMUNITY_API}/messages`,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const resp = await axios(options)
    const result = resp.data
    if (resp.status === 200) {
      return result
    } else {
      return false
    }
  } catch (e) {
    return false
  }
}
