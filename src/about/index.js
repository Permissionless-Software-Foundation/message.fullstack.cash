/*
  About
*/

import React from 'react'
import { Row, Col, Content, Box } from 'adminlte-2-react'

class About extends React.Component {
  render () {
    return (
      <Content
        title="About"
        subTitle=""
        browserTitle="About | Message.FullStack.Cash"
      >
        <Row>
          <Col xs={12}>
            <Box
              title="Message.FullStack.Cash"
              type="primary"
              closable
              collapsable
            >
              <p>
                Message.FullStack.Cash is the primary communication tool for the{' '}
                <a
                  href="https://PSFoundation.cash"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Permissionless Software Foundation
                </a>{' '}
                (PSF). Here are the primary features of this app:
              </p>
              <ul>
                <li>
                  It displays a community feed, taken from the Bitcoin Cash
                  (BCH) blockchain.
                </li>
                <li>
                  It allows anyone to send an end-to-end encrypted (e2ee) email
                  to any BCH address.
                </li>
                <li>
                  It allows hosting ('pinning') of IPFS files, paid with BCH.
                </li>
                <li>
                  It allows cryptographic signing of messages. This is used to
                  prove ownership of an address, to gain access to{' '}
                  <a
                    href="https://t.me/psf_vip"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    the PSF VIP Telegram channel
                  </a>
                </li>
              </ul>
              <p>
                <a
                  href="https://youtu.be/KOlM4dU6Gj0"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Here is a video showing how to use the different PSF
                  communication channels.
                </a>
              </p>

              <p>
                You can access this web wallet over Tor and IPFS. See the links
                in the footer at the bottom of the page. The code for this web
                wallet can be found{' '}
                <a
                  href="https://github.com/Permissionless-Software-Foundation/message.fullstack.cash"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
              </p>

              <p>
                This app is built on top of{' '}
                <a
                  href="https://github.com/Permissionless-Software-Foundation/bch-wallet-starter"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  bch-wallet-starter
                </a>
                , the Gatsby Starter that includes basic BCH wallet
                functionality. You can build your own app using that software
                too.{' '}
                <a
                  href="https://youtu.be/G7ptg7VIRnk"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Here is a video showing how.
                </a>
              </p>

              <p>
                This wallet has full support for Bitcoin Cash and SLP tokens,
                including nonfungible tokens (NFT). When a transaction is made
                with this wallet, an output of 2000 satoshis is added. This is a
                convenience fee that goes towards burning PSF tokens. It helps
                support the developers who work on this web wallet and other
                software sponsored by the{' '}
                <a
                  href="https://psfoundation.cash"
                  target="_blank"
                  rel="noopener noreferrer"
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
