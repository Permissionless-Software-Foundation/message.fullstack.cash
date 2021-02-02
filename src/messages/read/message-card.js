/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

let _this
const cloudUrl = 'https://hub.textile.io/ipfs/'
// const cloudUrl = 'https://ipfs.io/ipfs/'
class MessageCard extends React.Component {
  constructor(props) {
    super(props)
    _this = this

    this.state = {
      message: {},
    }
  }

  render() {
    const { subject, email, message, time, ipfsHash, isNotify, error } = _this.state.message
    return (
      <div id="message-card">
        {
          <Box className="mail-card">
            <div className="mail-header">
              <p>Read Mail</p>
            </div>
            <hr></hr>
            <div className="mail-sub-header">
              <h2>{subject}</h2>
              <div className="mail-info">
                <p>From: {email}</p>
                <span>{time}</span>
              </div>
            </div>

            <hr></hr>
            <div className="text-center">
              {/*  <Button className="btn-icon-add" icon="fa-trash" /> */}
              <span title="Reply">
                <Button
                  title="Reply"
                  className="btn-icon-add"
                  icon="fa-reply"
                  onClick={_this.ReplyMsg} />
              </span>
              <span title="Forward">
                <Button
                  title="Forward"
                  className="btn-icon-add"
                  icon="fa-share"
                  onClick={_this.forwardMsg}
                />
              </span>

              {/* <Button className="btn-icon-add" icon="fa-print" /> */}
            </div>
            <hr></hr>
            <div
              className="mail-message"
              style={error && { color: 'red' }}
            >{message}</div>
            <hr></hr>
            {
              ipfsHash && (
                <div className="text-center mb-1">
                  <span>IPFS : <a href={`${cloudUrl}${ipfsHash}`} target="_blank">{ipfsHash}</a> </span>
                </div>
              )
            }
            <div className="mail-footer">
              <div>
                <Button
                  text="Reply"
                  icon="fa-reply"
                  onClick={_this.ReplyMsg} />
                <Button
                  text="Forward"
                  icon="fa-share"
                  onClick={_this.forwardMsg} />

              </div>
            </div>
          </Box>
        }
      </div>
    )
  }
  // Change to the "Send Message" view
  // Sends the object "message" to this view
  ReplyMsg() {
    try {
      const { message } = _this.state
      message.action = 'reply'
      _this.props.menuNavigation.changeTo('Send Message', { message })

    } catch (error) {
      console.error(error)
    }

  }
  // Change to the "Send Message" view
  // Sends the object "message" to this view
  forwardMsg() {
    try {
      const { message } = _this.state
      message.action = 'forward'
      _this.props.menuNavigation.changeTo('Send Message', { message })

    } catch (error) {
      console.error(error)
    }

  }
  async componentDidMount() {
    if (_this.state.message.id !== _this.props.message.id) {
      _this.setState({
        message: _this.props.message
      })
      _this.handleScroll()
    }
  }
  componentDidUpdate() {
    if (_this.state.message.id !== _this.props.message.id) {
      _this.setState({
        message: _this.props.message
      })
      _this.handleScroll()
    }
  }

  handleScroll() {
    const card = document.getElementById('message-card')
    card.scrollIntoView({ behavior: 'smooth' })
  }
}
MessageCard.propTypes = {
  message: PropTypes.object.isRequired,
  menuNavigation: PropTypes.object
}
export default MessageCard
