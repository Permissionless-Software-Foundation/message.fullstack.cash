/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Box, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

let _this

class MessageCard extends React.Component {
  constructor(props) {
    super(props)
    _this = this

    this.state = {
      message: {}
    }
  }

  render() {
    const { subject, email, message, time } = _this.state.message
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
              <Button className="btn-icon-add" icon="fa-trash" />
              <Button className="btn-icon-add" icon="fa-reply" />
              <Button className="btn-icon-add" icon="fa-share" />
              <Button className="btn-icon-add" icon="fa-print" />
            </div>
            <hr></hr>
            <div className="mail-message">{message}</div>
            <hr></hr>
            <div className="mail-footer">
              <div>
                <Button text="Delete" className="mr-2" icon="fa-trash" />
                <Button text="Print" className="mr-2" icon="fa-print" />
              </div>
              <div>
                <Button text="Reply" className="mr-2" icon="fa-reply" />
                <Button text="Forward" className="mr-2" icon="fa-share" />
              </div>
            </div>
          </Box>
        }
      </div>
    )
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
  message: PropTypes.object.isRequired
}
export default MessageCard
