import { CronJob } from 'cron'
import { handleTransactions } from './jobs'
import { Server } from 'socket.io'

/** runs every 12 seconds */
export const startJob = (io: Server): void => {
  CronJob.from({
    cronTime: '*/12 * * * * *',
    onTick: () => handleTransactions(io),
    start: true,
  })
}
