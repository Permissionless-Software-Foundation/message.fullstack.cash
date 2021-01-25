/*
  About
*/

import React from 'react'
import { Row, Col, Content, Box } from 'adminlte-2-react'

class About extends React.Component {
  render () {
    return (
      <Content
        title='About'
        subTitle=''
        browserTitle='About | wallet.fullstack.cash'
      >
        <Row>
          <Col xs={12}>
            <Box
              title='wallet.fullstack.cash'
              type='primary'
              closable
              collapsable
            >
              <p>
                This is the official web wallet provided by{' '}
                <a
                  href='https://fullstack.cash'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  FullStack.cash
                </a>
                . You can access this web wallet over Tor and IPFS. See the
                links in the footer at the bottom of the page.
              </p>
              <p>
                This wallet app is currently in an 'Open Alpha' test. The
                general public is invited to use it, but be aware that the app
                is in-progress, the code is in-flux, and many things will change
                or break. Please solicit feedback on this app in our{' '}
                <a
                  href='https://t.me/permissionless_software'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Telegram Channel
                </a>
              </p>
              <p>
                The code for this web wallet can be found{' '}
                <a
                  href='https://github.com/Permissionless-Software-Foundation/wallet.fullstack.cash'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  here
                </a>
                . It's based on the{' '}
                <a
                  href='https://github.com/Permissionless-Software-Foundation/gatsby-ipfs-web-wallet'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  gatsby-ipfs-web-wallet Gatsby Theme
                </a>
                , and the{' '}
                <a
                  href='https://github.com/Permissionless-Software-Foundation/minimal-slp-wallet'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  minimal-slp-wallet
                </a>{' '}
                wallet engine. We encourage other businesses to copy and modify
                the wallet code for their own use.
              </p>
              <p>
                This wallet has full support for Bitcoin Cash and SLP tokens,
                including nonfungible tokens (NFT). When a transaction is made
                with this wallet, an output of 2000 satoshis is added. This is a
                convenience fee that goes towards burning PSF tokens. It helps
                support the developers who work on this web wallet and other
                software sponsored by the{' '}
                <a
                  href='https://psfoundation.cash'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Permissionless Software Foundation
                </a>
                .
              </p>
            </Box>
          </Col>
        </Row>
      </Content>
    )
  }
}

export default About
