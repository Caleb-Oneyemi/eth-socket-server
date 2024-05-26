export interface GetBlockNumberResponse {
  id: number
  jsonrpc: string
  result: string
}

export interface Transaction {
  blockHash: string
  blockNumber: string
  from: string
  gas: string
  gasPrice: string
  maxFeePerGas: string
  maxPriorityFeePerGas: string
  hash: string
  input: string
  nonce: string
  to: string
  transactionIndex: string
  value: string
  type: string
  accessList: []
  chainId: string
  v: string
  r: string
  s: string
  yParity: string
}

export interface GetLatestBlockResponse {
  id: number
  jsonrpc: string
  result: {
    baseFeePerGas: string
    blobGasUsed: string
    difficulty: string
    excessBlobGas: string
    extraData: string
    gasLimit: string
    gasUsed: string
    hash: string
    logsBloom: string
    miner: string
    mixHash: string
    nonce: string
    number: string
    parentBeaconBlockRoot: string
    parentHash: string
    receiptsRoot: string
    sha3Uncles: string
    size: string
    stateRoot: string
    timestamp: string
    totalDifficulty: string
    transactions: Array<Transaction>
  }
}
