import React from 'react'
import Helmet from 'react-helmet'

import Inbox from './inbox'
import MessageCard from './message-card'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'
import { Box, Row, Col } from 'adminlte-2-react'

import './read.css'
const axios = require('axios').default

// bch-encrypt-lib
const EncryptLib = typeof window !== 'undefined' ? window.BchEncryption : null

// minimal-slp-wallet-web
const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

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
      messages: [],
      associatedNames: {}
    }

    _this.EncryptLib = EncryptLib
    _this.BchWallet = BchWallet
    _this.BchMessage = BchMessage
  }

  render () {
    return (
      <div className='message-container'>
        <ReactNotification />

        <Helmet
          title='message.FullStack.cash'
          meta={[
            { name: 'description', content: 'Pay BCH to send messages' },
            {
              name: 'keywords',
              content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages'
            }
          ]}
        />
        {_this.state.bchWallet && (
          <Inbox
            hanldeOnReadMessage={_this.hanldeOnReadMessage}
            messages={_this.state.messages}
            associatedNames={_this.state.associatedNames}
          />
        )}

        {_this.state.message && <MessageCard message={_this.state.message} />}

        {!_this.state.bchWallet && (
          <Box padding='true' className='container-nofound'>
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

  async hanldeOnReadMessage (message) {
    try {
      const { walletInfo } = _this.state
      const encryptedMsg = await _this.fetchMessage(message.ipfsHash)
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
      await _this.instanceWallet() // Instantiate minimal-slp-wallet-web
      await _this.instanceEncryption() // Instantiate bch-encrypt-lib
      await _this.instanceMessagesLib() // Instantiate bch-message-lib
      await _this.findMessages()
    } catch (error) {
      console.error(error)
    }
  }

  // Instance Wallet
  async instanceWallet () {
    try {
      const localStorageInfo = getWalletInfo()

      if (!localStorageInfo.mnemonic) return null

      const jwtToken = localStorageInfo.JWT
      const restURL = localStorageInfo.selectedServer
      const bchjsOptions = {}

      if (jwtToken) {
        bchjsOptions.apiToken = jwtToken
      }
      if (restURL) {
        bchjsOptions.restURL = restURL
      }

      const bchWalletLib = new _this.BchWallet(
        localStorageInfo.mnemonic,
        bchjsOptions
      )

      // Update bchjs instances  of minimal-slp-wallet libraries
      bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      _this.setState({
        bchWallet: bchWalletLib,
        walletInfo: localStorageInfo
      })

      return bchWalletLib
    } catch (error) {
      console.error(error)
    }
  }

  // Instantiate messages library
  async instanceMessagesLib () {
    try {
      const { bchWallet } = _this.state
      if (!bchWallet) return null
      // The constructor of the messages  library needs a parameter,
      // this parameter is a object with the bchjs library
      const bchjs = bchWallet.bchjs
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
      const { bchWallet } = _this.state
      if (!bchWallet) return null
      // The constructor of the encryption library needs a parameter,
      // this parameter is the bchjs library
      const BCHJS = bchWallet.BCHJS
      const encryptLib = new EncryptLib(BCHJS)

      // Overwrite the bchjs instance of the encryption library,
      // for the bchjs instance of the client
      encryptLib.bchjs = bchWallet.bchjs

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
      const { messagesLib, walletInfo } = _this.state
      const { cashAddress } = walletInfo

      if (!cashAddress) {
        return null
      }
      const messages = await messagesLib.memo.readMsgSignal(cashAddress)

      // Search names associated to the sender address
      const associatedNames = await _this.findNames(messages)

      _this.setState({
        messages,
        associatedNames
      })
    } catch (error) {
      console.error(error)
    }
  }

  // Find names associated to the sender address
  async findNames (messages) {
    try {
      const { messagesLib } = _this.state
      const namesObject = {}
      for (let i = 0; i < messages.length; i++) {
        const val = messages[i]
        const addr = val.sender
        // Prevents repeating searching
        // an address already consulted
        if (!namesObject[addr]) {
          const name = await messagesLib.memo.findName(addr)
          if (name) {
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

  // Downloads the content from Temporal
  async fetchMessage (hash) {
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
}
export default ReadMessages
