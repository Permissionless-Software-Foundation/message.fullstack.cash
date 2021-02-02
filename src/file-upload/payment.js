/* eslint-disable */
import React, { Component } from "react"
import PropTypes from "prop-types"
import CircularProgress from '@material-ui/core/CircularProgress'
import { Button, Row, Col, Box } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NOTIFICATION from './notification'
const Notification = new NOTIFICATION()
const QRCode = require('qrcode.react')
const cloudUrl = 'https://hub.textile.io/ipfs/'

const SERVER = process.env.FILE_SERVER

let _this

class Payment extends React.Component {
  constructor(props) {
    super(props)
    _this = this
    this.Notification = Notification

    this.state = {
      loaded: true
    }
  }

  render() {

    return (

      <Row >
        <Col xs={2} />
        <Col xs={12} sm={8} className="text-center" >
          <Box className="border-none qr-container mt-2">

            <div >
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

            </div>
            <h4>
              It will cost
              <b> ${_this.props.hostingCostUSD} USD  </b>
              to have this file hosted on IPFS. Do you want to pay this amount?
            </h4>
            <div className="col-6 uppy-progress mt-1 mb-1">
              {!_this.state.loaded && <CircularProgress />}
            </div>
            <div className="col-6 payment-buttons">
              <Button
                className="btn-back"
                type='primary'
                text='No'
                onClick={_this.back}

              />

              <Button
                className="btn-back"
                type='primary'
                text='Yes'
                onClick={_this.payHost}
              />
            </div>
          </Box>
        </Col>
        <Col xs={2} />
      </Row>

    )

  }

  back() {
    _this.props.changeSection('uppy')
    _this.props.resetValues()
  }

  async payHost() {
    try {
      _this.setState({
        loaded: false
      })
      const { bchWallet, bchAddr, hostingCostBCH } = _this.props
      // Transaction data
      const receivers = [
        {
          address: bchAddr,
          // amount in satoshis, 1 satoshi = 0.00000001 Bitcoin
          amountSat: Math.floor(Number(hostingCostBCH) * 100000000)
        }
      ]

      await bchWallet.send(receivers)
      _this.Notification.notify('Payment', 'Success!!', 'success')
      _this.setState({
        loaded: true
      })
      setTimeout(() => {
        _this.props.changeSection('qr')
      }, 1000);

    } catch (error) {
      console.error(error)
      _this.Notification.notify('Payment', error.message, 'danger')
      _this.setState({
        loaded: true
      })
    }
  }
}

Payment.propTypes = {
  walletInfo: PropTypes.object.isRequired,
  bchWallet: PropTypes.object,
  bchAddr: PropTypes.string.isRequired,
  hostingCostBCH: PropTypes.number.isRequired,
  hostingCostUSD: PropTypes.number.isRequired,
  changeSection: PropTypes.func.isRequired,
  resetValues: PropTypes.func.isRequired,
}
export default Payment
