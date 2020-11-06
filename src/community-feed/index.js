import React from 'react'
import Helmet from 'react-helmet'
import FeedView from './feeds-view'
import './community.css'

class CommunityFeed extends React.Component {
  render () {
    return (
      <div>
        <Helmet
          title='message.FullStack.cash'
          meta={[
            { name: 'description', content: 'Pay BCH to send messages' },
            { name: 'keywords', content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages' }
          ]}
        />
        <FeedView />
      </div>
    )
  }
}
export default CommunityFeed
