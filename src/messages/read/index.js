import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import Inbox from './inbox'
import MessageCard from './message-card'

import 'react-notifications-component/dist/theme.css'
import { Box, Row, Col } from 'adminlte-2-react'

import { downloadMessage, getMail, findName } from '../services'

import './read.css'

import NOTIFICATION from '../notification'
const Notification = new NOTIFICATION()

// bch-encrypt-lib
const EncryptLib = typeof window !== 'undefined' ? window.BchEncryption : null

// bch-message-lib
const BchMessage = typeof window !== 'undefined' ? window.BchMessage : null

let _this
class ReadMessages extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      message: '',
      bchWallet: '',
      walletInfo: '',
      messagesLib: '',
      encryptLib: '',
      messagesReceived: [],
      messagesSent: [],
      associatedNames: {},
      section: 'inbox',
      inFetch: true
    }
    _this.Notification = Notification

    _this.EncryptLib = EncryptLib
    _this.BchMessage = BchMessage
  }

  render () {
    const {
      section,
      associatedNames,
      messagesReceived,
      messagesSent,
      inFetch
    } = _this.state

    return (
      <div className="message-container">
        <Helmet
          title="message.FullStack.cash"
          meta={[
            { name: 'description', content: 'Pay BCH to send messages' },
            {
              name: 'keywords',
              content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages'
            }
          ]}
        />
        {_this.props.bchWallet && (
          <Inbox
            hanldeOnReadMessage={_this.hanldeOnReadMessage}
            messages={section === 'inbox' ? messagesReceived : messagesSent}
            associatedNames={associatedNames}
            handleChangeSection={_this.onHandleChangeSection}
            inFetch={inFetch}
          />
        )}

        {_this.state.message && (
          <MessageCard
            message={_this.state.message}
            menuNavigation={_this.props.menuNavigation}
          />
        )}

        {!_this.props.bchWallet && (
          <Box padding="true" className="container-nofound">
            <Row>
              <Col xs={12}>
                <em>You need to create or import a wallet</em>
              </Col>
            </Row>
          </Box>
        )}
      </div>
    )
  }

  onHandleChangeSection (section) {
    try {
      if (!section || typeof section !== 'string') {
        throw new Error('Error changin section. Section must be a string')
      }
      console.log(`Change to : ${section}`)
      _this.setState({
        section,
        message: ''
      })
    } catch (error) {
      console.error('onHandleChangeSection()', error)
    }
  }

  async hanldeOnReadMessage (message) {
    try {
      const { walletInfo } = _this.props
      const msgObject = await downloadMessage(message.ipfsHash)

      // Notify the user if the message does not contain a
      // copy that can be decrypted by the sender
      if (message.sender === walletInfo.cashAddress && !msgObject.senderCopy) {
        message.message =
          'This message has been sent in an older version, so it can only be read by the receiver'
        message.error = true
        _this.setState({
          message
        })

        return
      }

      let encryptedMsg
      // Validating protocol versions
      if (
        Array.isArray(msgObject.message) &&
        Array.isArray(msgObject.receivers)
      ) {
        // Searchs for the associated message to the current wallet
        msgObject.receivers.map((val, i) => {
          if (val === walletInfo.cashAddress) {
            encryptedMsg = msgObject.message[i]
          }
        })
      } else {
        // If the message and receivers properties are not an
        // array is because this message is using the old specs
        encryptedMsg = msgObject.message
      }

      // If the message has been sended from the current wallet
      // the encrypted message stored in the 'senderCopy'
      // property will be used
      if (msgObject.sender === walletInfo.cashAddress) {
        encryptedMsg = msgObject.senderCopy
      }
      const decryptedMsg = await _this.decryptMsg(
        walletInfo.privateKey,
        encryptedMsg
      )

      message.message = decryptedMsg
      _this.setState({
        message
      })
    } catch (error) {
      console.error(error)
      _this.Notification.notify('Error', error.message, 'danger')
    }
  }

  // Decrypt a message
  async decryptMsg (privKey, encryptedMsg) {
    try {
      const { encryptLib } = _this.state

      const decryptedHex = await encryptLib.encryption.decryptFile(
        privKey,
        encryptedMsg
      )
      const decryptedBuff = Buffer.from(decryptedHex, 'hex')
      const decryptedMsg = decryptedBuff.toString()
      return decryptedMsg
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  // Life Cicle
  async componentDidMount () {
    try {
      // await _this.instanceWallet() // Instantiate minimal-slp-wallet-web
      await _this.instanceEncryption() // Instantiate bch-encrypt-lib
      await _this.instanceMessagesLib() // Instantiate bch-message-lib
      await _this.findMessages()
    } catch (error) {
      console.error(error)
    }
  }

  // Instantiate messages library
  async instanceMessagesLib () {
    try {
      const { bchWallet } = _this.props
      if (!bchWallet) return null
      // The constructor of the messages  library needs a parameter,
      // this parameter is a object with the bchjs library
      const bchjs = bchWallet.bchjs

      if (!_this.BchMessage) {
        console.warn('bch-message-lib not loaded!')
      }

      const messagesLib = new _this.BchMessage({ bchjs })

      _this.setState({
        messagesLib
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Instantiate encryption library
  async instanceEncryption () {
    try {
      const { bchWallet } = _this.props
      if (!bchWallet) return null
      // The constructor of the encryption library needs a parameter,
      // this parameter is the bchjs library
      // const BCHJS = bchWallet.BCHJS
      const encryptLib = new EncryptLib({ bchjs: bchWallet.bchjs })

      // Overwrite the bchjs instance of the encryption library,
      // for the bchjs instance of the client
      // encryptLib.bchjs = bchWallet.bchjs

      _this.setState({
        encryptLib
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Find messages signals
  async findMessages () {
    try {
      const { walletInfo } = _this.props
      const { cashAddress } = walletInfo

      if (!cashAddress) {
        return null
      }
      const messages = await getMail(cashAddress)
      console.log(`Messages : ${JSON.stringify(messages, null, 2)}`)

      // Search names associated to the sender address
      const associatedNames = await _this.findNames(messages)
      // console.log(`associatedNames: ${JSON.stringify(associatedNames, null, 2)}`)

      // Split messages
      const messagesObject = _this.splitMessages(messages)
      console.log(`messagesObject : ${JSON.stringify(messagesObject, null, 2)}`)

      _this.setState({
        messagesReceived: messagesObject.received,
        messagesSent: messagesObject.sent,
        associatedNames,
        inFetch: false
      })
    } catch (error) {
      _this.setState({
        inFetch: false,
        messagesSent: [],
        messagesReceived: []
      })
      _this.Notification.notify(
        'Error',
        'there was an error trying to fetch the messages',
        'danger'
      )

      console.error(error)
    }
  }

  // Split all messages array to Sent and Received messages
  splitMessages (messages) {
    try {
      const { walletInfo } = _this.props
      const { cashAddress } = walletInfo

      const received = []
      const sent = []

      messages.map((val, i) => {
        if (val.sender === cashAddress) {
          sent.push(val)
        } else {
          received.push(val)
        }
      })

      return {
        received,
        sent
      }
    } catch (error) {}
  }

  // Find names associated to the sender address
  async findNames (messages) {
    try {
      const namesObject = {}
      for (let i = 0; i < messages.length; i++) {
        const val = messages[i]
        const addr = val.sender
        // Prevents repeating searching
        // an address already consulted
        if (!namesObject[addr]) {
          const name = await findName(addr)
          if (name && name !== 'notAvailable') {
            namesObject[addr] = name
          } else {
            namesObject[addr] = addr
          }
        }
      }
      return namesObject
    } catch (error) {
      console.error(error)
    }
  }
}

ReadMessages.propTypes = {
  walletInfo: PropTypes.object.isRequired,
  bchWallet: PropTypes.object,
  menuNavigation: PropTypes.object
}
export default ReadMessages
