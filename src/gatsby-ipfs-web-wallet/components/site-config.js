/*
  This file is intended to be overwritten. It provides a common place to store
  site configuration data.
*/

const config = {
  title: 'BCH Message',
  titleShort: 'MSG',
  balanceText: 'BCH Balance',
  balanceIcon: 'fab-bitcoin',

  // The BCH address used in a memo.cash account. Used for tracking the IPFS
  // hash of the mirror of this site.
  memoAddr: 'bitcoincash:qrlur8kg4cvk62wy85pk06tyvvzddpae9cspggk87c',

  // Footer Information
  hostText: 'FullStack.cash',
  hostUrl: 'https://fullstack.cash/',
  sourceCode: 'https://github.com/Permissionless-Software-Foundation/message.fullstack.cash',
  torUrl: '2qeeub5mshokrthmnb3mzcb5ah2lqzkz4fbdx6er4nhxags2pfkyoqid.onion',
  clearWebUrl: 'https://message.FullStack.cash'
}

module.exports = config
