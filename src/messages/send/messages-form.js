/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CircularProgress from '@material-ui/core/CircularProgress'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
const { Text, Textarea } = Inputs

import NOTIFICATION from '../notification'
const Notification = new NOTIFICATION()

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const SERVER = process.env.FILE_SERVER

// bch-encrypt-lib
const EncryptLib = typeof window !== 'undefined' ? window.BchEncryption : null

// minimal-slp-wallet-web
const BchWallet = typeof window !== 'undefined' ? window.SlpWallet : null

// bch-message-lib
const BchMessage = typeof window !== 'undefined' ? window.BchMessage : null

const cloudUrl = 'https://hub.textile.io/ipfs/'

let _this

class MessagesForm extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.Notification = Notification

    this.state = {
      address: '',
      subject: '',
      message: '',
      bchWallet: '',
      hash: '',
      inFetch: false,
      encryptLib: '',
      walletInfo: '',
      txId: '',
      fileUploaded: '',
      timeStampText: '',
      failArray: [],
      successArray: []
    }

    _this.EncryptLib = EncryptLib
    _this.BchWallet = BchWallet
    _this.BchMessage = BchMessage
  }

  render() {
    const {
      address,
      hash,
      inFetch,
      subject,
      message,
      txId,
      fileUploaded,
      timeStampText,
      failArray,
      successArray
    } = _this.state
    return (
      <div className="messages-form-container">
        <Row>
          <Col xs={12}>
            <Text
              id="BCH-Address"
              name="address"
              placeholder="Enter BCH Address"
              label="BCH Address"
              labelPosition="above"
              onChange={this.handleUpdate}
              value={address}
              disabled={hash || inFetch || fileUploaded}
            />
          </Col>
          <Col xs={12}>
            <Text
              id="Subject"
              name="subject"
              placeholder="Enter a subject"
              label="Subject"
              labelPosition="above"
              onChange={this.handleUpdate}
              value={subject}
              disabled={hash || inFetch || fileUploaded}
            />
          </Col>
          <Col xs={12} className="message-body-container">
            <Text
              id="Message"
              name="message"
              inputType="textarea"
              label="Message"
              labelPosition="above"
              rows={8}
              value={message}
              onChange={this.handleUpdate}
              disabled={hash || inFetch || fileUploaded}
            />
            <div
              className={`body-timestamp mb-2 ${
                hash || inFetch || fileUploaded ? 'disabled' : ''
              }`}
            >
              {timeStampText}
            </div>
          </Col>
          <Col xs={12} className="text-center">
            {hash && (
              <div>
                <FontAwesomeIcon
                  className="title-icon mb-1 mt-1"
                  size="xs"
                  icon="check-circle"
                />
              </div>
            )}
            {/* show addresses that could not send the message  */}
            {!inFetch &&
              (hash || fileUploaded) &&
              failArray.map((val, i) => {
                return (
                  <p key={val + i} className="error-text">
                    {val}
                  </p>
                )
              })}
            {/* show addresses that was able to send the message */}
            {!inFetch &&
              (hash || fileUploaded) &&
              successArray.map((val, i) => {
                return (
                  <p key={val + i} className="success-text">
                    {val}
                  </p>
                )
              })}
            {hash && (
              <div>
                <div>
                  IPFS HASH:
                  <a href={`${cloudUrl}${hash}`} target="_blank">
                    {hash}
                  </a>
                </div>
              </div>
            )}
            {txId && (
              <div className="mt-1">
                Transaction ID:{' '}
                <a
                  href={`https://explorer.bitcoin.com/bch/tx/${txId}`}
                  target="_blank"
                >
                  {txId}
                </a>
              </div>
            )}
            {!hash && !inFetch && (
              <Button
                className="send-btn mt-1"
                type="primary"
                text={fileUploaded ? 'Try Again' : 'Send'}
                onClick={this.handleSendMessage}
              />
            )}
            {inFetch && <CircularProgress className="main-color" />}
            {!inFetch && (hash || fileUploaded) && (
              <Button
                className="send-btn mt-1 mr-1 ml-1 "
                type="primary"
                text="Reset"
                onClick={this.resetValues}
              />
            )}
          </Col>
        </Row>
      </div>
    )
  }

  handleScroll() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  // Verifies if it has to fill the form
  // with the information of a response
  isReply() {
    try {
      const { menuNavigation } = _this.props
      const { message } = menuNavigation.data
      if (message.action && message.action !== 'reply') {
        return
      }
      let subject = message.subject

      // Verify if the subject has a 'Re:' prefix
      let prefix = subject.substr(0, 3)
      if (!prefix.toLowerCase().match('re:')) {
        subject = `Re: ${subject}`
      }

      if (message && typeof message.id !== 'undefined') {
        _this.setState({
          address: message.sender,
          subject: subject
        })
      }
      // top scroll
      _this.handleScroll()

      // Reset redux state data
      menuNavigation.changeTo(null, {})
    } catch (error) {
      //console.error(error)
    }
  }
  // Verifies if it has to fill the form
  // with the information of a forward
  isForward() {
    try {
      const { menuNavigation } = _this.props
      const { message } = menuNavigation.data
      if (message.action && message.action !== 'forward') {
        return
      }
      let subject = message.subject
      // Verify if the subject has a 'Fwd:' prefix
      let prefix = subject.substr(0, 4)
      if (!prefix.toLowerCase().match('fwd:')) {
        subject = `Fwd: ${subject}`
      }
      // Add prefix to each line
      const msg = message.message.replace(/^/gm, '> ')

      if (message && typeof message.id !== 'undefined') {
        _this.setState({
          subject: subject,
          message: msg //message.message
        })
      }
      // top scroll
      _this.handleScroll()

      // Reset redux state data
      menuNavigation.changeTo(null, {})
    } catch (error) {
      //console.error(error)
    }
  }
  // Life Cicle
  async componentDidMount() {
    try {
      await _this.instanceWallet() // Instantiate minimal-slp-wallet-web
      await _this.instanceEncryption() // Instantiate bch-encrypt-lib
      await _this.instanceMessagesLib() // Instantiate bch-message-lib
      _this.isReply()
      _this.isForward()
      // Set timeStamp
      _this.setState({
        timeStampText: _this.getTimeStamp()
      })
    } catch (error) {
      console.error(error)
    }
  }

  handleUpdate(event) {
    const name = event.target.name
    const value = event.target.value
    _this.setState(prevState => ({
      ...prevState,
      [name]: value
    }))
  }
  // Instance Wallet
  async instanceWallet() {
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
  async instanceMessagesLib() {
    try {
      const { bchWallet } = _this.state

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
  async instanceEncryption() {
    try {
      const { bchWallet } = _this.state

      // The constructor of the encryption library needs a parameter,
      // this parameter is the bchjs library
      // const BCHJS = bchWallet.BCHJS
      const encryptLib = new EncryptLib({bchjs: bchWallet.bchjs})

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

  // Get public key from bch address
  async getPubKey(address) {
    try {
      const { encryptLib } = _this.state
      const pubKey = await encryptLib.getPubKey.queryBlockchain(address)

      return pubKey
    } catch (error) {
      return false
    }
  }

  // Encrypt a message
  async encryptMsg(pubKey, msg) {
    try {
      const { encryptLib } = _this.state

      const buff = Buffer.from(msg)
      const hex = buff.toString('hex')
      const encryptedMsg = await encryptLib.encryption.encryptFile(pubKey, hex)

      return encryptedMsg
    } catch (error) {
      throw error
    }
  }
  splitAddresses(addresses) {
    try {
      const withoutSpaces = addresses.replace(/ /g, '')
      const splited = withoutSpaces.split(',')
      return splited
    } catch (error) {
      throw error
    }
  }
  // encrypt messages for each bch address
  async encryptMessages(addresses, msgBody) {
    let failArray = [] // Fail addresses array
    let successArray = [] // Success adressess array
    let encryptedMessages = [] // encrypted messages array

    // Maps each address to get its public key
    for (let i = 0; i < addresses.length; i++) {
      const addr = addresses[i]
      try {
        // Get public key from receiver bch address
        const pubKey = await _this.getPubKey(addr)
        console.log(`${addr} public key : ${pubKey}`)

        if (!pubKey) {
          throw new Error(`Public key could not be found`)
        }

        // Encrypt Message
        const encryptedMsg = await _this.encryptMsg(pubKey, msgBody)
        if (!encryptedMsg) {
          throw new Error(`Error trying to encrypt message`)
        }
        encryptedMessages.push(encryptedMsg)
        successArray.push(addr)
      } catch (error) {
        console.warn(error)
        // ignore blank spaces
        if (addr) {
          failArray.push(`${addr} : ${error.message || 'Unhandled Error'}`)
        }
      }
    }
    return {
      failArray,
      successArray,
      encryptedMessages
    }
  }
  // Submit message
  async handleSendMessage() {
    try {
      _this.setState({
        inFetch: true
      })

      const { address, subject, message } = _this.state
      const { walletInfo } = _this.props
      _this.validateInputs()

      const addresses = _this.splitAddresses(address)

      // Get my public key from bch address
      const senderPubKey = await _this.getPubKey(walletInfo.cashAddress)
      console.log(`senderPubKey : ${senderPubKey}`)

      // add timeStamp into message body
      const msgBody = `${message}\n\n\n\n${_this.state.timeStampText}`

      // Encrypt message for the sender
      const senderCopy = await _this.encryptMsg(senderPubKey, msgBody)

      const {
        failArray,
        successArray,
        encryptedMessages
      } = await _this.encryptMessages(addresses, msgBody)

      if (!successArray.length) {
        throw new Error(`The addresses don't have a public key`)
      }

      // Payload content
      const jsonObject = {
        receivers: successArray,
        sender: walletInfo.cashAddress,
        subject,
        message: encryptedMessages,
        senderCopy
      }
      console.log('jsonObject', jsonObject)

      // Uploading message
      // Uploads the encrypted message to ipfs if this has not been
      // previously uploaded during a failed atempt obtaining the hash

      let fileUploaded
      if (!_this.state.fileUploaded) {
        fileUploaded = await _this.uploadFile(jsonObject, 'message.json')
        _this.setState({
          fileUploaded: fileUploaded
        })
      } else {
        fileUploaded = _this.state.fileUploaded
      }

      // Try to get the ipfs hash of the uploaded file
      // in a defined interval number of time intervals
      const hash = await _this.tryGetHash(fileUploaded)
      if (!hash) {
        throw new Error('Error validating payment')
      }

      const txId = await _this.signalMessage(
        hash,
        jsonObject.receivers,
        subject
      )

      _this.setState({
        inFetch: false,
        hash,
        txId,
        failArray,
        successArray
      })

      _this.Notification.notify('Message Sent', 'Success!!', 'success')
    } catch (error) {
      console.error('Error', error)
      _this.Notification.notify('Error', error.message, 'danger')
      _this.setState({
        inFetch: false
      })
    }
  }
  // Try to get the hash of the uploaded file
  // in a defined interval number of time intervals
  async tryGetHash(fileUploaded) {
    // After the payment is done, this promise is used
    // to validate the payment using a interval
    // this time interval is used to assure the transaction.
    const hash = await new Promise(resolve => {
      let attempts = 0
      const limit = 5
      const time = 5000

      const getHash = setInterval(async () => {
        const hashResult = await _this.checkHash(fileUploaded.file._id)
        attempts += 1

        if (hashResult || attempts >= limit) {
          const result = hashResult || false
          clearInterval(getHash)
          resolve(result)
        }
      }, time)
    })
    return hash
  }
  async uploadFile(objectData, name) {
    try {
      const { bchWallet } = _this.state

      // Create Local File Object
      const content = [JSON.stringify(objectData)]
      const options = { type: 'application/json' }
      const file = new File(content, name, options)

      // Gets file model
      const fileData = await bchWallet.bchjs.IPFS.createFileModelWeb(file)
      if (!fileData.success) throw new Error('Error creating file model')

      const fileModel = fileData.file
      const uploadResult = await bchWallet.bchjs.IPFS.uploadFileWeb(
        file,
        fileModel._id
      )

      // Transaction data
      const receivers = [
        {
          address: fileData.file.bchAddr,
          // amount in satoshis, 1 satoshi = 0.00000001 Bitcoin
          amountSat: Math.floor(Number(fileData.hostingCostBCH) * 100000000)
        }
      ]

      // Ensure the wallet UTXOs are up-to-date.
      const walletAddr = bchWallet.walletInfo.address
      await bchWallet.utxos.initUtxoStore(walletAddr)

      await bchWallet.send(receivers)

      return {
        file: fileData.file
      }
    } catch (error) {
      throw error
    }
  }

  async checkHash(fileId) {
    try {
      let hash = ''
      const resultFile = await _this.checkPayment(fileId)

      const fileData = resultFile.file

      if (fileData && fileData.payloadLink) {
        hash = fileData.payloadLink
      }

      return hash
    } catch (error) {
      throw error
    }
  }
  // Check payment
  async checkPayment(fileId) {
    // Try to get  metadata by id
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const resp = await fetch(`${SERVER}/files/check/${fileId}`, options)
      if (resp.ok) {
        return resp.json()
      } else {
        return false
      }
    } catch (e) {
      return false
    }
  }

  async signalMessage(ipfsHash, receivers, subject) {
    try {
      const { messagesLib, walletInfo } = _this.state
      const { privateKey } = walletInfo

      const txHex = await messagesLib.memo.writeMsgSignal(
        privateKey,
        ipfsHash,
        receivers,
        subject
      )
      if (!txHex) {
        throw new Error('Could not build a hex transaction')
      }

      const txidStr = await messagesLib.bchjs.RawTransactions.sendRawTransaction(
        txHex
      )

      return txidStr
    } catch (error) {
      throw error
    }
  }

  resetValues() {
    _this.setState({
      address: '',
      subject: '',
      message: '',
      hash: '',
      txId: '',
      inFetch: false,
      fileUploaded: false,
      failArray: [],
      successArray: []
    })

    // Note: Trying to send a message for a second time will
    // throw the 'uppy already has a file loaded' error
    // instancing the wallet again will prevent this error
    _this.instanceWallet()
  }

  // Validate entries
  validateInputs() {
    try {
      const { address, subject, message } = _this.state

      if (!address) {
        throw new Error('Address is required')
      }

      if (!subject) {
        throw new Error('Subject is required')
      }

      if (!message) {
        throw new Error('Message is required')
      }
    } catch (err) {
      throw err
    }
  }

  getTimeStamp() {
    // Create TimeStamp
    const createTimeStamp = new Date()
    const deleteTimeStamp = new Date()

    // Set 30 days after
    deleteTimeStamp.setDate(deleteTimeStamp.getDate() + 30)

    _this.setState({
      createTimeStamp: createTimeStamp.toString(),
      deleteTimeStamp: deleteTimeStamp.toString()
    })

    return `\nMessage created: ${createTimeStamp.toString()} \nMessage will be automatically deleted: ${deleteTimeStamp.toString()}
    `
  }
}
MessagesForm.propTypes = {
  menuNavigation: PropTypes.object,
  walletInfo: PropTypes.object
}

export default MessagesForm
