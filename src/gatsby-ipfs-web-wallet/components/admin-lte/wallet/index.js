import React from 'react'

import Wallet from 'gatsby-ipfs-web-wallet/src/components/admin-lte/wallet/index'

class Wallet2 extends Wallet {
  // class Wallet2 extends React.Component {
  constructor (props) {
    super(props)
    console.log('Loading new example view.')

    // console.log('Wallet info: ', props.walletInfo)
  }

  render () {
    return (
      <>
        <Wallet {...this.props} />
      </>
    )
  }
}

export default Wallet2
