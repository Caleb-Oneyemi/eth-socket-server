import config from 'config'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'

const { host, port, username, password, name } = config.get<{
  host: string
  port: number
  username: string
  password: string
  name: string
}>('db')

const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database: name,
  synchronize: true,
  logging: false,
  entities: ['./src/modules/users/entity{.ts,.js}'],
  migrations: ['./src/migrations/*{.ts,.js}'],
}

export default dbConfig
