/* eslint-disable no-use-before-define */
/* eslint-disable class-methods-use-this */
import isUndefined from 'lodash/isUndefined';
import findIndex from 'lodash/findIndex';
import compareAddresses from '../../utils/compareAddresses';

class BasePlugin {
  constructor(wallet) {
    this.W = wallet;

    this.cacheApi = null;
    this.portfolio = [];
  }

  findToken(contractAddress) {
    if (isUndefined(contractAddress) || contractAddress === '') throw new Error('contractAddress: is undefined');
    const idx = findIndex(this.portfolio, o => compareAddresses(o.contractAddress, contractAddress));
    if (idx < 0) {
      return false;
    }
    return idx;
  }

  getToken(contractAddress) {
    if (isUndefined(contractAddress) || contractAddress === '') throw new Error('contractAddress: is undefined');

    const idx = this.findToken(contractAddress);
    if (idx < 0) {
      return false;
    }
    return this.portfolio[idx];
  }

  async getTokenState(contractAddress) {
    console.log('Not implemented', contractAddress);
  }

  async getState() {
    return new Promise(async (resolve, reject) => {
      try {
        const promises = this.portfolio.map(async t => this.getTokenState(t.contractAddress));
        await Promise.all(promises);
        resolve();
      } catch (e) {
        return reject();
      }
    });
  }
}

export default BasePlugin;
