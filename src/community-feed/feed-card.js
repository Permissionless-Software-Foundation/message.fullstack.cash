/* eslint-disable */
import React, { Component } from "react"
import PropTypes from "prop-types"
import { Row, Col, Box } from "adminlte-2-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

let _this

class FeedCard extends React.Component {
  constructor(props) {
    super(props)
    _this = this

    this.state = {}
  }

  render() {
    const { message } = _this.props
    const { merit, tokenAge, tokenBalance, sender, text } = message
    const fixedMerit = parseFloat(merit).toFixed(0)
    const fixedBalance = parseFloat(tokenBalance).toFixed(0)
    const fixedAge = parseFloat(tokenAge).toFixed(0)
    return (
      <div >
        {
          <Box className="feed-card ">
            <Row>
              <Col xs={12}>
                <Row>

                  <Col xs={12} className="feed-header">
                    <h4>{sender}</h4>

                  </Col>

                  <Col xs={12} className="feed-body">
                    <div className="feed-msg">
                      <p>{text}</p>
                    </div>

                    <div className="feed-icons-container">
                      <p data-toggle="tooltip" data-placement="top" title="Token Balance">
                        <FontAwesomeIcon
                          className='title-icon'
                          size='xs'
                          icon='coins'
                        />
                        <span>{fixedBalance}</span>

                      </p>
                      <p data-toggle="tooltip" data-placement="top" title="Token Age">
                        <FontAwesomeIcon
                          className='title-icon'
                          size='xs'
                          icon='hourglass-end'
                        />
                        <span>{fixedAge}</span>

                      </p>
                      <p data-toggle="tooltip" data-placement="top" title="Merit">
                        <FontAwesomeIcon
                          className='title-icon'
                          size='xs'
                          icon='medal'
                        />
                        <span>{fixedMerit}</span>

                      </p>
                    </div>

                  </Col>

                </Row>
              </Col>
            </Row>
          </Box>
        }
      </div>
    )
  }

  async componentDidMount() { }

  shouldComponentUpdate() {
    return false
  }
}
FeedCard.propTypes = {
  message: PropTypes.object.isRequired,
}
export default FeedCard
