import React from 'react'
import Helmet from 'react-helmet'

import Inbox from './inbox'
import MessageCard from './message-card'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './read.css'

let _this
class ReadMessages extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      message: ''
    }
  }

  render () {
    return (
      <div className='message-container'>
        <ReactNotification />

        <Helmet
          title='IPFS Messages for BCH | FullStack.cash'
          meta={[
            { name: 'description', content: 'Pay BCH to send messages' },
            { name: 'keywords', content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages' }
          ]}
        />
        <Inbox hanldeOnReadMessage={_this.hanldeOnReadMessage} />

        {_this.state.message &&
          <MessageCard message={_this.state.message} />}
      </div>
    )
  }

  hanldeOnReadMessage (message) {
    _this.setState({
      message
    })
  }
}
export default ReadMessages
