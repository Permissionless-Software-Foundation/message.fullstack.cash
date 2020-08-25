import React from 'react'

import { Row, Col, Box } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class About extends React.Component {
  // state = {}

  render () {
    return (
      <Row>
        <Col sm={2} />
        <Col sm={8}>
          <Box className='hover-shadow border-none mt-2'>
            <Row>
              <Col sm={12} className='text-center'>
                <h1>
                  <FontAwesomeIcon
                    className='title-icon'
                    size='xs'
                    icon='exclamation-triangle'
                  />
                  <span>About</span>
                </h1>
              </Col>

              <Col sm={12} className='mt-2 mb-2'>
                <p>
                      This simple web app allows you to easily upload files to be
                      hosted on
                      the <a href='https://ipfs.io' target='_blank' rel='noopener noreferrer'>IPFS network</a>.
                      The cost is $0.01 USD per 10 Megabytes, with a minimum cost
                      of $0.01. This kind of low-cost, permissionless payment service
                      is only possible with Bitcoin Cash.
                </p>
                <span>
                      This web app is open source, and uses an MIT license.
                      You can copy it and run your
                      own hosting service. There is a front-end and a back-end:

                  <ul className='mt-2'>
                    <li>
                      <a href='https://github.com/Permissionless-Software-Foundation/ipfs-upload-app' target='_blank' rel='noopener noreferrer'>
                            Front End App
                      </a>
                    </li>
                    <li>
                      <a href='https://github.com/Permissionless-Software-Foundation/ipfs-upload-server' target='_blank' rel='noopener noreferrer'>
                            Back End App
                      </a>
                    </li>
                  </ul>
                </span>
              </Col>
            </Row>
          </Box>
        </Col>
        <Col sm={2} />
      </Row>
    )
  }
}

export default About
