/* eslint-disable */
import React, { Component } from "react"
import PropTypes from "prop-types"
import { Row, Col, Box } from "adminlte-2-react"

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
    return (
      <div >
        {
          <Box className="feed-card ">
            <Row>
              <Col xs={12}>
                <h4>{sender}</h4>
              </Col>
              <Col xs={12} >
                <div className="feed-msg">
                <p>{text}</p>
                </div> 
              </Col>

            </Row>
            <Row className="text-center">
            <Col xs={4}>
                <p>
                  <b>Token Balance: </b>
                  {tokenBalance}
                </p>
              </Col>
              <Col xs={4}>
                <p >
                  <b>Token Age: </b>
                  {tokenAge}
                </p>
              </Col>
              <Col xs={4}>
                <p>
                  <b>Merit: </b>
                  {merit}
                </p>
              </Col>
            </Row>
          </Box>
        }
      </div>
    )
  }

  async componentDidMount() { }
}
FeedCard.propTypes = {
  message: PropTypes.object.isRequired,
}
export default FeedCard
