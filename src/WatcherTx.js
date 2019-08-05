/**
 * This file is part of eth-core-js.
 * Copyright (C) [2017-2019] by [Alessio Delmonti]
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 * @author Alessio Delmonti <alessio@dexlab.io>
 * @date 2017
 */

import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import { find } from 'lodash';

import CONF from './utils/config';
import { erc20Abi } from './utils/constants';

export const ethToWei = (v) => {
  const wei = new BigNumber(v).multipliedBy(1000000000000000000);
  return wei;
};

export default class WatcherTx {
  constructor(network, confirmations = []) {
    this.selectedNetwork = network;
    this.pollingOn = true;
    this.lastBlockChecked = null;
    this.conf = this.getConf();
    this.confirmations = confirmations;
  }

  NETWORKS = {
    XDAI: 'XDAI',
    ROPSTEN: 'ROPSTEN',
    ETHEREUM: 'ETHEREUM',
  };

  STATES = {
    PENDING: 'PENDING',
    DETECTED: 'DETECTED',
    CONFIRMED: 'CONFIRMED',
    NEW_CONFIRMATION: 'NEW_CONFIRMATION',
  };

  getConf() {
    switch (this.selectedNetwork) {
      case this.NETWORKS.XDAI:
        return {
          avgBlockTime: 500,
          rpc: 'https://dai.poa.network',
          label: 'xDAI Poa',
          confirmationNeeded: 1,
          ws: null,
        };
      case this.NETWORKS.ETHEREUM:
          return {
            avgBlockTime: 21 * 1000,
            rpc: 'https://mainnet.infura.io/v3/36bd6b2eb5c4446eaacf626dd90f529a',
            ws: 'wss://mainnet.infura.io/ws/v3/36bd6b2eb5c4446eaacf626dd90f529a',
            label: 'Ethereum',
            confirmationNeeded: 1,
          };
      case this.NETWORKS.ROPSTEN:
        return {
          avgBlockTime: 21 * 1000,
          rpc: 'https://ropsten.infura.io/Q1GYXZMXNXfKuURbwBWB',
          ws: 'wss://ropsten.infura.io/_ws',
          label: 'Ropsten Ethereum Testnet',
          confirmationNeeded: 1,
        };
      default:
        return {
          avgBlockTime: 30 * 1000,
          rpc: 'https://ropsten.infura.io/Q1GYXZMXNXfKuURbwBWB',
          ws: 'wss://ropsten.infura.io/_ws',
          label: 'Ropsten Ethereum Testnet',
          confirmationNeeded: 1,
        };
    }
  }

  async isConnected() {
    const web3 = this.getWeb3Http();
    return web3.eth.net.isListening();
  }

  getWeb3ws() {
    return new Web3(new Web3.providers.WebsocketProvider(this.conf.ws));
  }

  getWeb3Http() {
    return new Web3(this.conf.rpc);
  }

  validate(trx, total, recipient) {
    const web3Http = this.getWeb3Http();

    const toValid = trx.to !== null;
    if (!toValid) return false;

    const walletToValid = trx.to.toLowerCase() === recipient.toLowerCase();
    const amountValid =
      web3Http.utils.toWei(total.toString(), 'ether') === trx.value;

    return toValid && amountValid && walletToValid;
  }

  async checkTransferFromTxHash(txHash, recipient, total, cb) {
    const web3 = this.getWeb3Http();
    const trx = await web3.eth.getTransaction(txHash);
    const valid = this.validate(trx, total, recipient);

    if (valid) {
      this.pollingOn = false;

      if (CONF.ENABLE_LOGS) {
        console.log('trx', trx);
        console.log(`Found incoming transaction from ${trx.from} to ${trx.to}`);
        console.log(`Transaction value is: ${trx.value}`);
        console.log(`Transaction hash is: ${txHash}\n`);
      }

      // CB for detected transactions
      cb({
        state: this.STATES.DETECTED,
        tx: trx,
        txHash,
        numConfirmations: 0,
      });

      // Initiate transaction confirmation
      const confirmationsNeeded = find(this.confirmations, { token: 'xdai' });
      this.confirmTransaction(txHash, confirmationsNeeded.confirmations, cb);
    }
  }

