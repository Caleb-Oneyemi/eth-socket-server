import * as typedi from 'typedi'
import { Connection, createConnection, useContainer } from 'typeorm'
import { Container } from 'typeorm-typedi-extensions'
import dbConfig from '../../ormconfig'

const connect = async (): Promise<{ connection: Connection }> => {
  useContainer(Container)
  const connection = await createConnection(dbConfig)

  await connection.runMigrations({ transaction: 'all' })

  typedi.Container.set('connection', connection)

  return { connection }
}

export default connect
