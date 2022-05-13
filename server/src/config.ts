import dotenv from 'dotenv'
import path from 'path'
import { GlobalConfiguration } from './types'

const configFilePath = path.resolve(
    process.cwd(),
    process.env.NODE_ENV === 'production' ? '.env.prod' : '.env'
)
dotenv.config({
    path: configFilePath
})

const DEFAULT_CONFIGURATION: GlobalConfiguration = {
    NEO4J_SERVER: 'localhost',
    NEO4J_DATABASE: 'neo4j',
    NEO4J_USERNAME: 'neo4j',
    NEO4J_PASSWORD: 'neo4j',
    WSS_PORT: 3123
}

export function getConfiguration(): GlobalConfiguration {
    const {
        NEO4J_SERVER = DEFAULT_CONFIGURATION.NEO4J_SERVER,
        NEO4J_DATABASE = DEFAULT_CONFIGURATION.NEO4J_DATABASE,
        NEO4J_USERNAME = DEFAULT_CONFIGURATION.NEO4J_USERNAME,
        NEO4J_PASSWORD = DEFAULT_CONFIGURATION.NEO4J_PASSWORD,
        WSS_PORT = DEFAULT_CONFIGURATION.WSS_PORT
    } = process.env

    return {
        NEO4J_DATABASE,
        NEO4J_SERVER,
        NEO4J_USERNAME,
        NEO4J_PASSWORD,
        WSS_PORT: Number(WSS_PORT)
    }
}
