/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CircularProgress from '@material-ui/core/CircularProgress'
import { getWalletInfo } from 'gatsby-ipfs-web-wallet/src/components/localWallet'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
const { Text, Textarea } = Inputs


import NOTIFICATION from './notification'
const Notification = new NOTIFICATION()

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SERVER = process.env.SERVER

const EncryptLib =
  typeof window !== 'undefined' ?
    window.BchEncryption :
    null

const BchWallet =
  typeof window !== 'undefined'
    ? window.SlpWallet
    : null

const cloudUrl = 'https://gateway.temporal.cloud/ipfs/'

let _this

class MessagesForm extends React.Component {
  constructor(props) {
    super(props)
    console.log("props", props)
    _this = this
    this.Notification = Notification

    this.state = {
      address: '',
      subject: '',
      message: '',
      bchWallet: '',
      hash: '',
      inFetch: false,
      startedLoop: false
    }

    _this.EncryptLib = EncryptLib
    _this.BchWallet = BchWallet
  }

  render() {
    const { address, hash, inFetch, subject, message, startedLoop } = _this.state
    return (
      <div>
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
              disabled={hash || inFetch}
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
              disabled={hash || inFetch}
            />
          </Col>
          <Col xs={12}>
            <Text
              id="Message"
              name="message"
              inputType="textarea"
              label="Message"
              labelPosition="above"
              rows={8}
              value={message}
              onChange={this.handleUpdate}
              disabled={hash || inFetch}
            />
          </Col>
          <Col xs={12} className="text-center">
            {
              startedLoop && <p>'Checking for payment...'</p>
            }
            {
              hash && <div>
                <div>
                  <FontAwesomeIcon
                    className='title-icon mb-1 mt-1'
                    size='xs'
                    icon='check-circle' />
                </div>
                <a href={`${cloudUrl}/${hash}`} target="_blank">{hash}</a>
              </div>
            }
            {(!hash && !inFetch) &&
              <Button
                className="send-btn"
                type="primary"
                text="Send"
                onClick={this.handleSendMessage}
              />
            }
            {
              (inFetch || startedLoop) &&
              <CircularProgress className="main-color" />
            }
            {hash &&
              <Button
                className="send-btn mt-1"
                type="primary"
                text="Reset"
                onClick={this.resetValues}
              />
            }

          </Col>
        </Row>
      </div>
    )
  }
  // Submit message
  async handleSendMessage() {
    try {
      _this.setState({
        inFetch: true
      })

      const { address, subject, message } = _this.state

      _this.validateInputs()

      const fileUploaded = await _this.uploadFile({ address, subject, message }, "message.json")

      await _this.checkHashLoop(fileUploaded.file._id)

      _this.Notification.notify('Message Sent', 'Success!!', 'success')

    } catch (error) {
      console.error("Error", error.message)
      _this.Notification.notify('Error', error.message, 'danger')
      _this.setState({
        inFetch: false
      })
    }
  }

  async uploadFile(objectData, name) {
    try {
      const { bchWallet } = _this.state

      // Create Local File Object
      const content = [JSON.stringify(objectData)]
      const options = { type: "application/json" }
      const file = new File(content, name, options)

      // Gets file model
      const fileData = await bchWallet.bchjs.IPFS.createFileModelWeb(file);
      if (!fileData.success) throw new Error('Error creating file model')


      const fileModel = fileData.file
      const uploadResult = await bchWallet.bchjs.IPFS.uploadFileWeb(file, fileModel._id)

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
        file: fileData.file,
      }
    } catch (error) {
      throw error
    }
  }

  handleUpdate(event) {
    const name = event.target.name
    const value = event.target.value
    _this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Payment verification loop
  async checkHashLoop(fileId) {
    let hash
    _this.setState({
      startedLoop: true
    })
    const myInterval = setInterval(async () => {
      hash = await _this.checkHash(fileId)

      if (hash) {
        _this.setState({
          hash: hash,
          startedLoop: false,
          inFetch: false
        })
        clearInterval(myInterval);
      }
    }, 10000);

  }

  // Verifies that the IPFS hash exists
  async checkHash(fileId) {
    let hash = ''
    const resultFile = await _this.getFileById(fileId)

    const fileData = resultFile.file
    if (fileData && fileData.payloadLink) {
      hash = fileData.payloadLink
    }

    return hash
  }

  resetValues() {
    _this.setState({
      address: '',
      subject: '',
      message: '',
      hash: '',
      inFetch: false,
      startedLoop: false
    })
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

  // Life Cicle
  async componentDidMount() {
    try {
      console.log("component did mount")
      await _this.instanceWallet()
    } catch (error) {
      console.error(error)
    }

  }

  // Get file by id
  async getFileById(fileId) {

    // Try to get  metadata by id
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }
      const resp = await fetch(`${SERVER}/files/${fileId}`, options)

      if (resp.ok) {
        return resp.json()
      } else {
        return false
      }
    } catch (e) {
      return false
    }
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

      const bchWalletLib = new _this.BchWallet(localStorageInfo.mnemonic, bchjsOptions)

      // Update bchjs instances  of minimal-slp-wallet libraries
      bchWalletLib.tokens.sendBch.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      bchWalletLib.tokens.utxos.bchjs = new bchWalletLib.BCHJS(bchjsOptions)
      _this.setState({
        bchWallet: bchWalletLib
      })

      return bchWalletLib
    } catch (error) {
      console.error(error)
    }
  }

}


export default MessagesForm