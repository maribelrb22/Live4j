import dotenv from 'dotenv'
import { Neo4jConfiguration } from './types'

dotenv.config()

const DEFAULT_CONFIGURATION: Neo4jConfiguration = {
    NEO4J_SERVER: 'neo4j://localhost',
    NEO4J_DATABASE: 'neo4j',
    NEO4J_USERNAME: 'neo4j',
    NEO4J_PASSWORD: 'neo4j'
}

export function getNeo4jConfiguration(): Neo4jConfiguration {
    const {
        NEO4J_SERVER = DEFAULT_CONFIGURATION.NEO4J_SERVER,
        NEO4J_DATABASE = DEFAULT_CONFIGURATION.NEO4J_DATABASE,
        NEO4J_USERNAME = DEFAULT_CONFIGURATION.NEO4J_USERNAME,
        NEO4J_PASSWORD = DEFAULT_CONFIGURATION.NEO4J_PASSWORD
    } = process.env

    return { NEO4J_DATABASE, NEO4J_SERVER, NEO4J_USERNAME, NEO4J_PASSWORD }
}
