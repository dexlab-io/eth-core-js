'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var HDKEY = _interopDefault(require('ethereumjs-wallet/hdkey'));
var bip39 = _interopDefault(require('bip39'));
var BigNumber = _interopDefault(require('bignumber.js'));
var Web3 = _interopDefault(require('web3'));
var lodash = require('lodash');
var EthereumTx = _interopDefault(require('ethereumjs-tx'));
var ProviderEngine = _interopDefault(require('web3-provider-engine'));
var WalletSubprovider = _interopDefault(require('web3-provider-engine/subproviders/wallet'));
var findIndex = _interopDefault(require('lodash/findIndex'));
var isUndefined = _interopDefault(require('lodash/isUndefined'));
var fetch$1 = _interopDefault(require('isomorphic-fetch'));
var ENS = _interopDefault(require('ethjs-ens'));
var EthereumJsWallet = _interopDefault(require('ethereumjs-wallet'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var CONF = {
  debug: process.env.NODE_ENV === 'development',
  ENABLE_LOGS: false,
  APP_VERSION: '0.0.1',
  defaultHDpathEthereum: "m/44'/60'/0'/0/0",
  // Compatible with Jaxx, Metamask, Exodus, imToken, TREZOR (ETH) & Digital Bitbox
  confirmationNeeded: 1
};

var HDWallet =
/*#__PURE__*/
function () {
  /**
  * Accepts Valid bip32 passphrase
  * @param  {} secret=''
  */
  function HDWallet() {
    var secret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    _classCallCheck(this, HDWallet);

    this.type = 'GenericHDWallet';
    this.defaultHDpath = CONF.defaultHDpathEthereum;
    this.secret = secret;
    /**
     * Should we have a pending array?
     */

    if (secret) {
      this["import"]();
    }
  }

  _createClass(HDWallet, [{
    key: "import",
    value: function _import() {
      // TODO

      /**
       * we need to indenty if's a mnemonic or private key
       * if( this.secret.length === 12 )
       */
      this.importFromMasterSeed();
    }
  }, {
    key: "importFromMasterSeed",
    value: function importFromMasterSeed() {
      var seed = bip39.mnemonicToSeed(this.secret);
      this._hd = HDKEY.fromMasterSeed(seed);
      this.instanceWallet = this._hd.derivePath(this.defaultHDpath).getWallet();
    } // TODO tests

  }, {
    key: "importFromExtendedKey",
    value: function importFromExtendedKey(seed) {
      this._hd = HDKEY.fromExtendedKey(seed);
      this.instanceWallet = this._hd.derivePath(this.defaultHDpath).getWallet();
    }
  }, {
    key: "getPrivateExtendedKey",

    /**
     * BIP32 Extended private key
     * Info: m
     * https://bip32jp.github.io/english/
     */
    value: function getPrivateExtendedKey() {
      return this._hd.privateExtendedKey();
    }
    /**
     * BIP32 Extended public key
     * Info: m
     * https://bip32jp.github.io/english/
     */

  }, {
    key: "getPublicExtendedKey",
    value: function getPublicExtendedKey() {
      return this._hd.publicExtendedKey();
    }
    /**
     * BIP32 Derived Extended private key from this.defaultHDpath
     */

  }, {
    key: "getDerivedPrivateExtendedKey",
    value: function getDerivedPrivateExtendedKey() {
      return this._hd.derivePath(this.defaultHDpath).privateExtendedKey();
    }
    /**
     * BIP32 Derived Extended public key from this.defaultHDpath
     */

  }, {
    key: "getDerivedPublicExtendedKey",
    value: function getDerivedPublicExtendedKey() {
      return this._hd.derivePath(this.defaultHDpath).publicExtendedKey();
    }
    /**
     * Private Key of the instance wallet
     */

  }, {
    key: "getPrivateKey",
    value: function getPrivateKey() {
      return this.instanceWallet.getPrivateKey().toString('hex');
    }
    /**
     * return ethUtil.bufferToHex(this.getPrivateKey())
     */

  }, {
    key: "getPrivateKeyString",
    value: function getPrivateKeyString() {
      return this.instanceWallet.getPrivateKeyString();
    }
    /**
     * return ethUtil.bufferToHex(this.getPrivateKey())
     */

  }, {
    key: "getPublicKeyString",
    value: function getPublicKeyString() {
      if (this.watchOnly) return this.address;
      return this.instanceWallet.getPublicKeyString();
    }
  }, {
    key: "getAddress",
    value: function getAddress() {
      return this.instanceWallet.getAddressString();
    }
  }], [{
    key: "validateMnemonic",
    value: function validateMnemonic(mnemonic) {
      return bip39.validateMnemonic(mnemonic);
    }
  }]);

  return HDWallet;
}();

var erc20Abi = [{
  constant: false,
  inputs: [{
    name: '_spender',
    type: 'address'
  }, {
    name: '_value',
    type: 'uint256'
  }],
  name: 'approve',
  outputs: [{
    name: 'success',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'totalSupply',
  outputs: [{
    name: 'supply',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_from',
    type: 'address'
  }, {
    name: '_to',
    type: 'address'
  }, {
    name: '_value',
    type: 'uint256'
  }],
  name: 'transferFrom',
  outputs: [{
    name: 'success',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [],
  name: 'decimals',
  outputs: [{
    name: 'digits',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '_owner',
    type: 'address'
  }],
  name: 'balanceOf',
  outputs: [{
    name: 'balance',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  constant: false,
  inputs: [{
    name: '_to',
    type: 'address'
  }, {
    name: '_value',
    type: 'uint256'
  }],
  name: 'transfer',
  outputs: [{
    name: 'success',
    type: 'bool'
  }],
  payable: false,
  stateMutability: 'nonpayable',
  type: 'function'
}, {
  constant: true,
  inputs: [{
    name: '_owner',
    type: 'address'
  }, {
    name: '_spender',
    type: 'address'
  }],
  name: 'allowance',
  outputs: [{
    name: 'remaining',
    type: 'uint256'
  }],
  payable: false,
  stateMutability: 'view',
  type: 'function'
}, {
  anonymous: false,
  inputs: [{
    indexed: true,
    name: '_owner',
    type: 'address'
  }, {
    indexed: true,
    name: '_spender',
    type: 'address'
  }, {
    indexed: false,
    name: '_value',
    type: 'uint256'
  }],
  name: 'Approval',
  type: 'event'
}];
var UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);
var defaultTokens = [];

var WatcherTx =
/*#__PURE__*/
function () {
  function WatcherTx(network) {
    var confirmations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    _classCallCheck(this, WatcherTx);

    _defineProperty(this, "NETWORKS", {
      XDAI: 'XDAI',
      ROPSTEN: 'ROPSTEN',
      ETHEREUM: 'ETHEREUM'
    });

    _defineProperty(this, "STATES", {
      PENDING: 'PENDING',
      DETECTED: 'DETECTED',
      CONFIRMED: 'CONFIRMED',
      NEW_CONFIRMATION: 'NEW_CONFIRMATION'
    });

    this.selectedNetwork = network;
    this.pollingOn = true;
    this.lastBlockChecked = null;
    this.conf = this.getConf();
    this.confirmations = confirmations;
  }

  _createClass(WatcherTx, [{
    key: "getConf",
    value: function getConf() {
      switch (this.selectedNetwork) {
        case this.NETWORKS.XDAI:
          return {
            avgBlockTime: 500,
            rpc: 'https://dai.poa.network',
            label: 'xDAI Poa',
            confirmationNeeded: 1,
            ws: null
          };

        case this.NETWORKS.ETHEREUM:
          return {
            avgBlockTime: 21 * 1000,
            rpc: 'https://mainnet.infura.io/v3/36bd6b2eb5c4446eaacf626dd90f529a',
            ws: 'wss://mainnet.infura.io/ws/v3/36bd6b2eb5c4446eaacf626dd90f529a',
            label: 'Ethereum',
            confirmationNeeded: 1
          };

        case this.NETWORKS.ROPSTEN:
          return {
            avgBlockTime: 21 * 1000,
            rpc: 'https://ropsten.infura.io/Q1GYXZMXNXfKuURbwBWB',
            ws: 'wss://ropsten.infura.io/_ws',
            label: 'Ropsten Ethereum Testnet',
            confirmationNeeded: 1
          };

        default:
          return {
            avgBlockTime: 30 * 1000,
            rpc: 'https://ropsten.infura.io/Q1GYXZMXNXfKuURbwBWB',
            ws: 'wss://ropsten.infura.io/_ws',
            label: 'Ropsten Ethereum Testnet',
            confirmationNeeded: 1
          };
      }
    }
  }, {
    key: "isConnected",
    value: function () {
      var _isConnected = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var web3;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                web3 = this.getWeb3Http();
                return _context.abrupt("return", web3.eth.net.isListening());

              case 2:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function isConnected() {
        return _isConnected.apply(this, arguments);
      }

      return isConnected;
    }()
  }, {
    key: "getWeb3ws",
    value: function getWeb3ws() {
      return new Web3(new Web3.providers.WebsocketProvider(this.conf.ws));
    }
  }, {
    key: "getWeb3Http",
    value: function getWeb3Http() {
      return new Web3(this.conf.rpc);
    }
  }, {
    key: "validate",
    value: function validate(trx, total, recipient) {
      var web3Http = this.getWeb3Http();
      var toValid = trx.to !== null;
      if (!toValid) return false;
      var walletToValid = trx.to.toLowerCase() === recipient.toLowerCase();
      var amountValid = web3Http.utils.toWei(total.toString(), 'ether') === trx.value;
      return toValid && amountValid && walletToValid;
    }
  }, {
    key: "checkTransferFromTxHash",
    value: function () {
      var _checkTransferFromTxHash = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(txHash, recipient, total, cb) {
        var web3, trx, valid, confirmationsNeeded;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                web3 = this.getWeb3Http();
                _context2.next = 3;
                return web3.eth.getTransaction(txHash);

              case 3:
                trx = _context2.sent;
                valid = this.validate(trx, total, recipient);

                if (valid) {
                  this.pollingOn = false;


                  cb({
                    state: this.STATES.DETECTED,
                    tx: trx,
                    txHash: txHash,
                    numConfirmations: 0
                  }); // Initiate transaction confirmation

                  confirmationsNeeded = lodash.find(this.confirmations, {
                    token: 'xdai'
                  });
                  this.confirmTransaction(txHash, confirmationsNeeded.confirmations, cb);
                }

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function checkTransferFromTxHash(_x, _x2, _x3, _x4) {
        return _checkTransferFromTxHash.apply(this, arguments);
      }

      return checkTransferFromTxHash;
    }()
  }, {
    key: "xdaiTransfer",
    value: function () {
      var _xdaiTransfer = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(recipient, total, cb) {
        var _this = this;

        var web3, currentBlock, block;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(this.selectedNetwork !== this.NETWORKS.XDAI)) {
                  _context4.next = 2;
                  break;
                }

                throw new Error('This method is available only on the Xdai network');

              case 2:
                web3 = this.getWeb3Http();
                _context4.next = 5;
                return web3.eth.getBlockNumber();

              case 5:
                currentBlock = _context4.sent;

                if (!(currentBlock > this.lastBlockChecked)) {
                  _context4.next = 13;
                  break;
                }

                _context4.next = 10;
                return web3.eth.getBlock(currentBlock);

              case 10:
                block = _context4.sent;
                this.lastBlockChecked = currentBlock;

                if (block.transactions.length) {
                  block.transactions.forEach(
                  /*#__PURE__*/
                  function () {
                    var _ref = _asyncToGenerator(
                    /*#__PURE__*/
                    regeneratorRuntime.mark(function _callee3(txHash) {
                      return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              _this.checkTransferFromTxHash(txHash, recipient, total, cb);

                            case 1:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3);
                    }));

                    return function (_x8) {
                      return _ref.apply(this, arguments);
                    };
                  }(), this);
                }

              case 13:
                if (this.pollingOn) {
                  setTimeout(function () {
                    return _this.xdaiTransfer(recipient, total, cb);
                  }, this.conf.avgBlockTime);
                }

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function xdaiTransfer(_x5, _x6, _x7) {
        return _xdaiTransfer.apply(this, arguments);
      }

      return xdaiTransfer;
    }()
  }, {
    key: "etherTransfers",
    value: function etherTransfers(recipient, total, cb) {
      var _this2 = this;

      // Instantiate web3 with WebSocket provider
      var web3 = this.getWeb3ws(); // Instantiate subscription object

      var subscription = web3.eth.subscribe('pendingTransactions'); // Subscribe to pending transactions

      subscription.subscribe(function (error) {
        if (error) console.error(error);
      }).on('data',
      /*#__PURE__*/
      function () {
        var _ref2 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee5(txHash) {
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  _context5.prev = 0;
                  _context5.next = 3;
                  return _this2.checkTransferFromTxHash(txHash, recipient, total, cb);

                case 3:
                  // Unsubscribe from pending transactions.
                  if (!_this2.pollingOn) {
                    subscription.unsubscribe();
                  }

                  _context5.next = 9;
                  break;

                case 6:
                  _context5.prev = 6;
                  _context5.t0 = _context5["catch"](0);
                  console.log(_context5.t0);

                case 9:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5, null, [[0, 6]]);
        }));

        return function (_x9) {
          return _ref2.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "tokenTransfers",
    value: function tokenTransfers(contractAddress, recipient, value, cb) {
      var _this3 = this;

      var ABI = erc20Abi; // Instantiate web3 with WebSocketProvider

      var web3 = this.getWeb3ws(); // Instantiate token contract object with JSON ABI and address

      var tokenContract = new web3.eth.Contract(ABI, contractAddress, function (error) {
        if (error) console.log(error);
      }); // Generate filter options

      var options = {
        filter: {
          _to: recipient,
          _value: value
        },
        fromBlock: 'latest'
      }; // Subscribe to Transfer events matching filter criteria

      tokenContract.events.Transfer(options,
      /*#__PURE__*/
      function () {
        var _ref3 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee6(error, event) {
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  if (!error) {
                    _context6.next = 3;
                    break;
                  }

                  console.log(error);
                  return _context6.abrupt("return");

                case 3:


                  console.log('debug confirmations 2', _this3.confirmations);

                  _this3.confirmTransaction(event.transactionHash, CONF.confirmationNeeded, cb);

                case 6:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        return function (_x10, _x11) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "getConfirmations",
    value: function () {
      var _getConfirmations = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(txHash) {
        var web3, trx, currentBlock;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                // Instantiate web3 with HttpProvider
                web3 = this.getWeb3Http(); // Get transaction details

                _context7.next = 4;
                return web3.eth.getTransaction(txHash);

              case 4:
                trx = _context7.sent;
                _context7.next = 7;
                return web3.eth.getBlockNumber();

              case 7:
                currentBlock = _context7.sent;
                return _context7.abrupt("return", trx.blockNumber === null ? 0 : currentBlock - trx.blockNumber);

              case 11:
                _context7.prev = 11;
                _context7.t0 = _context7["catch"](0);
                console.log(_context7.t0);
                return _context7.abrupt("return", _context7.t0);

              case 15:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this, [[0, 11]]);
      }));

      function getConfirmations(_x12) {
        return _getConfirmations.apply(this, arguments);
      }

      return getConfirmations;
    }()
  }, {
    key: "confirmTransaction",
    value: function confirmTransaction(txHash) {
      var _this4 = this;

      var confirmations = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : CONF.confirmationNeeded;
      var cb = arguments.length > 2 ? arguments[2] : undefined;
      setTimeout(
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8() {
        var trxConfirmations, confirmationsNeeded;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                _context8.next = 2;
                return _this4.getConfirmations(txHash);

              case 2:
                trxConfirmations = _context8.sent;

                confirmationsNeeded = lodash.find(_this4.confirmations, {
                  token: 'xdai'
                });

                if (!(trxConfirmations >= confirmationsNeeded.confirmations)) {
                  _context8.next = 9;
                  break;
                }

                cb({
                  state: _this4.STATES.CONFIRMED,
                  txHash: txHash,
                  numConfirmations: trxConfirmations
                });
                return _context8.abrupt("return");

              case 9:
                cb({
                  state: _this4.STATES.NEW_CONFIRMATION,
                  txHash: txHash,
                  numConfirmations: trxConfirmations
                }); // Recursive call
                // eslint-disable-next-line consistent-return

                return _context8.abrupt("return", _this4.confirmTransaction(txHash, confirmations, cb));

              case 11:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      })), this.conf.avgBlockTime);
    }
  }]);

  return WatcherTx;
}();

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
var Token = function Token() {
  var contractAddress = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 18;
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
  var symbol = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  var image = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
  var price = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : {};
  var balance = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
  var balanceDecimals = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 0;

  _classCallCheck(this, Token);

  this.balanceHex = '0x70a08231';
  this.transferHex = '0xa9059cbb';
  this.contractAddress = contractAddress;
  this.isSendAllow = true;
  this.decimals = decimals;
  this.name = name;
  this.symbol = symbol;
  this.image = image;
  this.balance = balance;
  this.balanceDecimals = balanceDecimals;
  this.transactions = [];
  this.price = price;
};

var RpcSubprovider = require('web3-provider-engine/subproviders/rpc.js');

var EthereumHDWallet =
/*#__PURE__*/
function (_HDWallet) {
  _inherits(EthereumHDWallet, _HDWallet);

  /**
   * Accepts Valid bip32 passphrase
   * @param  {} secret=''
   */
  function EthereumHDWallet() {
    var _this;

    var secret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, EthereumHDWallet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EthereumHDWallet).call(this, secret));
    _this.type = 'EthereumHDWallet';
    _this.name = 'ETH Wallet';
    _this.networkUrl = 'https://mainnet.infura.io/Q1GYXZMXNXfKuURbwBWB';
    _this.API_URL = 'https://api.etherscan.io/';
    _this.CHAIN_ID = 1;
    _this.symbol = 'ETH';
    _this.nonce = 0;
    _this.address = address;
    _this.defaulTokenGasLimitLabel = 22000;
    _this.watchOnly = !!(!secret && address);
    _this.defaultHDpath = CONF.defaultHDpathEthereum;
    _this.decimal = 18;
    _this.totalBalance = 0;
    _this.balance = 0;
    _this.tokens = [];
    _this.secret = secret;
    _this.transactions = [];
    _this.usedAddresses = [];
    /**
     * Should we have a pending array?
     */

    if (secret) {
      _this["import"]();

      _this.setWeb3();
    }

    return _this;
  }

  _createClass(EthereumHDWallet, [{
    key: "getAddress",
    value: function getAddress() {
      if (!this.secret) return this.address;
      return this.instanceWallet.getAddressString();
    }
    /**
     * Returns an instanciated web3 object through a web-socket URL
     *
     * @param {string} url Needs to be a WEB SOCKET!
     * @returns {object} an instanciated web3 object
     */

  }, {
    key: "getWeb3",
    value: function getWeb3() {
      var url = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'wss://ropsten.infura.io/_ws';
      return new Web3(new Web3.providers.WebsocketProvider(url));
    }
    /**
     * This method should return a promise
     */

  }, {
    key: "sync",
    value: function () {
      var _sync = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.loadTokensList(true);

              case 2:
                _context.next = 4;
                return this.fetchBalance();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sync() {
        return _sync.apply(this, arguments);
      }

      return sync;
    }()
  }, {
    key: "setWeb3",
    value: function () {
      var _setWeb = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var _this2 = this;

        var _window, web3, ethereum;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _window = window, web3 = _window.web3, ethereum = _window.ethereum;
                return _context4.abrupt("return", new Promise(
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee3(resolve, reject) {
                    var engine, accounts;
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            if (!_this2.address) {
                              _context3.next = 10;
                              break;
                            }

                            engine = new ProviderEngine();
                            Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;

                            if (!_this2.watchOnly) {
                              engine.addProvider(new WalletSubprovider(_this2.instanceWallet, {}));
                            }

                            engine.addProvider(new RpcSubprovider({
                              rpcUrl: _this2.networkUrl
                            }));
                            engine.start();
                            _this2.web3 = new Web3(engine);
                            _this2.web3.eth.defaultAccount = _this2.getAddress();
                            resolve();
                            return _context3.abrupt("return");

                          case 10:
                            if (!ethereum) {
                              _context3.next = 14;
                              break;
                            }

                            // console.log(ethereum);
                            ethereum.enable().then(
                            /*#__PURE__*/
                            _asyncToGenerator(
                            /*#__PURE__*/
                            regeneratorRuntime.mark(function _callee2() {
                              var accounts;
                              return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                while (1) {
                                  switch (_context2.prev = _context2.next) {
                                    case 0:
                                      _this2.web3 = new Web3(ethereum);
                                      _context2.next = 3;
                                      return _this2.web3.eth.getAccounts();

                                    case 3:
                                      accounts = _context2.sent;
                                      // eslint-disable-next-line prefer-destructuring
                                      _this2.address = accounts[0];
                                      resolve();

                                    case 6:
                                    case "end":
                                      return _context2.stop();
                                  }
                                }
                              }, _callee2);
                            })))["catch"](function (deniedAccessMessage) {
                              var deniedAccessError = Error(deniedAccessMessage.toString());
                              console.log('deniedAccessError', deniedAccessError);
                              resolve(deniedAccessError);
                            }); // for legacy dapp browsers

                            _context3.next = 23;
                            break;

                          case 14:
                            if (!(web3 && web3.currentProvider)) {
                              _context3.next = 23;
                              break;
                            }

                            _this2.web3 = new Web3(web3.currentProvider);
                            _context3.next = 18;
                            return _this2.web3.eth.getAccounts();

                          case 18:
                            accounts = _context3.sent;
                            // eslint-disable-next-line prefer-destructuring
                            _this2.address = accounts[0];
                            console.log(_this2.getAddress());
                            console.log('legacy dapp browsers');
                            resolve();

                          case 23:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3);
                  }));

                  return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function setWeb3() {
        return _setWeb.apply(this, arguments);
      }

      return setWeb3;
    }()
  }, {
    key: "getNetworkID",
    value: function () {
      var _getNetworkID = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                return _context6.abrupt("return", new Promise(
                /*#__PURE__*/
                function () {
                  var _ref3 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee5(resolve, reject) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            _context5.next = 2;
                            return _this3.web3.eth.net.getId();

                          case 2:
                            _this3.networkID = _context5.sent;
                            resolve(_this3.networkID);

                          case 4:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5);
                  }));

                  return function (_x3, _x4) {
                    return _ref3.apply(this, arguments);
                  };
                }()));

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function getNetworkID() {
        return _getNetworkID.apply(this, arguments);
      }

      return getNetworkID;
    }()
  }, {
    key: "getNonce",
    value: function () {
      var _getNonce = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7() {
        var _this4 = this;

        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.abrupt("return", new Promise(function (resolve, reject) {
                  try {
                    _this4.web3.eth.getTransactionCount(_this4.getAddress(), 'latest', function (error, nonce) {
                      if (error) {
                        reject(error);
                      }

                      _this4.nonce = nonce;
                      resolve(_this4.nonce);
                    });
                  } catch (e) {
                    reject(e);
                  }
                }));

              case 1:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function getNonce() {
        return _getNonce.apply(this, arguments);
      }

      return getNonce;
    }()
  }, {
    key: "waitForTx",
    value: function () {
      var _waitForTx = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(txHash) {
        var _this5 = this;

        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                return _context8.abrupt("return", new Promise(function (resolve, reject) {
                  var checked = 0;
                  var handle = setInterval(function () {
                    _this5.web3.eth.getTransactionReceipt(txHash).then(function (resp) {
                      if (resp != null && resp.blockNumber > 0) {
                        clearInterval(handle);
                        console.log('resp', resp);
                        resolve(resp);
                      } else {
                        checked++;
                        console.log('Not mined', checked);

                        if (checked > 50) {
                          clearInterval(handle);
                          reject('Not mined');
                        }
                      }
                    });
                  }, 5000);
                }));

              case 1:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function waitForTx(_x5) {
        return _waitForTx.apply(this, arguments);
      }

      return waitForTx;
    }()
  }, {
    key: "checkTokenAllowanceForAddress",
    value: function () {
      var _checkTokenAllowanceForAddress = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee10(benificiay) {
        var _this6 = this;

        var tokenAddress,
            _args10 = arguments;
        return regeneratorRuntime.wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                tokenAddress = _args10.length > 1 && _args10[1] !== undefined ? _args10[1] : null;

                if (!(isUndefined(benificiay) || tokenAddress === '')) {
                  _context10.next = 3;
                  break;
                }

                throw new Error('tokenAddress: is undefined');

              case 3:
                return _context10.abrupt("return", new Promise(
                /*#__PURE__*/
                function () {
                  var _ref4 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee9(resolve, reject) {
                    var token, allowance;
                    return regeneratorRuntime.wrap(function _callee9$(_context9) {
                      while (1) {
                        switch (_context9.prev = _context9.next) {
                          case 0:
                            token = new _this6.web3.eth.Contract(erc20Abi, tokenAddress);
                            console.log('token', token);
                            _context9.next = 4;
                            return token.methods.allowance(_this6.getAddress(), benificiay).call();

                          case 4:
                            allowance = _context9.sent;
                            console.log('allowance', allowance);
                            resolve(allowance);

                          case 7:
                          case "end":
                            return _context9.stop();
                        }
                      }
                    }, _callee9);
                  }));

                  return function (_x7, _x8) {
                    return _ref4.apply(this, arguments);
                  };
                }()));

              case 4:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10);
      }));

      function checkTokenAllowanceForAddress(_x6) {
        return _checkTokenAllowanceForAddress.apply(this, arguments);
      }

      return checkTokenAllowanceForAddress;
    }()
  }, {
    key: "sendSignedTransaction",
    value: function () {
      var _sendSignedTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11(signedTx) {
        var _this7 = this;

        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                return _context11.abrupt("return", new Promise(function (resolve, reject) {
                  try {
                    _this7.web3.eth.sendSignedTransaction("0x".concat(signedTx.toString('hex')), function (error, tx) {
                      if (error) {
                        console.log('err', error);
                        reject(error);
                      }

                      console.log('tx', tx);
                      resolve(tx);
                    });
                  } catch (e) {
                    reject(e);
                  }
                }));

              case 1:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11);
      }));

      function sendSignedTransaction(_x9) {
        return _sendSignedTransaction.apply(this, arguments);
      }

      return sendSignedTransaction;
    }()
  }, {
    key: "getGasPrice",
    value: function () {
      var _getGasPrice = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12() {
        var _this8 = this;

        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                return _context12.abrupt("return", new Promise(function (resolve, reject) {
                  try {
                    _this8.web3.eth.getGasPrice(function (error, price) {
                      if (error) {
                        reject(error);
                      }

                      _this8.gasPrice = _this8.web3.utils.fromWei(price.toString(), 'ether');
                      resolve(price);
                    });
                  } catch (e) {
                    reject(e);
                  }
                }));

              case 1:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12);
      }));

      function getGasPrice() {
        return _getGasPrice.apply(this, arguments);
      }

      return getGasPrice;
    }()
    /**
     * return BigNumber
     */

  }, {
    key: "fetchBalance",
    value: function () {
      var _fetchBalance = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee13() {
        var _this9 = this;

        return regeneratorRuntime.wrap(function _callee13$(_context13) {
          while (1) {
            switch (_context13.prev = _context13.next) {
              case 0:
                return _context13.abrupt("return", new Promise(function (resolve, reject) {
                  _this9.web3.eth.getBalance(_this9.getAddress()).then(function (weiBalance) {
                    var balance = _this9.web3.utils.fromWei(weiBalance, 'ether');

                    _this9.balance = parseFloat(balance);
                    resolve(balance);
                  })["catch"](function (error) {
                    console.log('error', error);
                    reject(error);
                  });
                }));

              case 1:
              case "end":
                return _context13.stop();
            }
          }
        }, _callee13);
      }));

      function fetchBalance() {
        return _fetchBalance.apply(this, arguments);
      }

      return fetchBalance;
    }()
    /**
     * return Number
     */

  }, {
    key: "fetchERC20Balance",
    value: function () {
      var _fetchERC20Balance = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee14(contractAddress) {
        var _this10 = this;

        var idx,
            tokenDecimals;
        return regeneratorRuntime.wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:

                if (!(isUndefined(contractAddress) || contractAddress === '')) {
                  _context14.next = 3;
                  break;
                }

                throw new Error('contractAddress: is undefined');

              case 3:
                idx = this.findTokenIdx(contractAddress);
                tokenDecimals = this.tokens[idx].decimals;
                return _context14.abrupt("return", new Promise(function (resolve, reject) {
                  _this10.web3.eth.contract(erc20Abi).at(contractAddress).balanceOf(_this10.getAddress(), function (error, decimalsBalance) {
                    if (error) {
                      console.error(error);
                      reject(error);
                    }

                    var balance = decimalsBalance / Math.pow(10, tokenDecimals);
                    _this10.tokens[idx].balance = balance;
                    _this10.tokens[idx].balanceDecimals = decimalsBalance;
                    resolve(balance);
                  });
                }));

              case 6:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14, this);
      }));

      function fetchERC20Balance(_x10) {
        return _fetchERC20Balance.apply(this, arguments);
      }

      return fetchERC20Balance;
    }()
  }, {
    key: "getERC20Balance",
    value: function getERC20Balance(contractAddress) {
      if (isUndefined(contractAddress) || contractAddress === '') {
        throw new Error('contractAddress: is undefined');
      }

      var idx = this.findTokenIdx(contractAddress);
      return this.tokens[idx].balance;
    }
  }, {
    key: "findTokenIdx",
    value: function findTokenIdx(contractAddress) {
      if (isUndefined(contractAddress) || contractAddress === '') {
        throw new Error('contractAddress: is undefined');
      }

      var idx = findIndex(this.tokens, function (o) {
        if (!o.isNative) {
          return o.contractAddress.toString().toLowerCase().trim() === contractAddress.toString().toLowerCase().trim();
        }
      });

      if (idx < 0) {
        // Token does not exist
        this.tokens.push(new Token(contractAddress.toString().toLowerCase().trim()));
        idx = findIndex(this.tokens, function (o) {
          if (!o.isNative) {
            return o.contractAddress.toString().toLowerCase().trim() === contractAddress.toString().toLowerCase().trim();
          }
        });
      }

      return idx;
    }
  }, {
    key: "fetchTransactions",
    value: function () {
      var _fetchTransactions = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee15() {
        return regeneratorRuntime.wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                _context15.next = 2;
                return this.fetchEthTransactions();

              case 2:
                return _context15.abrupt("return", this.transactions);

              case 3:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function fetchTransactions() {
        return _fetchTransactions.apply(this, arguments);
      }

      return fetchTransactions;
    }()
  }, {
    key: "fetchEthTransactions",
    value: function () {
      var _fetchEthTransactions = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee16() {
        var _this11 = this;

        var networkUrl;
        return regeneratorRuntime.wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                networkUrl = "".concat(this.API_URL, "api?module=account&action=txlist&address=").concat(this.getAddress(), "&startblock=0&endblock=99999999&sort=desc&apikey=YourApiKeyToken");
                return _context16.abrupt("return", fetch(networkUrl).then(function (response) {
                  return response.json();
                }).then(function (res) {
                  return res.result;
                }).then(function (transactions) {
                  _this11._lastPolling = new Date().getTime();
                  _this11.transactions = transactions.filter(function (o) {
                    return o.value !== '0';
                  }).map(function (t) {
                    return {
                      from: t.from,
                      timestamp: t.timeStamp,
                      transactionHash: t.hash,
                      type: t.type,
                      value: parseFloat(_this11.web3.utils.fromWei(t.value, 'ether')).toFixed(5)
                    };
                  });
                  return _this11.transactions;
                })["catch"](function (e) {
                  return console.log(e);
                }));

              case 2:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function fetchEthTransactions() {
        return _fetchEthTransactions.apply(this, arguments);
      }

      return fetchEthTransactions;
    }()
  }, {
    key: "getERC20Transactions",
    value: function getERC20Transactions(contractAddress) {
      if (isUndefined(contractAddress) || contractAddress === '') {
        throw new Error('contractAddress: is undefined');
      }

      var idx = this.findTokenIdx(contractAddress);
      return this.tokens[idx].transactions;
    }
  }, {
    key: "fetchERC20Transactions",
    value: function () {
      var _fetchERC20Transactions = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee17(contractAddress) {
        var _this12 = this;

        var url;
        return regeneratorRuntime.wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                if (!(isUndefined(contractAddress) || contractAddress === '')) {
                  _context17.next = 2;
                  break;
                }

                throw new Error('contractAddress: is undefined');

              case 2:
                url = "https://blockscout.com/eth/mainnet/api?module=account&action=tokentx&address=".concat(this.getAddress(), "&contractaddress=").concat(contractAddress, "&sort=desc");
                return _context17.abrupt("return", fetch(url).then(function (response) {
                  return response.json();
                }).then(function (data) {
                  var idx = findIndex(_this12.tokens, ['contractAddress', contractAddress]);
                  _this12.tokens[idx]._lastPolling = new Date().getTime();
                  _this12.tokens[idx].transactions = (data.result || []).map(function (t) {
                    return {
                      from: t.from,
                      timestamp: t.timestamp,
                      transactionHash: t.hash,
                      symbol: t.tokenSymbol,
                      type: 'transfer',
                      value: (parseInt(t.value, 10) / Math.pow(10, t.tokenDecimal)).toFixed(2)
                    };
                  });
                }));

              case 4:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function fetchERC20Transactions(_x11) {
        return _fetchERC20Transactions.apply(this, arguments);
      }

      return fetchERC20Transactions;
    }() // TODO tests

  }, {
    key: "loadTokensList",
    value: function () {
      var _loadTokensList = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee18() {
        var _this13 = this;

        var pruneCache,
            _args18 = arguments;
        return regeneratorRuntime.wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                pruneCache = _args18.length > 0 && _args18[0] !== undefined ? _args18[0] : false;

                if (!(this.tokens.length > 0 && pruneCache === false)) {
                  _context18.next = 3;
                  break;
                }

                return _context18.abrupt("return", this.tokens);

              case 3:
                return _context18.abrupt("return", fetch("https://api.ethplorer.io/getAddressInfo/".concat(this.getAddress(), "?apiKey=freekey")).then(function (response) {
                  return response.json();
                }).then(function (data) {
                  if (!data.tokens) {
                    return;
                  }

                  var tokens = data.tokens.map(function (token) {
                    var tokenDecimal = parseInt(token.tokenInfo.decimals, 10);
                    var balance = parseFloat(new BigNumber(token.balance).div(new BigNumber(10).pow(tokenDecimal)).toString());
                    return new Token(token.tokenInfo.address, tokenDecimal, token.tokenInfo.name, token.tokenInfo.symbol, "https://raw.githubusercontent.com/TrustWallet/tokens/master/images/".concat(token.tokenInfo.address, ".png"), token.tokenInfo.price, balance, new BigNumber(token.balance));
                  });
                  _this13.tokens = tokens;
                  return _this13.tokens;
                }));

              case 4:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function loadTokensList() {
        return _loadTokensList.apply(this, arguments);
      }

      return loadTokensList;
    }() // TODO tests

    /**
     * Send an ETH transaction to the given address with the given amount
     *
     * @param {String} toAddress
     * @param {String} amount
     */

  }, {
    key: "sendTransaction",
    value: function sendTransaction(_ref5, toAddress, amount) {
      var contractAddress = _ref5.contractAddress,
          decimals = _ref5.decimals,
          isNative = _ref5.isNative;
      var gasLimit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 21000;
      var gasPrice = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 21;

      if (isNative) {
        return this.sendCoinTransaction(toAddress, amount, gasLimit, gasPrice);
      }

      return this.sendERC20Transaction(contractAddress, decimals, toAddress, amount, gasLimit);
    } // TODO tests

    /**
     * Send an ETH transaction to the given address with the given amount
     *
     * @param {String} toAddress
     * @param {String} amount
     */

  }, {
    key: "sendCoinTransaction",
    value: function () {
      var _sendCoinTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee19(toAddress, amount) {
        var _this14 = this;

        return regeneratorRuntime.wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                return _context19.abrupt("return", new Promise(function (resolve, reject) {
                  _this14.web3.eth.sendTransaction({
                    to: toAddress,
                    value: _this14.web3.utils.toWei(amount.toString())
                  }, function (error, transaction) {
                    if (error) {
                      reject(error);
                    }

                    _this14._lastPolling = null;

                    _this14.transactions.push(transaction);

                    resolve(transaction);
                  });
                }));

              case 1:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19);
      }));

      function sendCoinTransaction(_x12, _x13) {
        return _sendCoinTransaction.apply(this, arguments);
      }

      return sendCoinTransaction;
    }() // TODO tests

    /**
     * Send an ETH erc20 transaction to the given address with the given amount
     *
     * @param {String} toAddress
     * @param {String} amount
     */

  }, {
    key: "sendERC20Transaction",
    value: function () {
      var _sendERC20Transaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee20(contractAddress, decimals, toAddress, amount, gasLimit) {
        var _this15 = this;

        return regeneratorRuntime.wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                console.log('gasLimit', gasLimit);
                return _context20.abrupt("return", new Promise(function (resolve, reject) {
                  var token = new _this15.web3.eth.Contract(erc20Abi, contractAddress);
                  token.methods.transfer(toAddress, amount * Math.pow(10, decimals)).send({
                    from: _this15.getAddress(),
                    gasLimit: gasLimit
                  }, function (error, transaction) {
                    if (error) {
                      reject(error);
                    }

                    resolve(transaction);
                  });
                }));

              case 2:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20);
      }));

      function sendERC20Transaction(_x14, _x15, _x16, _x17, _x18) {
        return _sendERC20Transaction.apply(this, arguments);
      }

      return sendERC20Transaction;
    }()
  }, {
    key: "estimateERC20Transaction",
    value: function () {
      var _estimateERC20Transaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee22(_ref6, toAddress, amount) {
        var _this16 = this;

        var contractAddress, isNative, decimals;
        return regeneratorRuntime.wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                contractAddress = _ref6.contractAddress, isNative = _ref6.isNative, decimals = _ref6.decimals;
                return _context22.abrupt("return", new Promise(
                /*#__PURE__*/
                function () {
                  var _ref7 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee21(resolve, reject) {
                    var token, gas;
                    return regeneratorRuntime.wrap(function _callee21$(_context21) {
                      while (1) {
                        switch (_context21.prev = _context21.next) {
                          case 0:
                            console.log('estimateERC20Transaction', [contractAddress, isNative, decimals, toAddress]);

                            if (!isNative) {
                              _context21.next = 4;
                              break;
                            }

                            resolve(21000);
                            return _context21.abrupt("return");

                          case 4:
                            token = new _this16.web3.eth.Contract(erc20Abi, contractAddress);
                            _context21.next = 7;
                            return token.methods.transfer(toAddress, amount * Math.pow(10, decimals)).estimateGas({
                              from: _this16.getAddress()
                            });

                          case 7:
                            gas = _context21.sent;
                            console.log('gas', gas);
                            resolve(gas);

                          case 10:
                          case "end":
                            return _context21.stop();
                        }
                      }
                    }, _callee21);
                  }));

                  return function (_x22, _x23) {
                    return _ref7.apply(this, arguments);
                  };
                }()));

              case 2:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22);
      }));

      function estimateERC20Transaction(_x19, _x20, _x21) {
        return _estimateERC20Transaction.apply(this, arguments);
      }

      return estimateERC20Transaction;
    }()
    /**
     * Sign raw Transaction
     *
     * @param {String} toAddress
     * @param {String} amount
     */

  }, {
    key: "signRawTx",
    value: function signRawTx(txData) {
      var tx = new EthereumTx(txData);
      var privateKeyHex = new Buffer(this.getPrivateKey(), 'hex');
      tx.sign(privateKeyHex);
      return tx.serialize();
    }
  }], [{
    key: "checkMetaMask",
    value: function checkMetaMask() {
      var _window2 = window,
          web3 = _window2.web3,
          ethereum = _window2.ethereum;
      return new Promise(
      /*#__PURE__*/
      function () {
        var _ref8 = _asyncToGenerator(
        /*#__PURE__*/
        regeneratorRuntime.mark(function _callee23(resolve) {
          return regeneratorRuntime.wrap(function _callee23$(_context23) {
            while (1) {
              switch (_context23.prev = _context23.next) {
                case 0:
                  // Metamask is not installed
                  if (typeof web3 === 'undefined' || typeof ethereum === 'undefined') {
                    resolve('NOWEB3');
                  } // Metamask is locked


                  console.log('web3', web3);

                  try {
                    web3.eth.getAccounts(function (err, _accounts) {
                      console.log(_accounts);
                      if (_accounts.length > 0) resolve('READY');else resolve('LOCKED');
                    });
                  } catch (e) {
                    console.log('e', e);
                  }

                  return _context23.abrupt("return", null);

                case 4:
                case "end":
                  return _context23.stop();
              }
            }
          }, _callee23);
        }));

        return function (_x24) {
          return _ref8.apply(this, arguments);
        };
      }());
    }
  }]);

  return EthereumHDWallet;
}(HDWallet);