  async xdaiTransfer(recipient, total, cb) {
    if (this.selectedNetwork !== this.NETWORKS.XDAI) {
      throw new Error('This method is available only on the Xdai network');
    }

    const web3 = this.getWeb3Http();
    const currentBlock = await web3.eth.getBlockNumber();

    if (CONF.ENABLE_LOGS) {
      console.log('xdaiTransfer', currentBlock, this.pollingOn);
    }

    if (currentBlock > this.lastBlockChecked) {
      const block = await web3.eth.getBlock(currentBlock);
      this.lastBlockChecked = currentBlock;

      if (block.transactions.length) {
        block.transactions.forEach(async (txHash) => {
          this.checkTransferFromTxHash(txHash, recipient, total, cb);
        }, this);
      }
    }

    if (this.pollingOn) {
      setTimeout(
        () => this.xdaiTransfer(recipient, total, cb),
        this.conf.avgBlockTime,
      );
    }
  }

  etherTransfers(recipient, total, cb) {
    // Instantiate web3 with WebSocket provider
    const web3 = this.getWeb3ws();

    // Instantiate subscription object
    const subscription = web3.eth.subscribe('pendingTransactions');

    // Subscribe to pending transactions
    subscription
      .subscribe((error) => {
        if (error) console.error(error);
      })
      .on('data', async (txHash) => {
        try {
          await this.checkTransferFromTxHash(txHash, recipient, total, cb);

          // Unsubscribe from pending transactions.
          if (!this.pollingOn) {
            subscription.unsubscribe();
          }
        } catch (error) {
          console.log(error);
        }
      });
  }

  tokenTransfers(contractAddress, recipient, value, cb) {
    const ABI = erc20Abi;
    // Instantiate web3 with WebSocketProvider
    const web3 = this.getWeb3ws();

    // Instantiate token contract object with JSON ABI and address
    const tokenContract = new web3.eth.Contract(ABI, contractAddress, (error) => {
      if (error) console.log(error);
    });

    // Generate filter options
    const options = {
      filter: {
        _to: recipient,
        _value: value,
      },
      fromBlock: 'latest',
    };

    // Subscribe to Transfer events matching filter criteria
    tokenContract.events.Transfer(options, async (error, event) => {
      if (error) {
        console.log(error);
        return;
      }

      if (CONF.ENABLE_LOGS) {
        console.log('event', event);
      }

      // Initiate transaction confirmation
      console.log('debug confirmations 2', this.confirmations);
      this.confirmTransaction(
        event.transactionHash,
        CONF.confirmationNeeded,
        cb,
      );
    });
  }

  async getConfirmations(txHash) {
    try {
      // Instantiate web3 with HttpProvider
      const web3 = this.getWeb3Http();

      // Get transaction details
      const trx = await web3.eth.getTransaction(txHash);

      // Get current block number
      const currentBlock = await web3.eth.getBlockNumber();

      // When transaction is unconfirmed, its block number is null.
      // In this case we return 0 as number of confirmations
      return trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  confirmTransaction(txHash, confirmations = CONF.confirmationNeeded, cb) {
    setTimeout(async () => {
      // Get current number of confirmations and compare it with sought-for value
      const trxConfirmations = await this.getConfirmations(txHash);

      if (CONF.ENABLE_LOGS) {
        console.log(`Transaction with hash ${txHash} has ${trxConfirmations} confirmation(s)`);
      }

      const confirmationsNeeded = find(this.confirmations, { token: 'xdai' });
      if (trxConfirmations >= confirmationsNeeded.confirmations) {
        // Handle confirmation event according to your business logic

        if (CONF.ENABLE_LOGS) {
          console.log(`Transaction with hash ${txHash} has been successfully confirmed`);
        }

        cb({
          state: this.STATES.CONFIRMED,
          txHash,
          numConfirmations: trxConfirmations,
        });

        return;
      }

      cb({
        state: this.STATES.NEW_CONFIRMATION,
        txHash,
        numConfirmations: trxConfirmations,
      });

      // Recursive call
      // eslint-disable-next-line consistent-return
      return this.confirmTransaction(txHash, confirmations, cb);
    }, this.conf.avgBlockTime);
  }
}
