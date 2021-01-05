import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

import { Row, Col, Box, Button, Inputs } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const { Text } = Inputs

let _this
class SignMessage extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      inFetch: false,
      message: '',
      errMsg: '',
      signature: ''
    }
  }

  render () {
    return (
      <div className='text-center message-container'>
        <Helmet
          title='message.FullStack.cash'
          meta={[
            { name: 'description', content: 'Sign messages' },
            { name: 'keywords', content: 'ipfs, bch, bitcoin, bitcoin cash, send, messages' }
          ]}
        />
        {!_this.props.bchWallet && (
          <Box padding='true' className='container-nofound mt-2'>
            <Row>
              <Col xs={12}>
                <em>You need to create or import a wallet</em>
              </Col>
            </Row>
          </Box>
        )}
        {
          _this.props.bchWallet &&
        (
          <Row>
            <Col xs={1} />

            <Col xs={12} sm={10} className='mt-2 '>
              <Box
                className='hover-shadow border-none '
                loaded={!_this.state.inFetch}
              >
                <Row>
                  <Col sm={12} className='text-center'>
                    <h1>
                      <FontAwesomeIcon
                        className='title-icon'
                        size='xs'
                        icon='file-signature'
                      />
                      <span>Sign Message</span>
                    </h1>
                  </Col>
                  <Col sm={12} className='text-center mt-2 mb-2'>
                    <Row className='flex justify-content-center'>
                      <Col sm={12}>
                        <div>
                          <Text
                            id='message'
                            name='message'
                            placeholder='Write Message'
                            label='Message'
                            labelPosition='above'
                            onChange={_this.handleUpdate}
                            value={_this.state.message}
                          />
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12} className='text-center mb-2'>
                    <Button
                      text='Sign Message'
                      type='primary'
                      className='btn-lg'
                      onClick={_this.handleSign}
                    />
                  </Col>
                  <Col sm={12} className='text-center'>
                    {_this.state.errMsg && (
                      <p className='error-color'>{_this.state.errMsg}</p>
                    )}
                  </Col>
                  <Col sm={12} className='text-center'>

                    {_this.state.signature && (

                      <p>
                      Signature :
                        <span style={{ color: 'green' }}>
                          {_this.state.signature}
                        </span>
                        <FontAwesomeIcon
                          className='icon btn-animation ml-1'
                          size='lg'
                          onClick={() => _this.copyToClipBoard('signature')}
                          icon='copy'
                        />
                      </p>

                    )}
                  </Col>
                </Row>
              </Box>
            </Col>
            <Col xs={1} />

          </Row>
        )
        }
      </div>
    )
  }

  handleUpdate (event) {
    const value = event.target.value

    _this.setState({
      [event.target.name]: value
    })
  }

  async handleSign () {
    try {
      const { message } = _this.state
      const { privateKey } = _this.props.walletInfo
      const { bchjs } = _this.props.bchWallet

      if (!message) {
        throw new Error('Message is require')
      }
      _this.setState({
        inFetch: true
      })

      const signature = await bchjs.BitcoinCash.signMessageWithPrivKey(
        privateKey,
        message
      )

      _this.setState({
        inFetch: false,
        message: '',
        signature
      })
    } catch (err) {
      console.error(err)
      _this.setState({
        errMsg: err.message,
        inFetch: false,
        signature: ''
      })
    }
  }

  // copy info  to clipboard
  copyToClipBoard (key) {
    const val = _this.state[key]
    var textArea = document.createElement('textarea')
    textArea.value = val // copyText.textContent;
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('Copy')
    textArea.remove()
  }
}
SignMessage.propTypes = {
  walletInfo: PropTypes.object,
  bchWallet: PropTypes.object
}
export default SignMessage