var xDAIHDWallet =
/*#__PURE__*/
function (_EthereumHDWallet) {
  _inherits(xDAIHDWallet, _EthereumHDWallet);

  /**
   * Accepts Valid bip32 passphrase
   * @param  {} secret=''
   */
  function xDAIHDWallet() {
    var _this;

    var secret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, xDAIHDWallet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(xDAIHDWallet).call(this, secret, address));
    _this.type = 'xDAIHDWallet';
    _this.name = 'xDAI Wallet';
    _this.symbol = 'xDAI';
    _this.networkUrl = 'https://dai.poa.network/'; // this.CHAIN_ID = 64;

    _this.API_URL = 'https://blockscout.com/poa/dai/';

    if (secret) {
      _this.setWeb3();
    }

    return _this;
  }

  _createClass(xDAIHDWallet, [{
    key: "getGasPrice",
    value: function () {
      var _getGasPrice = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", new Promise(function (resolve, reject) {
                  _this2.gasPrice = _this2.web3.utils.fromWei(1, 'gwei');
                  resolve(_this2.gasPrice);
                }));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getGasPrice() {
        return _getGasPrice.apply(this, arguments);
      }

      return getGasPrice;
    }()
  }, {
    key: "sendCoinTransaction",
    value: function () {
      var _sendCoinTransaction = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(toAddress, amount) {
        var _this3 = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (resolve, reject) {
                  _this3.web3.eth.sendTransaction({
                    to: toAddress,
                    value: _this3.web3.toWei(amount),
                    gasPrice: 1000000000
                  }, function (error, transaction) {
                    if (error) {
                      reject(error);
                    } // console.log('transaction', transaction);


                    resolve(transaction);
                  });
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function sendCoinTransaction(_x, _x2) {
        return _sendCoinTransaction.apply(this, arguments);
      }

      return sendCoinTransaction;
    }()
  }, {
    key: "fetchEthTransactions",
    value: function () {
      var _fetchEthTransactions = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var _this4 = this;

        var networkUrl;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                networkUrl = "".concat(this.API_URL, "api?module=account&action=txlist&address=").concat(this.getAddress(), "&sort=desc");
                return _context3.abrupt("return", fetch$1(networkUrl).then(function (response) {
                  return response.json();
                }).then(function (res) {
                  return res.result;
                }).then(function (transactions) {
                  _this4.transactions = transactions.map(function (t) {
                    return {
                      from: t.from,
                      timestamp: t.timeStamp,
                      transactionHash: t.hash,
                      type: t.contractAddress !== '' ? 'transfer' : 'contract',
                      value: _this4.web3.utils.fromWei(t.value, 'ether'),
                      currency: 'xDAI'
                    };
                  });
                  return _this4.transactions;
                }));

              case 2:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetchEthTransactions() {
        return _fetchEthTransactions.apply(this, arguments);
      }

      return fetchEthTransactions;
    }()
  }, {
    key: "fetchERC20Transactions",
    value: function () {
      var _fetchERC20Transactions = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(contractAddress) {
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", null);

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function fetchERC20Transactions(_x3) {
        return _fetchERC20Transactions.apply(this, arguments);
      }

      return fetchERC20Transactions;
    }() // TODO tests

    /**
     * Load the tokens based on network
     */

  }, {
    key: "loadTokensList",
    value: function () {
      var _loadTokensList = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                return _context5.abrupt("return", null);

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function loadTokensList() {
        return _loadTokensList.apply(this, arguments);
      }

      return loadTokensList;
    }()
  }]);

  return xDAIHDWallet;
}(EthereumHDWallet);

