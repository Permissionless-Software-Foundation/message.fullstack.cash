import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import MessagesForm from './messages-form'
import { Row, Col, Box } from 'adminlte-2-react'

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
        {!this.props.bchWallet && (
          <Box padding='true' className='container-nofound'>
            <Row>
              <Col xs={12}>
                <em>You need to create or import a wallet</em>
              </Col>
            </Row>
          </Box>
        )}
        {
          this.props.bchWallet && (
            <MessagesForm
              menuNavigation={this.props.menuNavigation}
              walletInfo={this.props.walletInfo}
            />
          )
        }
      </div>
    )
  }
}

SendMessage.propTypes = {
  menuNavigation: PropTypes.object,
  walletInfo: PropTypes.object
}
export default SendMessage
