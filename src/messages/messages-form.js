/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
const { Text, Textarea } = Inputs

import CircularProgress from '@material-ui/core/CircularProgress'

import NOTIFICATION from './notification'
const Notification = new NOTIFICATION()

const EncryptLib = typeof window !== 'undefined' ? window.BchEncryption : null

let _this

class MessagesForm extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.Notification = Notification

    this.state = {
      address: '',
      subject: '',
      message: ''
    }

    _this.EncryptLib = EncryptLib

  }

  render() {
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
              defaultValue={_this.state.address}
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
              defaultValue={_this.state.subject}
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
              defaultValue={_this.state.message}
              onChange={this.handleUpdate}

            />
          </Col>
          <Col xs={12} className="text-center">
            <Button
            className="send-btn"
              type="primary"
              text="Send"
              onClick={this.handleSendMessage}
            />
          </Col>
        </Row>
      </div>
    )
  }

  handleSendMessage() {
    try {
      console.log("Sending Message")
      _this.validateInputs()

    } catch (error) {
      console.log("Error")
      _this.Notification.notify('Error', error.message, 'danger')
    }
  }
  handleUpdate(event) {
    const name = event.target.name
    const value = event.target.value
    _this.setState(prevState => ({
      ...prevState,
      [name]: value,
    }))
    setTimeout(() => {
      console.log(_this.state)
    }, 500);
  }

  resetValues() {
    _this.setState({
      address: '',
      subject: '',
      message: '',
    })
  }
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
  componentDidMount(){
    try {
      console.log(` Encrypt Lib ${_this.EncryptLib}`)
      const encryptLib = new _this.EncryptLib()
      console.log(encryptLib)
    } catch (error) {
      console.error(error)
    }

  }

}


export default MessagesForm