var ENSResolver =
/*#__PURE__*/
function () {
  function ENSResolver() {
    _classCallCheck(this, ENSResolver);

    this.networkUrl = 'https://mainnet.infura.io/Q1GYXZMXNXfKuURbwBWB';
    var provider = new Web3.providers.HttpProvider(this.networkUrl);
    this.CHAIN_ID = 1;
    this.instance = new ENS({
      provider: provider,
      network: this.CHAIN_ID.toString()
    });
  }

  _createClass(ENSResolver, [{
    key: "byAddress",
    value: function byAddress(address) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        try {
          _this.instance.reverse(address).then(function (domain) {
            try {
              resolve(domain);
            } catch (e) {
              reject(e);
            }
          })["catch"](function (reason) {
            try {
              reject(reason);
            } catch (e) {
              reject(reason);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  }, {
    key: "byDomain",
    value: function byDomain(domain) {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        try {
          _this2.instance.lookup(domain).then(function (address) {
            try {
              resolve(address);
            } catch (e) {
              reject(e);
            }
          })["catch"](function (reason) {
            try {
              reject(reason);
            } catch (e) {
              reject(reason);
            }
          });
        } catch (e) {
          reject(e);
        }
      });
    }
  }]);

  return ENSResolver;
}();

var EthereumHDWalletKovan =
/*#__PURE__*/
function (_EthereumHDWallet) {
  _inherits(EthereumHDWalletKovan, _EthereumHDWallet);

  /**
     * Accepts Valid bip32 passphrase
     * @param  {} secret=''
     */
  function EthereumHDWalletKovan() {
    var _this;

    var secret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, EthereumHDWalletKovan);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EthereumHDWalletKovan).call(this, secret, address));
    _this.type = 'EthereumHDWalletKovan';
    _this.name = 'DexWallet Kovan';
    _this.networkUrl = 'https://kovan.infura.io/Q1GYXZMXNXfKuURbwBWB';
    _this.API_URL = 'https://api-kovan.etherscan.io/';

    if (secret) {
      _this.setWeb3();
    }

    return _this;
  }

  _createClass(EthereumHDWalletKovan, [{
    key: "fetchERC20Transactions",
    value: function () {
      var _fetchERC20Transactions = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(contractAddress) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", null);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function fetchERC20Transactions(_x) {
        return _fetchERC20Transactions.apply(this, arguments);
      }

      return fetchERC20Transactions;
    }() // TODO tests

    /**
       * Load the tokens based on network
       */

  }, {
    key: "loadTokensList",
    value: function () {
      var _loadTokensList = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", null);

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function loadTokensList() {
        return _loadTokensList.apply(this, arguments);
      }

      return loadTokensList;
    }()
  }]);

  return EthereumHDWalletKovan;
}(EthereumHDWallet);

