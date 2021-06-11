/* eslint-disable */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import CircularProgress from '@material-ui/core/CircularProgress'
import { Button, Row, Col, Box } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const QRCode = require('qrcode.react')
const cloudUrl = 'https://hub.textile.io/ipfs/'

const SERVER = process.env.FILE_SERVER

let _this

class QrCode extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.Notification = Notification

    this.state = {
      msgStatus: 'Checking for payment...',
      hash: '',
      startedLoop: true,
      cloudLink: '',
      errMsg: '',
      success: false
    }
  }

  render() {
    return (
      <>
        <Row>
          <Col sm={2} />
          <Col sm={8}>
            <Box className="border-none qr-container mt-2">
              {/*       <div >

                <div className="host-container">
                  <Col sm={12} className='text-center'>
                    <h1>
                      <FontAwesomeIcon
                        className='title-icon'
                        size='xs'
                        icon='coins'
                      />
                      <span>Hosting Cost:</span>
                    </h1>
                  </Col>
                  <h5>{_this.props.hostingCostBCH} <b>BCH</b> </h5>
                  <h5>{_this.props.hostingCostUSD} <b>USD</b></h5>
                </div>

              </div> */}

              {/*            <div className="col-12">
                {
                  _this.props.bchAddr &&
                  <QRCode value={_this.props.bchAddr} size={256} includeMargin={true} fgColor={"#333"} />
                }
              </div> */}

              {/*   <div className="col-12 addr-container">
                <p> <b>{_this.props.bchAddr}</b></p>

              </div> */}

              {_this.state.startedLoop && (
                <div
                  className="status-container col-12"
                  style={
                    _this.state.hash
                      ? { backgroundColor: 'white' }
                      : { backgroundColor: 'white' }
                  }
                >
                  {/* Show progress*/}
                  {!_this.state.success && (
                    <CircularProgress className="main-color" />
                  )}
                  {/* Show check icon*/}
                  {_this.state.hash && _this.state.cloudLink && (
                    <FontAwesomeIcon
                      className="title-icon"
                      size="xs"
                      icon="check-circle"
                    />
                  )}
                  {/* Show status message*/}

                  <p className="status-msg">{_this.state.msgStatus}</p>

                  {/* Show error message*/}
                  {_this.state.errMsg && (
                    <p className="error-color">{_this.state.errMsg}</p>
                  )}
                  {/* Show link to cloud page*/}
                  {_this.state.cloudLink && (
                    <div>
                      <span>File can be downloaded from: </span>
                      <br />
                      <p className="cloud-link" onClick={_this.goToCloud}>
                        {_this.state.cloudLink}
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="col-12 mt-2">
                <Button
                  className="btn-back"
                  type="primary"
                  text="Back"
                  onClick={_this.back}
                />
              </div>
            </Box>
          </Col>
          <Col sm={2} />
        </Row>
      </>
    )
  }

  goToCloud() {
    window.open(`${cloudUrl}${_this.state.hash}`, '_blank')
  }
  back() {
    _this.props.changeSection('uppy')
    _this.props.resetValues()
  }

  componentDidMount() {
    _this.checkHashLoop(_this.props.fileId)
  }
  async checkHashLoop(fileId) {
    let hash
    const myInterval = setInterval(async () => {
      _this.setState({
        startedLoop: true
      })
      hash = await _this.checkHash(fileId)

      if (hash) {
        // Verify if the hash is an error message
        if (hash.match('Error')) {
          _this.setState({
            msgStatus: 'The file could not be uploaded',
            errMsg: hash,
            success: true
          })
        } else {
          _this.setState({
            msgStatus: 'File uploaded successfully!',
            hash: hash,
            cloudLink: `${cloudUrl}${hash}`,
            success: true
          })
        }

        clearInterval(myInterval)
      }
    }, 10000)
  }

  async checkHash(fileId) {
    let hash = ''
    const resultFile = await _this.getFileById(fileId)

    const fileData = resultFile.file
    if (fileData && fileData.payloadLink) {
      hash = fileData.payloadLink
    }

    return hash
  }
  // Get  metadatas by id
  async getFileById(fileId) {
    // Try to get  metadata by id
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
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
}

QrCode.propTypes = {
  bchAddr: PropTypes.string.isRequired,
  hostingCostBCH: PropTypes.number.isRequired,
  hostingCostUSD: PropTypes.number.isRequired,
  changeSection: PropTypes.func.isRequired,
  resetValues: PropTypes.func.isRequired,
  fileId: PropTypes.string.isRequired
}
export default QrCode
