/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getMessages } from './services'
import { Row, Col, Box, Inputs, Button } from 'adminlte-2-react'
const { Text, Textarea } = Inputs

import CircularProgress from '@material-ui/core/CircularProgress'
import FeedCard from './feed-card'

let _this
const feedList = [
  {
    merit: 'merit1',
    tokenAge: 'March 2020',
    tokenBalance: 1.0,
    sender: 'bitcoincash:qq5z2rqupzthfwt8ttyvfref0avgg7p46qu0q9g3z6',
    text: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
  },
  {
    merit: 'merit2',
    tokenAge: 'March 2020',
    tokenBalance: 1.0,
    sender: 'bitcoincash:qq5z2rqupzthfwt8ttyvfref0avgg7p46qu0q9g3z6',
    text: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
  },
  {
    merit: 'merit3',
    tokenAge: 'March 2020',
    tokenBalance: 1.0,
    sender: 'bitcoincash:qq5z2rqupzthfwt8ttyvfref0avgg7p46qu0q9g3z6',
    text: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
  },
  {
    merit: 'merit4',
    tokenAge: 'March 2020',
    tokenBalance: 1.0,
    sender: 'bitcoincash:qq5z2rqupzthfwt8ttyvfref0avgg7p46qu0q9g3z6',
    text: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500sis simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
  },
  {
    merit: 'merit5',
    tokenAge: 'March 2020',
    tokenBalance: 1.0,
    sender: 'bitcoincash:qq5z2rqupzthfwt8ttyvfref0avgg7p46qu0q9g3z6',
    text: 'is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
  },
  {
    merit: 'merit6',
    tokenAge: 'March 2020',
    tokenBalance: 1.0,
    sender: 'bitcoincash:qq5z2rqupzthfwt8ttyvfref0avgg7p46qu0q9g3z6',
    text: 'is simply dummy text of the printing and '
  }
]
class FeedView extends React.Component {
  constructor(props) {
    super(props)
    _this = this

    this.state = {
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
      _this.setState({
        messages: feedList //resp.messages
      })
    } catch (error) {
      console.error(error)
    }
  }



}
export default FeedView