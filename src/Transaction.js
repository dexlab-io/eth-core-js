class Transaction {
  static build(obj) {
    let t = new Transaction();
    t = {
      ...t,
      ...obj,
    };
    return t;
  }

  constructor(
    hash = null,
    from = null,
    timestamp = (new Date()).getTime(),
    symbol = null,
    type = null, // ??
    value = null,
    status = 'Unknown',
    label = null,
    blockHash = null,
    contractAddress = null,
    cumulativeGasUsed = null,
    gasUsed = null,
    gasPrice = null,
    gasLimit = null,
    logs = null,
    to = null,
    nonce = null,
  ) {
    this.hash = hash;
    this.from = from;
    this.timestamp = timestamp;
    this.symbol = symbol;
    this.type = type;
    this.value = value;
    this.status = status;
    this.label = label;
    this.blockHash = blockHash;
    this.contractAddress = contractAddress;
    this.cumulativeGasUsed = cumulativeGasUsed;
    this.from = from;
    this.gasUsed = gasUsed;
    this.gasPrice = gasPrice;
    this.gasLimit = gasLimit;
    this.logs = logs;
    this.to = to;
    this.nonce = nonce;
  }
}

export default Transaction;
