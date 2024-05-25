import pino from 'pino'
import config from 'config'

const logLevel = config.get<string>('logLevel')

export const Logger = pino({
  level: logLevel || 'warn',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      levelFirst: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: '{msg}',
    },
  },
  redact: ['password', 'salt'],
})
