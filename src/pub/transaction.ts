import { Server } from 'socket.io'
import { SUBSCRIPTION_TYPES, Transaction, getRoom } from '../common'

export const publishTransaction = (
  io: Server,
  ethTransaction: Transaction,
): void => {
  const event = {
    senderAddress: ethTransaction.from,
    receiverAddress: ethTransaction.to,
    blockNumber: ethTransaction.blockNumber,
    blockHash: ethTransaction.blockHash,
    transactionHash: ethTransaction.hash,
    gasPriceInWei: parseInt(ethTransaction.gasPrice, 16),
    valueInWei: parseInt(ethTransaction.value, 16),
  }

  const rooms = [
    getRoom(SUBSCRIPTION_TYPES.ALL, ''),
    getRoom(SUBSCRIPTION_TYPES.SENDER_ONLY, event.senderAddress),
    getRoom(SUBSCRIPTION_TYPES.RECEIVER_ONLY, event.receiverAddress),
    getRoom(SUBSCRIPTION_TYPES.SENDER_OR_RECEIVER, event.senderAddress),
    getRoom(SUBSCRIPTION_TYPES.SENDER_OR_RECEIVER, event.receiverAddress),
  ]

  rooms.map((room) => {
    io.send(room).emit('new_activity', event)
  })
}
