/* eslint new-cap: 0 */

import xDAIHDWallet from './xdai/xDAIHDWallet';

export async function fetchXDaiTransactions(walletAddress) {
  const wallet = new xDAIHDWallet(null, walletAddress);
  await wallet.setWeb3();
  await wallet.fetchEthTransactions();
  console.log('transactions', wallet.transactions);
}
