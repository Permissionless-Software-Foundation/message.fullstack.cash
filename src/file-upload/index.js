import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import { Row, Col, Box } from 'adminlte-2-react'

// import Banner from '../components/Banner'
import UploadForm from './upload-form'

import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'

import './upload.css'
let _this
class FileUpload extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
    _this = this
  }

  render () {
    return (
      <div className='file-upload-container'>
        <ReactNotification />
        <Helmet
          title='IPFS File Hosting for BCH | FullStack.cash'
          meta={[
            { name: 'description', content: 'Pay BCH to have your files host on IPFS' },
            { name: 'keywords', content: 'ipfs, bch, bitcoin, bitcoin cash, file, hosting, upload' }
          ]}
        />
        {_this.props.bchWallet && (
          <UploadForm {...this.props} />
        )}
        {!_this.props.bchWallet && (
          <Box padding='true' className='container-nofound pt-2'>
            <Row>
              <Col xs={12}>
                <em>You need to create or import a wallet</em>
              </Col>
            </Row>
          </Box>
        )}
      </div>
    )
  }
}

FileUpload.propTypes = {
  walletInfo: PropTypes.object.isRequired,
  bchWallet: PropTypes.object
}
export default FileUpload
