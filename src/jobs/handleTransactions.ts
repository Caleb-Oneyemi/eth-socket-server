import axios from 'axios'

import {
  GetBlockNumberResponse,
  GetLatestBlockResponse,
  Logger,
} from '../common'
import config from 'config'
import { publishTransaction } from '../pub'
import { Server } from 'socket.io'

export const handleTransactions = async (io: Server): Promise<void> => {
  Logger.debug(
    `@handleTransactionsJob starting --- ${new Date().toISOString()}`,
  )

  const roomCount = io.sockets?.adapter?.rooms?.size
  if (!roomCount) {
    Logger.debug(
      `@handleTransactionsJob exiting. no available rooms. ${new Date().toISOString()}`,
    )
    return
  }

  const url = config.get<string>('providerUrl')
  if (!url) {
    Logger.warn('@handleTransactionsJob PROVIDER_URL not provided')
    return
  }

  try {
    const { data: blockNumberRes } = await axios.post<GetBlockNumberResponse>(
      url,
      {
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      },
    )

    if (!blockNumberRes.result) {
      Logger.warn(`@handleTransactionsJob could not retrieve block number`)
      return
    }

    Logger.debug(
      `@handleTransactionsJob retrieved block number ${blockNumberRes.result}`,
    )

    const { data } = await axios.post<GetLatestBlockResponse>(url, {
      jsonrpc: '2.0',
      method: 'eth_getBlockByNumber',
      params: [blockNumberRes.result, true],
      id: 1,
    })

    Logger.debug(
      `@handleTransactionsJob retrieved ${data.result?.transactions?.length || 0} transactions for block number ${blockNumberRes.result}`,
    )

    if (data.result?.transactions?.length) {
      data.result?.transactions.map((t) => {
        publishTransaction(io, t)
      })
    }
  } catch (err: any) {
    Logger.warn(`@handleTransactionsJob failed --- ${err.message}`)
  }

  Logger.debug(`@handleTransactionsJob done --- ${new Date().toISOString()}`)
}
