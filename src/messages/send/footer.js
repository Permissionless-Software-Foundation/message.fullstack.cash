import React from 'react'
import { Row, Col, Box } from 'adminlte-2-react'

let _this
class SendMessageFooter extends React.Component {
  constructor (props) {
    super(props)
    _this = this

    this.state = {
      createTimeStamp: '',
      deleteTimeStamp: ''
    }
  }

  render () {
    const { createTimeStamp, deleteTimeStamp } = _this.state
    return (
      <Row className='message-send-footer'>
        <Col xs={12}>
          <Box>
            <p>
              Message created: <b>{createTimeStamp}</b>
            </p>
            <p>
              Message will be automatically deleted: <b>{deleteTimeStamp}</b>
            </p>
          </Box>
        </Col>
      </Row>
    )
  }

  componentDidMount () {
    _this.getTimeStamp()
    _this.refreshTimeStamp()
  }

  // Interval to update the dates
  refreshTimeStamp () {
    setInterval(() => {
      _this.getTimeStamp()
    }, 1000 * 60)
  }

  getTimeStamp () {
    // Create TimeStamp
    const createTimeStamp = new Date()
    const deleteTimeStamp = new Date()

    // Set 30 days after
    deleteTimeStamp.setDate(deleteTimeStamp.getDate() + 30)

    _this.setState({
      createTimeStamp: createTimeStamp.toString(),
      deleteTimeStamp: deleteTimeStamp.toString()
    })
  }
}

export default SendMessageFooter
