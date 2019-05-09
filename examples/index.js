/* eslint new-cap: 0 */

console.log('hello world!');

// const { HDWallet, WatcherTx, xDAIHDWallet } = require('..');
const { HDWallet, WatcherTx, xDAIHDWallet } = require('../src/main');

export async function fetchXDaiTransactions(walletAddress) {
  const wallet = new xDAIHDWallet(null, walletAddress);
  await wallet.setWeb3();
  await wallet.fetchEthTransactions();
  console.log('transactions', wallet.transactions);
}
// fetchXDaiTransactions('0x4f07aFDBaB5D4372AAA7AC439ED3Ba33C39Af752');

const watchTx = new WatcherTx();
console.log('WatcherTx', watchTx.STATES.PENDING, watchTx.pollingOn);
