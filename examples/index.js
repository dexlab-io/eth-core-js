/* eslint new-cap: 0 */

console.log('hello world!');

const { WatcherTx, xDAIHDWallet } = require('../src/main');

export async function fetchXDaiTransactions(walletAddress) {
  const wallet = new xDAIHDWallet(null, walletAddress);
  await wallet.setWeb3();
  await wallet.fetchEthTransactions();
  console.log('transactions', wallet.transactions);
}

const watchTx = new WatcherTx();
console.log('WatcherTx', watchTx);