var EthereumHDWalletRopsten =
/*#__PURE__*/
function (_EthereumHDWallet) {
  _inherits(EthereumHDWalletRopsten, _EthereumHDWallet);

  /**
     * Accepts Valid bip32 passphrase
     * @param  {} secret=''
     */
  function EthereumHDWalletRopsten() {
    var _this;

    var secret = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var address = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, EthereumHDWalletRopsten);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(EthereumHDWalletRopsten).call(this, secret, address));
    _this.type = 'EthereumHDWalletRopsten';
    _this.name = 'Ropsten wallet';
    _this.networkUrl = 'https://ropsten.infura.io/Q1GYXZMXNXfKuURbwBWB';
    _this.API_URL = 'https://api-ropsten.etherscan.io/';
    _this.CHAIN_ID = 3;

    if (secret) {
      _this.setWeb3();
    }

    return _this;
  }

  _createClass(EthereumHDWalletRopsten, [{
    key: "fetchERC20Transactions",
    value: function () {
      var _fetchERC20Transactions = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(contractAddress) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", null);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function fetchERC20Transactions(_x) {
        return _fetchERC20Transactions.apply(this, arguments);
      }

      return fetchERC20Transactions;
    }() // TODO tests

    /**
       * Load the tokens based on network
       */

  }, {
    key: "loadTokensList",
    value: function () {
      var _loadTokensList = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var url;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(this.tokens.length > 0)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", this.tokens);

              case 2:
                url = "https://blockscout.com/eth/ropsten/api?module=account&action=tokenlist&address=".concat(this.getAddress());
                return _context2.abrupt("return", fetch$1(url).then(function (response) {
                  return response.json();
                }).then(function (data) {
                  if (!data.result) {
                    return;
                  }

                  var tokens = data.result.map(function (token) {
                    var tokenDecimal = parseInt(token.decimals, 10);
                    var balance = parseFloat(new BigNumber(token.balance).div(new BigNumber(10).pow(tokenDecimal)).toString());
                    return new Token(token.contractAddress, tokenDecimal, token.name, token.symbol, "https://raw.githubusercontent.com/TrustWallet/tokens/master/images/".concat(token.contractAddress, ".png"), {}, balance, new BigNumber(token.balance));
                  });
                  var coin = defaultTokens[0];
                  coin.balance = _this2.balance;
                  _this2.tokens = tokens; // console.log('tokens', tokens);

                  return _this2.tokens;
                }));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function loadTokensList() {
        return _loadTokensList.apply(this, arguments);
      }

      return loadTokensList;
    }()
  }]);

  return EthereumHDWalletRopsten;
}(EthereumHDWallet);

var LegacyEthereum = function LegacyEthereum(privateKey) {
  _classCallCheck(this, LegacyEthereum);

  this.type = 'EthereumLegacyWallet';
  this.secret = privateKey;
  var wallet = EthereumJsWallet.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  this.instanceWallet = wallet;
};

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

exports.HDWallet = HDWallet;
exports.WatcherTx = WatcherTx;
exports.xDAIHDWallet = xDAIHDWallet;
exports.ENSResolver = ENSResolver;
exports.EthereumHDWallet = EthereumHDWallet;
exports.EthereumHDWalletKovan = EthereumHDWalletKovan;
exports.EthereumHDWalletRopsten = EthereumHDWalletRopsten;
exports.LegacyWallet = LegacyEthereum;
