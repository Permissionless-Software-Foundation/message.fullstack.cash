/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getMessages } from './services'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
const { Text, Textarea } = Inputs
import Spinner from 'gatsby-ipfs-web-wallet/src/images/loader.gif'

import CircularProgress from '@material-ui/core/CircularProgress'
import FeedCard from './feed-card'

let _this

class FeedView extends React.Component {
  constructor(props) {
    super(props)
    _this = this

    this.state = {
      inFetch: true,
      messages: []
    }
  }

  render() {
    const { messages } = _this.state
    return (
      <>
        {_this.state.inFetch && (
          <div className="spinner">
            <img alt="Loading..." src={Spinner} width={100} />
          </div>
        )}
        <div className="feeds-notification">
          <Box padding="true" className="feeds-notification-box border-none">
            <Row >
              <Col xs={12} key="memo-profile-link">
                <center>
                  <h5>
                    Send a message to{' '}
                    <a
                      target="_blank"
                      href="https://memo.cash/profile/13hev19KaFFD7QqZEenmxUuNPNN8jxCCd5"
                    >
                      this memo.cash profile
                </a>{' '}
                to have it appear in the feed below. Note: Your address must
                hold{' '}
                    <a target="_blank" href="https://psfoundation.cash">
                      PSF tokens
                </a>{' '}
                for the message to be accepted.
              </h5>
                </center>
              </Col>
            </Row>
          </Box>
        </div>

        {!_this.state.inFetch && (
          <div className="community-view-container">
            <Row>
              {messages.map((val, i) => {
                return (
                  <Col xs={12} key={`feed-${i}`} className="mb-1">
                    <FeedCard message={val} />
                  </Col>
                )
              })}
              {!messages.length && (
                <Box padding="true" className="container-nofound">
                  <Row>
                    <Col xs={12}>
                      <em>There's no messages in the community feed</em>
                    </Col>
                  </Row>
                </Box>
              )}
            </Row>
          </div>
        )}
      </>
    )
  }

  async componentDidMount() {
    await _this.handleMessages()
  }

  async handleMessages() {
    try {
      const resp = await getMessages()

      if (!resp || !resp.messages) throw new Error('Error fetching messages')

      const messages = resp.messages.reverse()
      _this.setState({
        messages: messages,
        inFetch: false
      })
    } catch (error) {
      console.error(error)
      _this.setState({
        inFetch: false
      })
    }
  }
}

export default FeedView
