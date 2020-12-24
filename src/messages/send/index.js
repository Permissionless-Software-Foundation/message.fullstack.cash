import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import MessagesForm from './messages-form'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './send.css'
class SendMessage extends React.Component {
  render () {
    return (
      <div className='message-container'>
        <ReactNotification />

        <Helmet
          title='message.FullStack.cash'
          meta={[
            { name: 'description', content: 'Pay BCH to send messages' },
            { name: 'keywords', content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages' }
          ]}
        />
        <MessagesForm menuNavigation={this.props.menuNavigation} />
      </div>
    )
  }
}

SendMessage.propTypes = {
  menuNavigation: PropTypes.object
}
export default SendMessage
