/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getMessages } from './services'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
const { Text, Textarea } = Inputs

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
      <div className="community-view-container">
        <Row>
          {messages.map((val, i) => {
            return <Col xs={12} key={`feed-${i}`} className="mb-1">
              <FeedCard message={val} />
            </Col>
          })
          }
          {!_this.state.inFetch && !messages.length && (
            <Box padding='true' className='container-nofound'>
              <Row>
                <Col xs={12}>
                  <em>
                    There's no messages in the community feed
                    </em>
                </Col>
              </Row>
            </Box>)
          }
        </Row>
      </div>
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